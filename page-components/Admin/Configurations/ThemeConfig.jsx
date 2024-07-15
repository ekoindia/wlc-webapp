import { Box, Flex, Text, useDisclosure, useToken } from "@chakra-ui/react";
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
import { useSession } from "contexts";
import { fetcher } from "helpers";
import { useFeatureFlag } from "hooks";
import { useEffect, useState } from "react";
import { generateShades } from "utils";
import { AppPreview } from ".";

/**
 * Component to configure the theme colors of the app.
 * Users can select a predefined color theme or set their own primary and accent colors.
 */
const ThemeConfig = () => {
	const [selectedTheme, setSelectedTheme] = useState(null);
	const [selectedThemeIdx, setSelectedThemeIdx] = useState(-2);
	const [navStyle, setNavStyle] = useState("");
	const [landingPageStyle, setLandingPageStyle] = useState("");
	const [isConfigEnabled] = useFeatureFlag("CUSTOM_THEME");
	const { accessToken } = useSession();
	const { isOpen, onOpen, onClose } = useDisclosure();

	// Get current theme color values
	const [
		primary,
		primary_light,
		primary_dark,
		accent,
		accent_light,
		accent_dark,
	] = useToken("colors", [
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
		// TODO: Get the current navbar style (light or dark)

		// Set the current color theme
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

	const handleSubmit = () => {
		console.log("SUBMIT");
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
								value: selectedTheme,
							},
						],
					},
				},
				token: accessToken,
			}
		)
			.then((res) => {
				console.log("res", res);
				onClose();
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

				<Flex direction="column" gap="6">
					<Box>
						<Radio
							label="Select Menu Bar Style"
							options={[
								{ label: "Default", value: "" },
								{ label: "Light", value: "light" },
							]}
							required
							onChange={(e) => setNavStyle(e)}
						/>
					</Box>

					<Box>
						<Label required>Select a Color Theme</Label>
						<Flex direction="row" gap={8} wrap="wrap">
							{colorThemes.map((theme, i) => (
								<ColorSelector
									key={i + theme.name}
									theme={theme}
									i={i}
									isSelected={selectedThemeIdx === i}
									onSelect={(theme, i) => {
										setSelectedTheme(theme);
										setSelectedThemeIdx(i);
									}}
								/>
							))}

							{/* Add custom color selector */}
							{isConfigEnabled && (
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
										selectedThemeIdx === -1 && selectedTheme
									}
									onSelect={(theme, i) => {
										setSelectedTheme(theme);
										setSelectedThemeIdx(i);
									}}
								/>
							)}
						</Flex>

						{/* Custom Theme Editor Section */}
						{isConfigEnabled && selectedThemeIdx === -1 ? (
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
				</Flex>
			</Section>

			<Section title="Landing Page">
				<Radio
					label="Select Landing Page Style"
					options={[
						{ label: "Splash Screen (Default)", value: "card" },
						{ label: "Landing Page", value: "page" },
					]}
					value={landingPageStyle}
					required
					onChange={(e) => setLandingPageStyle(e)}
				/>
			</Section>

			<Button onClick={() => onOpen()}>Save</Button>

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
							You are about to change theme for all your network.
							All your users will see the new colors after next
							login.
						</Text>
						<Text fontWeight="semibold">
							Are you sure you want to continue?
						</Text>
					</Flex>
					<Button onClick={() => handleSubmit()}>Apply</Button>
				</Flex>
			</Modal>
		</Flex>
	);
};

export default ThemeConfig;

/**
 * Section card component
 * @param root0
 * @param root0.title
 * @param root0.children
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
				color={theme.primary_dark || theme.primary}
				opacity={0.6}
			>
				{theme.name}
			</Text>
		</Flex>
	);
};
