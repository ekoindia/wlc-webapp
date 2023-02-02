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
		hasIcon = true,
		iconStyle,
		textStyle,
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
		<Button
			display="flex"
			alignItems="center"
			gap={2}
			variant="link"
			onClick={onClick}
			color={color}
			_hover={{ color: hoverColor }}
			_active={{ color: hoverColor }}
		>
			{hasIcon ? (
				<Box order={iconOrder}>
					{hasBG ? (
						<Box>
							<IconButton
								size="sm"
								isRound={isRound}
								variant={variant}
								icon={<Icon name={iconName} {...iconStyle} />}
							/>
						</Box>
					) : (
						<Box color="inherit">
							<Icon name={iconName} {...iconStyle} />
						</Box>
					)}
				</Box>
			) : (
				""
			)}

			<Box order={textOrder}>
				<Text color="inherit" {...textStyle}>
					{title}
				</Text>
			</Box>
		</Button>
	);
};

export default IconButtons;
