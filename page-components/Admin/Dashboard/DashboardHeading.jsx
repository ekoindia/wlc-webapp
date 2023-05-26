import {
	Flex,
	Menu,
	MenuButton,
	MenuItem,
	MenuList,
	Text,
} from "@chakra-ui/react";
import { Icon } from "components";

/**
 * A DashboardHeading
 * TODO: Write more description here
 * @arg 	{Object}	prop	Properties passed to the component
 * @param	{string}	[prop.className]	Optional classes to pass to this component.
 * @example	`<DashboardHeading></DashboardHeading>`
 */
const DashboardHeading = ({ heading, headingList, handleHeadingClick }) => {
	return (
		<Flex justify="space-between" fontSize="sm" m="20px">
			<Flex direction="column">
				<Menu isLazy>
					<MenuButton>
						<Flex gap="4" align="center">
							<Text fontWeight="semibold" fontSize="xl">
								{headingList[heading]}
							</Text>
							<Icon name="caret-down" size="16px" />
						</Flex>
					</MenuButton>
					<MenuList>
						{headingList?.map((item, index) => (
							<MenuItem
								minH="48px"
								key={item}
								onClick={() => handleHeadingClick(index)}
							>
								<span>{item}</span>
							</MenuItem>
						))}
					</MenuList>
				</Menu>
				{/* <Flex>
					<DateView
						date="2017-01-13T16:14:24+05:30"
						format="dd-MM-yyyy"
					/>
					<span>&nbsp;-&nbsp;</span>
					<DateView
						date="2017-07-13T16:14:24+05:30"
						format="dd-MM-yyyy"
					/>
				</Flex> */}
			</Flex>
			{/* <Flex
				align="center"
				justify="space-between"
				w={{ base: "40%", xl: "25%" }}
			>
				<Flex>Last 7 Days</Flex>
				<Flex>Last 30 Days</Flex>
				<IcoButton
					iconName="calender"
					size="md"
					rounded="full"
					bg="primary.DEFAULT"
					color="white"
				/>
			</Flex> */}
		</Flex>
	);
};

export default DashboardHeading;
