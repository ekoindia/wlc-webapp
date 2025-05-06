import { Box, Flex, Text } from "@chakra-ui/react";
import { IcoButton, Icon } from "components";

/**
 * A base card for all Home widgets
 * TODO: Write more description here
 * @param 	{string}	title	Widget title
 * @param 	{ReactElement}	titleIcon	Icon Component to show in the header
 * @param 	{string}	titleIconName	Name of the icon to show in the header (alternative to titleIcon)
 * @param 	{object}	titleIconStyle	Icon style for the header
 * @param 	{string}	linkLabel	Link label to be shown in the header (eg: "Show All")
 * @param 	{Function}	linkOnClick	Link onClick handler
 * @param 	{object}	linkProps	Props for the link
 * @param 	{object}	iconName	Icon name for IcoButton
 * @param 	{object}	iconStyle	Icon style for IcoButton
 * @param 	{object}	icoBtnProps	Props for IcoButton
 * @param 	{boolean}	noPadding	Whether to remove padding from the widget body
 * @param 	{boolean}	autoHeight	Whether to make the widget full height
 * @param 	{object}	titleProps	Props for the title
 * @param 	{object}	headerProps	Props for the header
 * @param 	{object}	children	Child elements for the widget body
 * @param	{...*}	rest	Rest of the props passed to this component
 * @example	`<WidgetBase></WidgetBase>` TODO: Fix example
 */
const WidgetBase = ({
	title,
	titleIcon, // Icon Component
	titleIconName,
	titleIconStyle,
	linkLabel,
	linkOnClick,
	linkProps,
	iconName,
	iconStyle,
	icoBtnProps,
	noPadding = false,
	autoHeight = false,
	titleProps,
	headerProps,
	children,
	...rest
}) => {
	return (
		<Flex
			h={
				autoHeight
					? "auto"
					: {
							base: "auto",
							md: "320px",
							"2xl": "360px",
						}
			}
			direction="column"
			bg="white"
			p={!noPadding && "5"}
			pb={noPadding && "2"}
			borderRadius="10px"
			mx={{ base: 3, md: "0" }}
			{...rest}
		>
			{title || linkLabel || titleIcon || titleIconName ? (
				<Flex
					direction="row"
					// justifyContent="space-between"
					alignItems="center"
					mb={!noPadding && "5"}
					p={noPadding && "5"}
					borderRadius="10px 10px 0 0"
					{...headerProps}
				>
					{titleIcon ? (
						<Box mr="2" {...titleIconStyle}>
							{titleIcon}
						</Box>
					) : titleIconName ? (
						<Box mr="2" {...titleIconStyle}>
							<Icon icon={titleIconName} size="sm" />
						</Box>
					) : null}
					<Text
						as="b"
						textTransform="capitalize"
						flex="1"
						{...titleProps}
					>
						{title}
					</Text>
					{linkOnClick ? (
						<Flex align="center">
							{iconName && (
								<IcoButton
									iconName={iconName}
									onClick={linkOnClick}
									iconStyle={{
										...iconStyle,
									}}
									size="sm"
									theme="accent"
									_hover={{ bg: "accent.dark" }}
									{...icoBtnProps}
								/>
							)}
							{linkLabel && (
								<Text
									as="b"
									color="accent.DEFAULT"
									onClick={() => linkOnClick()}
									cursor="pointer"
									{...linkProps}
								>
									{linkLabel}
								</Text>
							)}
						</Flex>
					) : null}
				</Flex>
			) : null}
			{children}
		</Flex>
	);
};

export default WidgetBase;
