import { Box, Flex, Text } from "@chakra-ui/react";
import { usePlatform } from "hooks";
import { forwardRef, Fragment } from "react";
import { Icon, Kbd } from "..";

/**
 * Component to render a single KBar result item
 * @param {object} props
 * @param {object} props.item - The KBar Action item to render
 * @param {boolean} props.active - Whether the item is active or not
 * @param {string} props.className - The className to apply to the item
 */
const ResultItem = forwardRef(({ className, item, active }, ref) => {
	const { isMac } = usePlatform();

	return (
		<Flex
			ref={ref}
			key={"itm" + item.id}
			className={className}
			alignItems="center"
			cursor="pointer"
			gap="3px"
			// mx="4px"
			p="8px 15px"
			minH="62px"
			// borderRadius="md"
			borderLeft="4px solid"
			borderLeftColor={active ? "accent.dark" : "transparent"}
			bg={active ? "divider" : null}
		>
			{item.icon && (
				<Box
					fontSize="lg"
					// color={active ? "#0f172a" : "#334155"}
					mr="15px"
				>
					{item.icon}
				</Box>
			)}
			<Box overflow="hidden" flexGrow={1}>
				<Text
					noOfLines={2}
					color={active ? "#0f172a" : "#334155"}
					fontWeight="450"
				>
					{item.name}
				</Text>
				{item.subtitle && (
					<Text
						fontSize="xs"
						isTruncated={true}
						color={active ? "#475569" : "#64748b"}
					>
						{item.subtitle}
					</Text>
				)}
			</Box>
			{item?.shortcut?.map((shortcut, index) => {
				const keys = shortcut.split("+");
				return (
					<Fragment key={"sk" + shortcut + index}>
						{index > 0 ? (
							<Text fontFamily="mono" color="gray.500" mx={1}>
								→
							</Text>
						) : null}
						{keys.map((key, i2) => (
							<Kbd
								key={key + index + i2}
								minH="24px"
								minW="24px"
								variant="dark"
								// fontFamily={key === "$mod" ? "sans" : null}
								fontFamily="inherit"
								textTransform={
									key?.length === 1 ? "uppercase" : undefined
								}
								display={{
									base: "none",
									md: "inline-flex",
								}}
							>
								{
									key
										.replace(/\$mod/, isMac ? "⌘" : "Ctrl")
										.replace(/Alt/, isMac ? "⌥" : "Alt")
										.replace(/Shift/, "⇧")
										.replace(/Enter/, "⏎")
									// .replace(/\+/g, " + ")
								}
							</Kbd>
						))}
					</Fragment>
				);
			})}
			{item.children?.length > 0 && (
				<Icon
					name="chevron-right"
					size="sm"
					color="#64748b"
					ml={{ base: 0, md: 2 }}
				/>
			)}
		</Flex>
	);
});

ResultItem.displayName = "ResultItem";

export default ResultItem;
