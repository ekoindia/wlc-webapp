import { Box, Button, IconButton, Text } from "@chakra-ui/react";
import { Icon } from "..";

const IconButtons = (props) => {
	const {
		title,
		iconName,
		iconPos = "right",
		variant = "primary",
		isRound = true,
		hasBG = true,
		iconStyle,
		children,
		onClick,
		...rest
	} = props;

	/* icon color */
	const color = variant == "primary" ? "primary.DEFAULT" : "accent.DEFAULT";
	/* text color on hover */
	const hoverColor = variant == "primary" ? "primary.dark" : "accent.dark";
	/* icon order */
	const iconOrder = iconPos === "left" ? 1 : 2;
	const textOrder = iconOrder === 1 ? 2 : 1;

	return (
		<Button display="flex" alignItems="center" gap={2} variant="link">
			{hasBG ? (
				<Box order={iconOrder}>
					<IconButton
						size="sm"
						isRound={isRound}
						variant={variant}
						icon={<Icon name={iconName} {...iconStyle} />}
					/>
				</Box>
			) : (
				<Box order={iconOrder} color={color}>
					<Icon name={iconName} {...iconStyle} />
				</Box>
			)}

			<Box order={textOrder}>
				<Text
					color={color}
					_hover={{ fontcolor: { hoverColor } }} //TODO fix hover on text
					_active={{ color: { hoverColor } }}
				>
					{title}
				</Text>
			</Box>
		</Button>
	);
};

export default IconButtons;
