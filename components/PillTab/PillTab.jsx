import { Flex } from "@chakra-ui/react";
/**
 * Function to add id to each object of the list
 * @param {Array} list
 * @returns {Array}
 */
const getProcessedList = (list) => {
	return list.map((item, index) => {
		return {
			...item,
			_id: index,
		};
	});
};

/**
 * A PillTab component,
 * @param 	{Array}	list    List of object containing label & component.
 * @param 	{Number}	currTab Index of current tab.
 * @param 	{Function}	onClick	Click event when clicked on particular pillTab.
 * @param	{...*}	rest	Rest of the props passed to this component.
 * @example	`<PillTab></PillTab>` TODO: Fix example
 */
const PillTab = ({ list, currTab, onClick, ...rest }) => {
	const tabList = getProcessedList(list);
	return (
		<Flex
			p="0.5"
			gap="4"
			w="100%"
			h={{ base: "36px", md: "40px" }}
			bg={{ base: "divider", md: "inherit" }}
			borderRadius={{ base: "80px", md: "0px" }}
			justify={{ base: "space-between", md: "flex-start" }}
			{...rest}
		>
			{tabList?.map(({ label }, index) => {
				const isActive = index === currTab;
				return (
					<Flex
						key={label}
						justify="center"
						align="center"
						w={{ base: "50%", md: "120px" }}
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
						borderRadius={{ base: "80px" }}
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
