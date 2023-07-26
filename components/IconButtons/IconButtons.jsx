import { Box, Button, IconButton, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Icon } from "..";

const IconButtons = (props) => {
	const {
		title,
		iconName,
		iconPos = "right",
		variant = "accent",
		isRound = true,
		hasBG = true,
		hasIcon = true,
		iconStyle,
		textStyle,
		children,
		iconSize = "sm",
		onClick,
		...rest
	} = props;

	const [hasMounted, setHasMounted] = useState(false);

	useEffect(() => {
		setHasMounted(true);
	}, []);

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
			{...rest}
		>
			{hasIcon ? (
				<Box order={iconOrder}>
					{hasMounted && (
						<>
							{hasBG ? (
								<>
									<IconButton
										size={iconSize}
										isRound={isRound}
										variant={variant}
										icon={
											<Icon
												name={iconName}
												{...iconStyle}
											/>
										}
									/>
								</>
							) : (
								<Box color="inherit">
									<Icon name={iconName} {...iconStyle} />
								</Box>
							)}
						</>
					)}
				</Box>
			) : (
				""
			)}

			<Box order={textOrder}>
				<Text
					color="inherit"
					fontSize={{ base: "12px", md: "14px" }}
					{...textStyle}
				>
					{title}
				</Text>
			</Box>
		</Button>
	);
};

export default IconButtons;
