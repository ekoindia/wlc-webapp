import {
	Box,
	Menu,
	MenuButton,
	MenuDivider,
	MenuItem,
	MenuList,
	Text,
} from "@chakra-ui/react";
import { Icon } from "..";

const Menus = ({
	minH,
	minW,
	width,
	height,
	type = "inverted",
	as = "IconButton",
	iconPos,
	title,
	iconName,
	buttonStyle,
	iconStyles,
	itemStyles,
	listStyles,
	rounded = "4px",
	onClick,
	menulist,
	...rest
}) => {
	const pseudoStyles = {
		color: type === "inverted" ? "accent.DEFAULT" : "white",
		bg: type === "inverted" ? "white" : "accent.DEFAULT",
		_hover: {
			color: type === "inverted" ? "accent.dark" : "white",
			bg: type === "inverted" ? "white" : "accent.dark",
		},
		_active: {
			color: type === "inverted" ? "accent.dark" : "white",
			bg: type === "inverted" ? "white" : "accent.dark",
		},
	};
	const iconWPos =
		iconPos === "right"
			? { rightIcon: <Icon name={iconName} {...iconStyles} /> }
			: iconPos === "left"
			? { leftIcon: <Icon name={iconName} {...iconStyles} /> }
			: { icon: <Icon name={iconName} {...iconStyles} /> };

	return (
		<Box
			color={type === "inverted" ? "accent.DEFAULT" : "white"}
			onClick={onClick}
		>
			<Menu autoSelect={false}>
				{
					(/* { isOpen } */) => (
						<>
							<MenuButton
								cursor="pointer"
								as={as}
								rounded={rounded}
								minW={minW}
								minH={minH}
								width={width}
								height={height}
								{...iconWPos}
								{...buttonStyle}
								{...pseudoStyles}
								{...rest}
							>
								<Text display={{ base: "none", md: "flex" }}>
									{title}
								</Text>
							</MenuButton>
							<MenuList
								py="0px"
								minW="fit-content"
								{...listStyles}
							>
								{menulist
									? menulist.map((item, index) => {
											return (
												<>
													<MenuItem
														key={
															item.id ??
															`${index}-${item.label}`
														}
														value={item.value}
														color="dark"
														onClick={() =>
															item.onClick(
																item.value
															)
														}
														minHeight="48px"
														fontSize="sm"
														_hover={{
															bg: "divider",
														}}
														{...itemStyles}
													>
														{item.label}
													</MenuItem>
													{index !==
														menulist.length - 1 && (
														<MenuDivider
															margin="auto"
															w="90%"
														/>
													)}
												</>
											);
									  })
									: null}
							</MenuList>
						</>
					)
				}
			</Menu>
		</Box>
	);
};

export default Menus;
