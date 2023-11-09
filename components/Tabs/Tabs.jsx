import {
	Tab,
	TabList,
	TabPanel,
	TabPanels,
	Tabs as ChakraTabs,
} from "@chakra-ui/react";
import { slideInLeft, slideInRight } from "libs/chakraKeyframes";
import { Children, useEffect, useRef, useState } from "react";
import { IcoButton } from "..";

/**
 * A Tabs component
 * @param 	{object}	prop	Properties passed to the component
 * @param	{string}	prop.prop1	TODO: Property description.
 * @param	{...*}	rest	Rest of the props passed to this component.
 * @example	`<Tabs></Tabs>` TODO: Fix example
 */
const Tabs = ({ children, variant = "default", defaultIndex = 0, ...rest }) => {
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
			const showLeftButton = _tabList.scrollLeft > 30;
			const showRightButton =
				_tabList.clientWidth + _tabList.scrollLeft <
				_tabList.scrollWidth - 30;
			setScrollButtonVisibility({ showLeftButton, showRightButton });
		}
	};

	useEffect(() => {
		handleScroll();
	}, []);

	return (
		<ChakraTabs
			isLazy
			pos="relative"
			defaultIndex={+_defaultIndex}
			py="3"
			maxW="100%"
			overflow="hidden"
			variant={variant}
			onScroll={handleScroll}
			{...rest}
		>
			{scrollButtonVisibility.showLeftButton && (
				<IcoButton
					aria-label="Scroll left"
					iconName="chevron-left"
					pos="absolute"
					bg="white"
					color="primary.DEFAULT"
					size="sm"
					top="8px"
					zIndex="1"
					rounded="0"
					h="40px"
					w="40px"
					borderRadius="0px 20px 20px 0px"
					boxShadow="0px 5px 10px 0px #00000033"
					animation={`${slideInLeft} 0.2s ease-out`}
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
					right="0"
					bg="white"
					color="primary.DEFAULT"
					top="8px"
					zIndex="1"
					pos="absolute"
					rounded="0"
					borderRadius="20px 0px 0px 20px"
					boxShadow="0px 5px 10px 0px #00000033"
					h="40px"
					w="40px"
					animation={`${slideInRight} 0.4s ease-in`}
					onClick={() => {
						const _tabList = tabListRef.current;
						if (_tabList) {
							_tabList.scrollLeft += window.innerWidth * 0.6;
						}
						handleScroll();
					}}
				/>
			)}
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
