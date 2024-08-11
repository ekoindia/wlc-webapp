import { Flex, Text, useDisclosure } from "@chakra-ui/react";
import { useNavigationLists } from "hooks";
import { useRef } from "react";
import { useAccordionMenuConverter } from ".";
import { AccordionMenu, Drawer, Icon } from "..";

/**
 * The Transactions component renders a button that opens a drawer containing transactions.
 */
const Transactions = () => {
	const btnRef = useRef<HTMLButtonElement>(null);
	const { isOpen, onOpen, onClose } = useDisclosure();
	const { trxnList } = useNavigationLists();

	const list = useAccordionMenuConverter(trxnList);

	const onMenuItemClick = () => onClose();

	return (
		<>
			<Flex
				direction="column"
				gap="1"
				w="100%"
				h="100%"
				align="center"
				justify="center"
				onClick={onOpen}
			>
				<Icon ref={btnRef} name="transaction" size="sm" color="light" />
				<Text fontSize="10px" fontWeight="medium" noOfLines={2}>
					Transactions
				</Text>
			</Flex>
			<Drawer
				id="transaction-drawer"
				title="Transactions"
				isOpen={isOpen}
				onOpen={onOpen}
				onClose={onClose}
				isFullHeight={false}
				finalFocusRef={btnRef}
			>
				<AccordionMenu {...{ list, onMenuItemClick }} />
			</Drawer>
		</>
	);
};

export default Transactions;
