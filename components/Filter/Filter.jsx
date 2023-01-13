import React, { useEffect, useState } from "react";

import {
	Drawer,
	DrawerBody,
	DrawerFooter,
	DrawerHeader,
	DrawerOverlay,
	DrawerContent,
	DrawerCloseButton,
	Button,
	Text,
} from "@chakra-ui/react";
import { useDisclosure } from "@chakra-ui/react";
/**
 * A <Filter> component
 * TODO: Write more description here
 * @arg 	{Object}	prop	Properties passed to the component
 * @param	{string}	[prop.className]	Optional classes to pass to this component.
 * @example	`<Filter></Filter>`
 */

// const [count, setCount] = useState(0);		// TODO: Edit state as required

//  useEffect(() => {
// 	// TODO: Add your useEffect code here and update dependencies as required
//  }, []);

function Filter() {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const btnRef = React.useRef();

	return (
		<>
			<Button
				ref={btnRef}
				onClick={onOpen}
				h={"48px"}
				w={"122px"}
				bg={"#FFFFFF"}
				border="1px solid #11299E"
				boxShadow={"box-shadow: 0px 3px 10px #11299E1A;"}
			>
				<Text color="#11299E">Filter</Text>
			</Button>
			<Drawer
				isOpen={isOpen}
				placement="right"
				onClose={onClose}
				finalFocusRef={btnRef}
			>
				<DrawerOverlay />
				<DrawerContent>
					<DrawerCloseButton />
					<DrawerHeader>Create your account</DrawerHeader>

					<DrawerFooter>
						<Button variant="outline" mr={5} onClick={onClose}>
							Cancel
						</Button>
						<Button colorScheme="blue">Save</Button>
					</DrawerFooter>
				</DrawerContent>
			</Drawer>
		</>
	);
}
export default Filter;
