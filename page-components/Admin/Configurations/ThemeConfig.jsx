import { Box, Flex, Text } from "@chakra-ui/react";
import { ColorPair, InputLabel as Label, Radio } from "components";
import { colorThemes } from "constants/colorThemes";
import { useState } from "react";

const ThemeConfig = () => {
	const [selectedTheme, setSelectedTheme] = useState(colorThemes[0]);
	const [selectedThemeIdx, setSelectedThemeIdx] = useState(0);
	const [navStyle, setNavStyle] = useState("");

	return (
		<Flex
			direction={{ base: "column", md: "row" }}
			gap={{ base: 4, md: 8 }}
			bg="white"
			borderRadius={6}
			p={{ base: 4, md: 8 }}
		>
			<AppPreview
				primary={selectedTheme.primary}
				primaryDark={selectedTheme.primary_dark}
				accent={selectedTheme.accent}
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
						selectedIdx={0}
						required
						onChange={(e) => setNavStyle(e)}
					/>
				</Box>

				<Box>
					<Label required>Select Theme Colors</Label>
					<Flex direction="row" gap={4} wrap="wrap">
						{colorThemes.map((theme, i) => (
							<Flex
								key={i + theme.name}
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
							</Flex>
						))}
					</Flex>
				</Box>
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
	return (
		<Flex
			direction="column"
			w="300px"
			h="200px"
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
		>
			<Box h="100%" w="3px" mr="3px" bg={selected ? accent : ""}></Box>
			{item}
		</Flex>
	);
};

export default ThemeConfig;
