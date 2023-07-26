import { Box, Flex, Text } from "@chakra-ui/react";
import { IcoButton } from "components";

/**
 * A base card for all Home widgets
 * TODO: Write more description here
 * @param 	{string}	title	Widget title
 * @param 	{object}	titleProps	Props for the title
 * @param 	{string}	linkLabel	Link label to be shown in the header (eg: "Show All")
 * @param 	{function}	linkOnClick	Link onClick handler
 * @param 	{object}	linkProps	Props for the link
 * @param 	{object}	headerProps	Props for the header
 * @param 	{object}	iconName	Icon name for IcoButton
 * @param 	{object}	iconStyle	Icon style for IcoButton
 * @param 	{object}	icoBtnProps	Props for IcoButton
 * @param 	{boolean}	noPadding	Whether to remove padding from the widget body
 * @param 	{object}	children	Child elements for the widget body
 * @param	{...*}	rest	Rest of the props passed to this component
 * @example	`<WidgetBase></WidgetBase>` TODO: Fix example
 */
const WidgetBase = ({
	title,
	titleProps,
	linkLabel,
	linkOnClick,
	linkProps,
	headerProps,
	iconName,
	iconStyle,
	icoBtnProps,
	noPadding = false,
	children,
	...rest
}) => {
	return (
		<Flex
			h={{
				base: "auto",
				md: "320px",
				"2xl": "360px",
			}}
			direction="column"
			bg="white"
			p={!noPadding && "5"}
			pb={noPadding && "2"}
			borderRadius="10px"
			mx={{ base: 3, md: "0" }}
			{...rest}
		>
			{title || linkLabel ? (
				<Box
					mb={!noPadding && "5"}
					p={noPadding && "5"}
					pb={noPadding && "3"}
				>
					<Flex justifyContent="space-between" {...headerProps}>
						<Text as="b" textTransform="capitalize" {...titleProps}>
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
				</Box>
			) : null}
			{children}
		</Flex>
	);
};

export default WidgetBase;
