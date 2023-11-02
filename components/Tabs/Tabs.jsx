import {
	Flex,
	Tab,
	TabList,
	TabPanel,
	TabPanels,
	Tabs as ChakraTabs,
} from "@chakra-ui/react";
import { fadeIn } from "libs/chakraKeyframes";
import { Children, useEffect, useRef, useState } from "react";
import { IcoButton } from "..";

/**
 * A Tabs component
 * @param 	{object}	prop	Properties passed to the component
 * @param	{string}	prop.prop1	TODO: Property description.
 * @param	{...*}	rest	Rest of the props passed to this component.
 * @example	`<Tabs></Tabs>` TODO: Fix example
 */
const Tabs = ({ children, defaultIndex = 0, ...rest }) => {
	const tabListRef = useRef(null);

	const arrayChildren = Children.toArray(children);

	const [scrollButtonVisibility, setScrollButtonVisibility] = useState({
		showLeftButton: false,
		showRightButton: false,
	});

	const [_defaultIndex, setDefaultIndex] = useState(defaultIndex);

	const handleScroll = () => {
		const _tabList = tabListRef.current;
		if (_tabList) {
			const showLeftButton = _tabList.scrollLeft > 10;
			const showRightButton =
				_tabList.clientWidth + _tabList.scrollLeft <
				_tabList.scrollWidth - 10;
			setScrollButtonVisibility({ showLeftButton, showRightButton });
		}
	};

	useEffect(() => {
		handleScroll();
	}, []);

	return (
		<ChakraTabs
			isLazy
			position="relative"
			defaultIndex={+_defaultIndex}
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
						size="sm"
						mx="2"
						animation={`${fadeIn} 0.1s ease-out`}
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
					{Children.map(arrayChildren, (child, index) => {
						if (child.props.disabled && _defaultIndex === index) {
							setDefaultIndex((prev) => prev + 1);
						}
						return (
							<>
								{child.props.label && (
									<Tab
										fontSize="sm"
										variant="selectNone"
										isDisabled={child.props.disabled}
									>
										{child.props.label}
									</Tab>
								)}
							</>
						);
					})}
				</TabList>
				{scrollButtonVisibility.showRightButton && (
					<IcoButton
						aria-label="Scroll right"
						iconName="chevron-right"
						size="sm"
						mx="2"
						animation={`${fadeIn} 0.1s ease-out`}
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

			<TabPanels>
				{Children.map(arrayChildren, (child) => {
					return (
						<>
							{child.props.label && (
								<TabPanel>{child.props.children}</TabPanel>
							)}
						</>
					);
				})}
			</TabPanels>
		</ChakraTabs>
	);
};

export default Tabs;
