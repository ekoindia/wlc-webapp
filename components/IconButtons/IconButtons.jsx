import { Box, Button, Circle } from "@chakra-ui/react";
import { Icon } from "..";

const IconButtons = (props) => {
	const {
		title,
		colorType = 1,
		iconName,
		iconPos = "right",
		iconFill = 1,
		iconStyle,
		circleStyle,
		textStyle,
		children,
		onClick,
		...rest
	} = props;

	const fill = colorType === 1 ? "primary.DEFAULT" : "accent.DEFAULT";
	const hoverFill = colorType === 1 ? "primary.dark" : "accent.dark";
	const shadow =
		colorType === 1 ? "0px 0px 10px #FE9F008C" : "0px 0px 10px #11299e96";

	const styledIcon =
		iconFill === 1 ? (
			<Circle
				bg={fill}
				color={"white"}
				size={"30px"}
				boxShadow={shadow}
				{...circleStyle}
			>
				<Box as="i" {...iconStyle}>
					<Icon name={iconName} />
				</Box>
			</Circle>
		) : (
			<Icon name={iconName} {...iconStyle} />
		);

	const ordr1 = iconPos === "right" ? 1 : 2;
	const ordr2 = ordr1 === 1 ? 2 : 1;

	return (
		<Button
			variant={"link"}
			style={{ textDecoration: "none" }}
			color={fill}
			onClick={onClick}
			_hover={{
				color: hoverFill,
			}}
		>
			<Box display={"flex"} alignItems="center" gap={1.5}>
				<Box
					as="span"
					order={ordr1}
					fontSize={"14px"}
					fontWeight={"semibold"}
					{...textStyle}
				>
					{title}
					{children}
				</Box>
				{iconName ? (
					<Box as="span" order={ordr2}>
						{styledIcon}
					</Box>
				) : (
					""
				)}
			</Box>
		</Button>
	);
};

export default IconButtons;
