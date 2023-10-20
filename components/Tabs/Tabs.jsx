import {
	Flex,
	Tab,
	TabList,
	TabPanel,
	TabPanels,
	Tabs as ChakraTabs,
} from "@chakra-ui/react";

import { IcoButton } from "..";

import { useEffect, useRef, useState } from "react";

/**
 * A <Tabs> component
 * @param 	{object}	prop	Properties passed to the component
 * @param	{string}	prop.prop1	TODO: Property description.
 * @param	{...*}	rest	Rest of the props passed to this component.
 * @example	`<Tabs></Tabs>` TODO: Fix example
 */
const Tabs = ({ prop1, ...rest }) => {
	const tabListRef = useRef(null);

	const [tabList] = useState(null);

	const handleScroll = () => {
		const _tabList = tabListRef.current;
		if (_tabList) {
			const showLeftButton = _tabList.scrollLeft > 0;
			const showRightButton =
				_tabList.clientWidth + _tabList.scrollLeft <
				_tabList.scrollWidth;
			setScrollButtonVisibility({ showLeftButton, showRightButton });
		}
	};

	const [scrollButtonVisibility, setScrollButtonVisibility] = useState({
		showLeftButton: false,
		showRightButton: false,
	});

	useEffect(() => {
		handleScroll();
	}, []);

	return (
		<ChakraTabs
			isLazy
			position="relative"
			defaultIndex={0}
			py="3"
			maxW="100%"
			onScroll={handleScroll}
			{...rest}
		>
			<Flex alignItems="center" justifyContent="space-between">
				{scrollButtonVisibility.showLeftButton && (
					<IcoButton
						aria-label="Scroll left"
						iconName="chevron-left"
						// variant="ghost"
						size="sm"
						mr="2"
						onClick={() => {
							const tabList = tabListRef.current;
							if (tabList) {
								tabList.scrollLeft -= window.innerWidth * 0.6;
							}
							handleScroll();
						}}
					/>
				)}
				<TabList
					color="light"
					pl={{ base: "10px", md: "20px" }}
					css={{
						"&::-webkit-scrollbar": {
							display: "none",
						},
						"&::-moz-scrollbar": {
							display: "none",
						},
						"&::scrollbar": {
							display: "none",
						},
					}}
					ref={tabListRef}
					maxW="100%"
					overflowX="scroll"
					onScroll={handleScroll}
				>
					<Tab>Tab 1</Tab>
					<Tab>Tab 2</Tab>
					<Tab>Tab 3</Tab>
					<Tab>Tab 4</Tab>
					<Tab>Tab 5</Tab>
					<Tab>Tab 6</Tab>
					<Tab>Tab 7</Tab>
					<Tab>Tab 8</Tab>
					<Tab>Tab 9</Tab>
					<Tab>Tab 10</Tab>
					<Tab>Tab 11</Tab>
					<Tab>Tab 12</Tab>
					<Tab>Tab 13</Tab>
					<Tab>Tab 14</Tab>
					<Tab>Tab 15</Tab>
					<Tab>Tab 16</Tab>
					<Tab>Tab 17</Tab>
					<Tab>Tab 18</Tab>
					<Tab>Tab 19</Tab>
					<Tab>Tab 20</Tab>
				</TabList>
				{scrollButtonVisibility.showRightButton && (
					<IcoButton
						aria-label="Scroll right"
						iconName="chevron-right"
						variant="ghost"
						size="sm"
						ml="2"
						onClick={() => {
							const _tabList = tabListRef.current;
							if (_tabList) {
								_tabList.scrollLeft += window.innerWidth * 0.6;
							}
							handleScroll();
						}}
					/>
				)}
			</Flex>

			<TabPanels p="10px 20px">
				{tabList &&
					tabList.map(({ label, comp }) => (
						<TabPanel key={label}>{comp}</TabPanel>
					))}
			</TabPanels>
		</ChakraTabs>
	);
};

export default Tabs;
