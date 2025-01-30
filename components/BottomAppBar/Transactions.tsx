import { Flex, Text, useDisclosure } from "@chakra-ui/react";
import { AccordionMenu, Icon } from "components";
import { useNavigationLists } from "hooks";
import { useRef } from "react";
import { BottomAppBarDrawer, useAccordionMenuConverter } from ".";

interface ButtonProps {
	isSideBarMode?: boolean;
}

/**
 * The Transactions component renders a button that opens a drawer containing transactions.
 * @param root0
 * @param root0.isSideBarMode
 */
const Transactions = ({ isSideBarMode = false }: ButtonProps) => {
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
				<Icon ref={btnRef} name="transaction" size="sm" />
				<Text
					fontSize="10px"
					fontWeight="medium"
					noOfLines={2}
					userSelect="none"
				>
					Transactions
				</Text>
			</Flex>
			<BottomAppBarDrawer
				id="transaction-drawer"
				title="Transactions"
				isOpen={isOpen}
				onOpen={onOpen}
				onClose={onClose}
				isSideBarMode={isSideBarMode}
				finalFocusRef={btnRef}
			>
				<AccordionMenu {...{ list, onMenuItemClick }} />
			</BottomAppBarDrawer>
		</>
	);
};

export default Transactions;
