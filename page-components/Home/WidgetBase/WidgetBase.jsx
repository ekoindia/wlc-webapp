import { Box, Flex, Text } from "@chakra-ui/react";

/**
 * A base card for all Home widgets
 * TODO: Write more description here
 * @param 	{string}	title	Widget title
 * @param 	{object}	titleProps	Props for the title
 * @param 	{string}	linkLabel	Link label to be shown in the header (eg: "Show All")
 * @param 	{function}	linkOnClick	Link onClick handler
 * @param 	{object}	linkProps	Props for the link
 * @param 	{object}	headerProps	Props for the header
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
	noPadding = false,
	children,
	...rest
}) => {
	return (
		<Flex
			w={{ base: "90%", md: "100%" }}
			h={{
				base: "auto",
				md: "350px",
			}}
			direction="column"
			background="white"
			p={!noPadding && "5"}
			pb={noPadding && "2"}
			borderRadius="10px"
			// m={{ base: "16px", md: "auto" }}
			{...rest}
		>
			{title || linkLabel ? (
				<Box
					mb={!noPadding && "5"}
					p={noPadding && "5"}
					pb={noPadding && "3"}
				>
					<Flex justifyContent="space-between" {...headerProps}>
						<Text as="b" {...titleProps}>
							{title}
						</Text>
						{linkLabel && linkOnClick ? (
							<Text
								as="b"
								color="primary.DEFAULT"
								onClick={() => linkOnClick()}
								cursor="pointer"
								{...linkProps}
							>
								{linkLabel}
							</Text>
						) : null}
					</Flex>
				</Box>
			) : null}
			{children}
		</Flex>
	);
};

export default WidgetBase;
