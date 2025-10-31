import { Flex } from "@chakra-ui/react";
/**
 * Function to add id to each object of the list & filter out objects which are not visible
 * @param {Array} list
 * @returns {Array}
 */
const getProcessedList = (list) => {
	return list
		?.map((item, index) => {
			return {
				...item,
				_id: index,
			};
		})
		.filter((item) => item.visible !== false);
};

/**
 * A PillTab component,
 * @param {object} prop - Properties passed to the component
 * @param {Array} prop.list - List of object containing label & component.
 * @param {number} prop.currTab - Index of current tab.
 * @param {Function} prop.onClick - Click event when clicked on particular pillTab.
 * @param {...*} rest - Rest of the props passed to this component.
 * @example	`<PillTab list={[]} currTab={0} onClick={() => {}} />`
 */
const PillTab = ({ list, currTab, onClick, ...rest }) => {
	const tabList = getProcessedList(list);

	if (!tabList?.length) return null;

	return (
		<Flex
			p="0.5"
			gap={{ base: tabList?.length > 2 ? "2" : "0", md: "4" }}
			// w={tabList?.length > 2 ? "auto" : "100%"}
			minW="100%"
			h={{ base: "36px", md: "40px" }}
			bg={{ base: "divider", md: "inherit" }}
			borderRadius={{ base: "full", md: "0px" }}
			justify={{ base: "space-between", md: "flex-start" }}
			{...rest}
		>
			{tabList?.map(({ label, visible = true }, index) => {
				if (!visible) return;
				const isActive = index === currTab;
				return (
					<Flex
						key={label}
						justify="center"
						align="center"
						minW={{
							base: tabList?.length > 2 ? "100px" : "50%",
							md: "120px",
						}}
						p="0 1em"
						fontSize={{ base: "xs", md: "sm" }}
						bg={{
							base: isActive ? "primary.DEFAULT" : "inherit",
							md: isActive ? "primary.DEFAULT" : "white",
						}}
						boxShadow={isActive ? "sh-otpfocus" : null}
						border={{
							base: "none",
							md: !isActive ? "card" : null,
						}}
						color={isActive ? "white" : "dark"}
						borderRadius="full"
						onClick={() => onClick(index)}
						cursor="pointer"
						transition="background 0.2s ease-in"
						userSelect="none"
					>
						{label}
					</Flex>
				);
			})}
		</Flex>
	);
};

export default PillTab;
