import {
	Box,
	Menu,
	MenuButton,
	MenuDivider,
	MenuItem,
	MenuList,
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
		color: type === "inverted" ? "primary.DEFAULT" : "white",
		bg: type === "inverted" ? "white" : "primary.DEFAULT",
		_hover: {
			color: type === "inverted" ? "primary.dark" : "white",
			bg: type === "inverted" ? "white" : "primary.dark",
		},
		_active: {
			color: type === "inverted" ? "primary.dark" : "white",
			bg: type === "inverted" ? "white" : "primary.dark",
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
			color={type === "inverted" ? "primary.DEFAULT" : "white"}
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
								{title}
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
															item.id ||
															`${index}-${item.label}`
														}
														value={item.value}
														color="dark"
														onClick={() =>
															item.onClick(
																item.value
															)
														}
														fontSize="xs"
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
