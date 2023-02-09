import {
	Box,
	Button,
	IconButton,
	Menu,
	MenuButton,
	MenuDivider,
	MenuItem,
	MenuList,
} from "@chakra-ui/react";
import { Icon } from "..";

const menulist = [
	{
		item: "Proceed",
		onClick: function () {
			console.log("clicked1");
		},
	},
	{
		item: "Mark Inactive",
		onClick: function () {
			console.log("clicked2");
		},
	},
	{
		item: "Mark Pending",
		onClick: function () {
			console.log("clicked3");
		},
	},
	{
		item: "Change Role",
		onClick: function () {
			console.log("clicked4");
		},
	},
];

const Menus = (props) => {
	const {
		minH = "30px",
		minW = "30px",
		width = "30px",
		height = "30px",
		type = "everted",
		as = "IconButton",
		iconPos,
		title = "Change Role",
		iconName = "more-vert",
		buttonStyle,
		iconStyles = { height: "18px", width: "4px" },
		itemStyles,
		onClick,
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

	const buttonType = as === "IconButton" ? IconButton : Button;

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
				{({ isOpen }) => (
					<>
						<MenuButton
							cursor="pointer"
							as={buttonType}
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
						<MenuList>
							{menulist.map((item, index) => {
								return (
									<>
										<MenuItem
											color="dark"
											key={index}
											onClick={item.onClick}
											{...itemStyles}
										>
											{item.item}
										</MenuItem>
										{index !== menulist.length - 1 && (
											<MenuDivider />
										)}
									</>
								);
							})}
						</MenuList>
					</>
				)}
			</Menu>
		</Box>
	);
};

export default Menus;
