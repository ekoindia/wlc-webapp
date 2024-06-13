import { Box, Flex, Text, useToken } from "@chakra-ui/react";
import { ColorPair, Icon, InputLabel as Label, Radio } from "components";
import { colorThemes } from "constants/colorThemes";
import { useEffect, useState } from "react";

const ThemeConfig = () => {
	const [selectedTheme, setSelectedTheme] = useState(null);
	const [selectedThemeIdx, setSelectedThemeIdx] = useState(-1);
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
		console.log("Finding theme: ", colorThemes, { primary, accent });
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

	return (
		<Flex direction="column" gap={{ base: 4, md: 8 }}>
			<Section title="Colors">
				<AppPreview
					primary={selectedTheme?.primary}
					primaryDark={selectedTheme?.primary_dark}
					accent={selectedTheme?.accent}
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
								<Flex
									key={i + theme.name}
									direction="column"
									align="center"
									gap={1}
								>
									<Flex
										direction="column"
										align="center"
										justify="center"
										position="relative"
										w="62px"
										h="62px"
										border={
											selectedThemeIdx === i
												? "3px solid #666"
												: ""
										}
										borderRadius="full"
									>
										<ColorPair
											primary={theme.primary}
											accent={theme.accent}
											size="52px"
											cursor="pointer"
											onClick={() => {
												setSelectedTheme(theme);
												setSelectedThemeIdx(i);
											}}
										/>
										{selectedThemeIdx === i ? (
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
										color={theme.primary_dark}
									>
										{theme.name}
									</Text>
								</Flex>
							))}
						</Flex>
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
				gap={{ base: 4, md: 8 }}
			>
				{children}
			</Flex>
		</Flex>
	);
};

/**
 * Component to show a 270px x 180px preview of the website using the theme colors. Show the primary and accent colors. Show the white top-bar, the primary left menu with a few dummy menu items
 * @param {Object} props
 * @param {string} props.primary - Primary color
 * @param {string} props.primaryDark - Primary Dark color
 * @param {string} props.accent - Accent color
 * @param {string} props.navStyle - Navigation style (light/dark)
 */
const AppPreview = ({ primary, primaryDark, accent, navStyle }) => {
	const w = "300px",
		h = "200px";

	if (!primary || !accent) return <Box w={w} h={h} />;

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
		>
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
				>
					{/* Left Menu Items */}
					<MenuItem item="₹10,000" primaryDark={primaryDark} />
					{["Home", "Start Here", "Others"].map((item, i) => (
						<MenuItem
							key={i}
							item={item}
							primaryDark={primaryDark}
							accent={accent}
							selected={i === 1}
						/>
					))}
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
							Transaction Card
						</Text>
						<Box flex="1"></Box>
						<Flex
							bg={accent}
							w="20%"
							h="10%"
							align="center"
							justify="center"
							borderRadius={2}
							px="4px"
							color="white"
							fontSize="0.8em"
						>
							Proceed
						</Flex>
					</Flex>
				</Flex>
			</Flex>
		</Flex>
	);
};

/**
 * Menu Item component for preview
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
		>
			<Box h="100%" w="3px" mr="3px" bg={selected ? accent : ""}></Box>
			{item}
		</Flex>
	);
};

export default ThemeConfig;
