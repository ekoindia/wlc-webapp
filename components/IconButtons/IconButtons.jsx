import { Box, Button, Circle, Image } from "@chakra-ui/react";
import { useState } from "react";

/**
 * A <IconButtons> component
 * TODO: Write more description here
 * @arg 	{Object}	prop	Properties passed to the component
 * @param	{string}	[prop.className]	Optional classes to pass to this component.
 * @example	`<IconButtons></IconButtons>`
 */
const IconButtons = (props) => {
	const [count, setCount] = useState(0); // TODO: Edit state as required
	const {
		title,
		children,
		onClick,
		colorType = 1,
		iconPos = "right",
		iconFill = 1,
		iconPath,
		iconStyle,
		circleStyle,
		...rest
	} = props;

	const fill = colorType === 1 ? "primary.DEFAULT" : "accent.DEFAULT";
	const hoverFill = colorType === 1 ? "primary.dark" : "accent.dark";
	//const shadow = colorType === 1 ? "shadow.primary" : "shadow.accent";
	const styledIcon =
		iconFill === 1 ? (
			<Circle
				bg={fill}
				color={"white"}
				size={"30px"}
				boxShadow="0px 0px 10px #FE9F008C"
				{...circleStyle}
			>
				<Image src={iconPath} {...iconStyle} />
			</Circle>
		) : (
			<Image src={iconPath} {...iconStyle} />
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
				>
					{title}
				</Box>
				<Box as="span" order={ordr2}>
					{styledIcon}
				</Box>
			</Box>
		</Button>
	);
};

export default IconButtons;
