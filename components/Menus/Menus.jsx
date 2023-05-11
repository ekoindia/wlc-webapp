import {
	Box,
	Menu,
	MenuButton,
	MenuDivider,
	MenuItem,
	MenuList,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { Icon } from "..";

const Menus = (props) => {
	const router = useRouter();
	const {
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
		onClick,
		menulist,
	} = props;

	const pseudoStyles = {
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
								minW={minW}
								minH={minH}
								width={width}
								height={height}
								{...iconWPos}
								{...buttonStyle}
								{...pseudoStyles}
								{...props}
							>
								{title}
							</MenuButton>
							<MenuList py="0px" minW="120px" {...listStyles}>
								{menulist
									? menulist.map((item, index) => {
											return (
												<>
													<MenuItem
														color="dark"
														key={index}
														onClick={() => {
															if (
																item.handleClick
															) {
																item.handleClick();
															} else {
																router.push(
																	item.path
																);
															}
														}}
														p="8px 10px"
														fontSize={{
															base: "10px",
															sm: "xs",
														}}
														fontWeight="medium"
														_hover={{
															bg: "white",
														}}
														{...itemStyles}
													>
														{item.item}
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
