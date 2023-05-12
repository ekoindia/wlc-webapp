import { Box, Flex, Text } from "@chakra-ui/react";

/**
 * A base card for all Home widgets
 * TODO: Write more description here
 * @param 	{object}	prop	Properties passed to the component
 * @param	{string}	prop.prop1	TODO: Property description.
 * @param	{...*}	rest	Rest of the props passed to this component.
 * @example	`<WidgetBase></WidgetBase>` TODO: Fix example
 */
const WidgetBase = ({
	title,
	titleProps,
	link,
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
			m={{ base: "16px", md: "auto" }}
			{...rest}
		>
			<Box
				mb={!noPadding && "5"}
				p={noPadding && "5"}
				pb={noPadding && "3"}
			>
				<Flex justifyContent="space-between" {...headerProps}>
					<Text as="b" {...titleProps}>
						{title}
					</Text>
					{link && linkOnClick ? (
						<Text
							as="b"
							color="primary.DEFAULT"
							onClick={() => linkOnClick()}
							cursor="pointer"
							{...linkProps}
						>
							{link}
						</Text>
					) : null}
				</Flex>
			</Box>
			{children}
		</Flex>
	);
};

export default WidgetBase;
