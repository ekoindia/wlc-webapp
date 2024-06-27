import { Box, Flex, Text, useToken } from "@chakra-ui/react";
import {
	ColorPair,
	ColorPickerWidget,
	Icon,
	InputLabel as Label,
	Radio,
} from "components";
import { colorThemes } from "constants/colorThemes";
import { useEffect, useState } from "react";
import { generateShades } from "utils";

const bgTransition = "background 0.5s ease-in";

/**
 * Component to configure the theme colors of the app.
 * Users can select a predefined color theme or set their own primary and accent colors.
 */
const ThemeConfig = () => {
	const [selectedTheme, setSelectedTheme] = useState(null);
	const [selectedThemeIdx, setSelectedThemeIdx] = useState(-2);
	const [navStyle, setNavStyle] = useState("");
	const [landingPageStyle, setLandingPageStyle] = useState("");

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

	return (
		<Flex direction="column" gap={{ base: 4, md: 8 }}>
			<Section title="Colors">
				<AppPreview
					primary={selectedTheme?.primary || primary}
					primaryDark={selectedTheme?.primary_dark || primary_dark}
					accent={selectedTheme?.accent || accent}
					navStyle={navStyle}
				/>

				<Flex direction="column" gap={6}>
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
							<ColorSelector
								theme={
									customThemeSet && selectedThemeIdx === -1
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
						</Flex>

						{/* Custom Theme Editor Section */}
						{selectedThemeIdx === -1 ? (
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
		</Flex>
	);
};

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

/**
 * Component to show a 270px x 180px preview of the website using the theme colors. Show the primary and accent colors. Show the white top-bar, the primary left menu with a few dummy menu items
 * @param {object} props
 * @param {string} props.primary - Primary color
 * @param {string} props.primaryDark - Primary Dark color
 * @param {string} props.accent - Accent color
 * @param {string} props.navStyle - Navigation style (light/dark)
 */
const AppPreview = ({ primary, primaryDark, accent, navStyle }) => {
	const w = "300px",
		h = "200px";

	// if (!primary || !accent) return <Box w={w} h={h} />;

	return (
		<Flex
			direction="column"
			w={w}
			h={h}
			border="1px solid #999"
			borderRadius={6}
			overflow="hidden"
			fontSize="5px"
			shadow="base"
			pointerEvents="none"
			userSelect="none"
		>
			{primary && accent ? (
				<>
					<Flex
						bg={navStyle === "light" ? primary : "white"}
						h="8%"
						minH="8%"
						w="100%"
						align="center"
						px="1em"
						fontSize="6px"
						fontWeight="700"
						color={navStyle === "light" ? "#FFFFFF90" : "#666"}
						transition={bgTransition}
					>
						Logo
					</Flex>

					<Flex direction="row" w="100%" h="100%" flex="1">
						{/* Left Menu */}
						<Flex
							bg={navStyle === "light" ? "white" : primary}
							w="25%"
							h="100%"
							direction="column"
							color={navStyle === "light" ? "#222" : "white"}
							transition={bgTransition}
						>
							{/* Left Menu Items */}
							<MenuItem
								item="₹10,000"
								primaryDark={primaryDark}
							/>
							{["Home", "Transaction", "Others"].map(
								(item, i) => (
									<MenuItem
										key={i}
										item={item}
										primaryDark={primaryDark}
										accent={accent}
										selected={i === 1}
									/>
								)
							)}
						</Flex>

						{/* Right Pane */}
						<Flex
							direction="column"
							flex="1"
							align="center"
							bg="bg"
							w="30px"
							h="100%"
							p="3%"
						>
							{/* Show a white transaction card with a button (rounded box) at the bottom in accent color */}
							<Flex
								bg="white"
								w="100%"
								h="80%"
								direction="column"
								borderRadius={3}
								p="3%"
								shadow="base"
							>
								<Text size="1.2em" fontWeight="500">
									Transaction
								</Text>
								<Box flex="1"></Box>
								{/* Button */}
								<Flex
									bg={accent}
									w="20%"
									h="10%"
									align="center"
									justify="center"
									borderRadius={2}
									px="4px"
									color="white"
									fontSize="0.9em"
									transition={bgTransition}
								>
									Proceed
								</Flex>
							</Flex>
						</Flex>
					</Flex>
				</>
			) : (
				<Box w={w} h={h} />
			)}
		</Flex>
	);
};

/**
 * Menu Item component for preview
 * @param root0
 * @param root0.item
 * @param root0.primaryDark
 * @param root0.accent
 * @param root0.selected
 */
const MenuItem = ({ item, primaryDark, accent, selected = false }) => {
	return (
		<Flex
			direction="row"
			bg={selected ? primaryDark : ""}
			color={selected ? "white" : ""}
			borderBottom="1px solid #999"
			h="15px"
			w="100%"
			align="center"
			transition={bgTransition}
		>
			<Box h="100%" w="3px" mr="3px" bg={selected ? accent : ""}></Box>
			{item}
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

export default ThemeConfig;
