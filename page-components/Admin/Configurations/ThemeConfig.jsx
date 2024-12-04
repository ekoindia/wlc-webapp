import {
	Box,
	Flex,
	Grid,
	GridItem,
	Text,
	useDisclosure,
	useToast,
	useToken,
} from "@chakra-ui/react";
import {
	Button,
	ColorPair,
	ColorPickerWidget,
	Icon,
	InputLabel as Label,
	Modal,
	Radio,
} from "components";
import { colorThemes, Endpoints, TransactionIds } from "constants";
import { OrgDetailSessionStorageKey, useSession } from "contexts";
import { fetcher } from "helpers";
import { useFeatureFlag, useSessionStorage, useRaiseIssue } from "hooks";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { generateShades } from "utils";
import { AppPreview, LandingPagePreview } from ".";

const getStatus = (status) => {
	switch (status) {
		case 0:
			return "success";
		default:
			return "error";
	}
};

/**
 * Component to configure the theme colors of the app.
 * Users can select a predefined color theme or set their own primary and accent colors.
 */
const ThemeConfig = () => {
	const [currentTheme, setCurrentTheme] = useState(null);
	const [selectedTheme, setSelectedTheme] = useState(null);
	const [selectedThemeIdx, setSelectedThemeIdx] = useState(-2);
	const [navStyle, setNavStyle] = useState("");
	const [landingPageStyle, setLandingPageStyle] = useState("");
	const [isCustomThemeCreatorEnabled] = useFeatureFlag(
		"CUSTOM_THEME_CREATOR"
	);
	const [isCmsLandingPageEnabled] = useFeatureFlag("CMS_LANDING_PAGE");

	const [isManualLandingPageImageSetupEnabled] = useFeatureFlag(
		"MANUAL_LANDING_PAGE_IMAGE_SETUP"
	);
	const { accessToken } = useSession();
	const { isOpen, onOpen, onClose } = useDisclosure();
	const toast = useToast();
	const router = useRouter();
	const [orgDetail, setOrgDetail] = useSessionStorage(
		OrgDetailSessionStorageKey
	);
	const { showRaiseIssueDialog } = useRaiseIssue();

	// Get current theme color values
	const [
		navstyle,
		primary,
		primary_light,
		primary_dark,
		accent,
		accent_light,
		accent_dark,
	] = useToken("colors", [
		"navstyle",
		"primary.DEFAULT",
		"primary.light",
		"primary.dark",
		"accent.DEFAULT",
		"accent.light",
		"accent.dark",
	]);

	// Set default custom theme as the current theme. Users can change this.
	const [customTheme, setCustomTheme] = useState({
		primary,
		primary_light,
		primary_dark,
		accent,
		accent_light,
		accent_dark,
	});
	const [customThemeSet, setCustomThemeSet] = useState(false); // Whether user has edited & set a custom theme

	// Load Landing Page Style from LocalStorage & also set the current color theme
	useEffect(() => {
		// Set the current navbar style
		setNavStyle(navstyle || "default");

		// Set the current color theme
		setCurrentTheme({
			primary,
			primary_light,
			primary_dark,
			accent,
			accent_light,
			accent_dark,
		});

		// Set the selected color theme
		setSelectedTheme({
			primary,
			primary_light,
			primary_dark,
			accent,
			accent_light,
			accent_dark,
		});
		// console.log("Finding theme: ", colorThemes, { primary, accent });
		// Set index of the selected theme
		setSelectedThemeIdx(
			colorThemes.findIndex(
				(theme) => theme.primary == primary && theme.accent == accent
			)
		);

		// Set the current Landing Page Style
		const landingPageStyle = localStorage.getItem(
			"inf-landing-page-cms-conf"
		); // Eg: {"type":"page"}
		if (landingPageStyle) {
			setLandingPageStyle(JSON.parse(landingPageStyle).type);
		} else {
			setLandingPageStyle("card");
		}
	}, []);

	// Save the selected Landing Page Style to LocalStorage
	// TODO: Save on server
	useEffect(() => {
		// console.log("Selected Landing Page Style:", landingPageStyle);
		if (landingPageStyle === "page") {
			localStorage.setItem(
				"inf-landing-page-cms-conf",
				JSON.stringify({ type: "page" })
			);
		} else if (landingPageStyle === "card") {
			// Delete the key if the value is "card"
			localStorage.removeItem("inf-landing-page-cms-conf");
		}
	}, [landingPageStyle]);

	// Apply custom theme when selected by the user (and, if it is different than the predefined themes)
	// Calculate 10 degree darker and lighter shades of the primary & accent colors
	useEffect(() => {
		if (
			customTheme?.primary &&
			customTheme?.accent &&
			selectedThemeIdx === -1
		) {
			// Calculate darker and lighter shades
			const { dark: primary_dark, light: primary_light } = generateShades(
				customTheme.primary,
				10
			);
			const { dark: accent_dark, light: accent_light } = generateShades(
				customTheme.accent,
				10
			);

			// console.log("Custom Theme:>>>> ", {
			// 	primary: customTheme.primary,
			// 	primary_dark,
			// 	primary_light,
			// 	accent: customTheme.accent,
			// 	accent_dark,
			// 	accent_light,
			// });

			// Set if custom theme has been edited by the user
			if (
				customTheme?.primary != primary ||
				customTheme?.accent != accent
			) {
				setCustomThemeSet(true);
			} else {
				setCustomThemeSet(false);
			}

			setSelectedTheme({
				...customTheme,
				primary_light,
				primary_dark,
				accent_light,
				accent_dark,
			});
		}
	}, [customTheme, primary, accent]);

	const _customThemePreview = customTheme?.primary
		? {
				primary: customTheme?.primary,
				accent: customTheme?.accent,
			}
		: {
				primary: selectedTheme?.primary,
				accent: selectedTheme?.accent,
			};

	const handleThemeSelect = (theme, i) => {
		setSelectedTheme({
			primary: theme.primary,
			primary_light: theme.primary_light,
			primary_dark: theme.primary_dark,
			accent: theme.accent,
			accent_light: theme.accent_light,
			accent_dark: theme.accent_dark,
		});
		setSelectedThemeIdx(i);
	};

	const handleSubmit = () => {
		const _finalTheme = {
			...selectedTheme,
			navstyle: navStyle,
		};
		fetcher(
			process.env.NEXT_PUBLIC_API_BASE_URL + Endpoints.TRANSACTION_JSON,
			{
				body: {
					interaction_type_id: TransactionIds.UPDATE_ORG_DETAILS,
					orgDetails: {
						metadata: [
							{
								name: "theme",
								type: "json",
								value: _finalTheme,
							},
						],
					},
				},
				token: accessToken,
			}
		)
			.then((res) => {
				if (res?.status == 0) {
					// Update the orgDetail with the new theme
					const updatedOrgDetail = {
						...orgDetail,
						metadata: {
							...orgDetail.metadata,
							theme: _finalTheme,
						},
					};

					// Save the updated orgDetail to session storage
					setOrgDetail(updatedOrgDetail);

					// Show success toast
					toast({
						title: res.message,
						status: getStatus(res.status),
						duration: 6000,
						isClosable: true,
					});

					// Close modal
					onClose();

					// Clear Server Cache
					router.push({ pathname: "/clear_org_cache" });

					// Clear local & session storage
					clearCache();
				}
			})
			.catch((err) => {
				console.error("err", err);
			});
	};

	return (
		<Flex
			direction="column"
			gap={{ base: 4, md: 8 }}
			px={{ base: 4, md: 0 }}
		>
			<Section title="Colors">
				<AppPreview
					primary={selectedTheme?.primary || primary}
					primaryDark={selectedTheme?.primary_dark || primary_dark}
					accent={selectedTheme?.accent || accent}
					navStyle={navStyle}
				/>

				<Flex direction="column" gap="10" w="100%">
					<Radio
						label="Select Menu-Bar Style"
						options={[
							{ label: "Modern", value: "default" },
							{ label: "Classic", value: "light" },
						]}
						value={navStyle}
						onChange={(e) => setNavStyle(e)}
						required
					/>

					<Box w="100%">
						<Label required>Select a Color Theme</Label>
						<Grid
							templateColumns="repeat(auto-fill, minmax(100px, 1fr))"
							gap="6"
							pt="1"
						>
							{colorThemes.map((theme, i) => (
								<GridItem>
									<ColorSelector
										key={i + theme.name}
										theme={theme}
										i={i}
										isSelected={selectedThemeIdx === i}
										onSelect={handleThemeSelect}
									/>
								</GridItem>
							))}

							{/* Add custom color selector */}
							{isCustomThemeCreatorEnabled && (
								<GridItem>
									<ColorSelector
										theme={
											customThemeSet &&
											selectedThemeIdx === -1
												? {
														name: "Custom Theme",
														primary:
															_customThemePreview?.primary ||
															primary,
														accent:
															_customThemePreview?.accent ||
															accent,
													}
												: {
														name: "Custom Theme",
													}
										}
										i={-1}
										isSelected={
											selectedThemeIdx === -1 &&
											selectedTheme
										}
										onSelect={handleThemeSelect}
									/>
								</GridItem>
							)}
						</Grid>

						{/* Custom Theme Editor Section */}
						{isCustomThemeCreatorEnabled &&
						selectedThemeIdx === -1 ? (
							<Flex direction="column" mt={10}>
								<Label required>Select your Own Colors</Label>
								<table>
									<tbody>
										<tr>
											<td>Primary Color</td>
											<td>
												<ColorPickerWidget
													label="Change Color"
													themeEditor
													defaultColor={primary}
													width={300}
													onColorChange={(color) =>
														setCustomTheme({
															...customTheme,
															primary: color.hex,
														})
													}
												/>
											</td>
										</tr>
										<tr>
											<td>Accent Color</td>
											<td>
												<ColorPickerWidget
													label="Change Color"
													themeEditor
													defaultColor={accent}
													width={300}
													my={2}
													onColorChange={(color) =>
														setCustomTheme({
															...customTheme,
															accent: color.hex,
														})
													}
												/>
											</td>
										</tr>
									</tbody>
								</table>
							</Flex>
						) : null}
					</Box>

					<Button
						w={{ base: "auto", md: "180px" }}
						onClick={() => onOpen()}
						disabled={
							navStyle === navstyle &&
							currentTheme?.primary === selectedTheme?.primary &&
							currentTheme?.accent === selectedTheme?.accent
						}
						// disabled={areObjectsEqual(currentTheme, selectedTheme)}
					>
						Apply
					</Button>

					<Modal
						{...{
							id: "theme-consent",
							size: "sm",
							title: "Attention",
							isOpen,
							onClose,
						}}
					>
						<Flex direction="column" gap="4">
							<Flex direction="column" gap="2">
								<Text>
									You are about to change theme for all your
									network. All your users will see the new
									colors after next login.
								</Text>
								<Text fontWeight="semibold">
									Are you sure you want to continue?
								</Text>
							</Flex>
							{/* TODO: Use ActionButtonGroup here */}
							<Flex gap="2">
								<Button w="100%" onClick={() => handleSubmit()}>
									Save
								</Button>
								<Button
									w="100%"
									onClick={() => onClose()}
									variant="link"
								>
									Cancel
								</Button>
							</Flex>
						</Flex>
					</Modal>
				</Flex>
			</Section>

			{isManualLandingPageImageSetupEnabled && (
				<Section title="Landing Page Image">
					<LandingPagePreview
						primary={selectedTheme?.primary || primary}
						primaryDark={
							selectedTheme?.primary_dark || primary_dark
						}
						accent={selectedTheme?.accent || accent}
						accentLight={
							selectedTheme?.accent_light || accent_light
						}
					/>
					<Flex direction="column" gap={6}>
						<Text maxW={{ base: "100%", md: "600px" }}>
							Upload your own image for the landing/login page. We
							will set it up for you within two working days.
						</Text>
						<Box>
							<Button
								onClick={() =>
									showRaiseIssueDialog({
										origin: "Other",
										customIssueType:
											"Setup My Image for Eloka Landing Page",
										customIssueDetails: {
											category: "Admin Issues",
											subcategory: "App/Portal Related",
											desc: "Upload your own image for the landing page. We will set it up for you within two working days. Please ensure the image is of high quality and is relevant to your business.\n\n**Image Length x Height:** between 600x600 pixels to 800x800 pixels\n\n**Maximum Image Size:** 350KB",
											context: `Set Eloka portal custom landing page image.<br>Org ID: ${orgDetail?.org_id}<br>App Name: ${orgDetail?.app_name}<br><br><strong>STEPS:</strong><ol><li>Upload the attached image on "https://files.eko.in" server in the following location: /docs/org/${(orgDetail?.app_name || "" + orgDetail?.org_id)?.replaceAll(/ /g, "")}/welcome.jpg</li><li>Configure org-metadata in database for org_id=${orgDetail?.org_id}:</li></ol><pre>${JSON.stringify(
												{
													cms_meta: { type: "image" },
													cms_data: {
														img: `https://files.eko.in/docs/org/${(orgDetail?.app_name || "" + orgDetail?.org_id)?.replaceAll(/ /g, "")}/welcome.jpg`,
													},
												}
											)}</pre>`,
											tat: 2,
											screenshot: -1,
											files: [
												{
													label: "Image/Poster For Landing Page",
													accept: "image/*",
													is_required: true,
												},
											],
										},
									})
								}
							>
								Upload Image For Landing Page
							</Button>
						</Box>
					</Flex>
				</Section>
			)}

			{isCmsLandingPageEnabled && (
				<Section title="Landing Page">
					<Radio
						label="Select Landing Page Style"
						options={[
							{ label: "Splash Screen (Default)", value: "card" },
							{ label: "Landing Page", value: "page" },
						]}
						value={landingPageStyle}
						onChange={(e) => setLandingPageStyle(e)}
						required
					/>
				</Section>
			)}
		</Flex>
	);
};

export default ThemeConfig;

/**
 * Section card component
 * @param {*} props
 * @param {string} props.title Title of the section
 * @param {ReactNode} props.children Children components to be rendered inside the section
 */
const Section = ({ title, children }) => {
	return (
		<Flex
			direction="column"
			gap={{ base: 4, md: 8 }}
			bg="white"
			borderRadius={6}
			p={{ base: 4, md: 8 }}
		>
			{title ? (
				<Text as="h2" fontSize="24px" fontWeight="600" color="#444">
					{title}
				</Text>
			) : null}
			<Flex
				direction={{ base: "column", md: "row" }}
				gap={{ base: 4, md: 8, lg: 12 }}
			>
				{children}
			</Flex>
		</Flex>
	);
};

/**
 * Color selector component
 * @param {*} props
 * @param {object} props.theme Color theme object
 * @param {number} props.i Index of the theme
 * @param {boolean} props.isSelected Flag to indicate if the theme is selected
 * @param {Function} props.onSelect Function to handle theme selection
 */
const ColorSelector = ({ theme, i, isSelected, onSelect, ...rest }) => {
	return (
		<Flex
			direction="column"
			align="center"
			gap={1}
			cursor="pointer"
			onClick={() => onSelect && onSelect(theme, i)}
			{...rest}
		>
			<Flex
				direction="column"
				align="center"
				justify="center"
				position="relative"
				w="62px"
				h="62px"
				border={isSelected ? "3px solid #666" : ""}
				borderRadius="full"
			>
				{theme?.primary && theme?.accent ? (
					<ColorPair
						primary={theme.primary}
						accent={theme.accent}
						size="52px"
					/>
				) : (
					<Icon
						name="add"
						bg="#999"
						color="white"
						size="52px"
						p="14px"
						borderRadius="full"
					/>
				)}
				{isSelected ? (
					<Icon
						name="check"
						position="absolute"
						bottom="-6px"
						right="-8px"
						w="16px"
						h="16px"
						bg="success"
						color="white"
						border="2px solid #FFF"
						borderRadius="full"
						p="4px"
					/>
				) : null}
			</Flex>

			<Text
				fontFamily="Cursive"
				fontSize="xs"
				fontWeight={600}
				textAlign="center"
				userSelect="none"
				color={theme.primary_dark || theme.primary}
				opacity={0.6}
			>
				{theme.name}
			</Text>
		</Flex>
	);
};
