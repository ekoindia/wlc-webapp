import {
	Tab,
	TabList,
	TabPanel,
	TabPanels,
	Tabs as ChakraTabs,
} from "@chakra-ui/react";
import { Children, ReactNode, useState } from "react";
import { XScrollArrow } from "..";

type TabProps = {
	children: ReactNode;
	variant?:
		| "line"
		| "enclosed"
		| "enclosed-colored"
		| "soft-rounded"
		| "solid-rounded"
		| "unstyled"
		| "default";
	defaultIndex?: number;
	[propName: string]: any;
};

/**
 * A Tabs component built with Chakra UI.
 * @param {ReactNode} children - The child components to be rendered within the tabs.
 * @param {string} [variant] - The variant of the tabs. Can be one of "line", "enclosed", "enclosed-colored", "soft-rounded", "solid-rounded", "unstyled", or "default".
 * @param {number} [defaultIndex] - The index of the tab to be selected by default.
 * @param {...any} rest - Any other props to be passed to the ChakraTabs component.
 * @example
 * <Tabs variant="enclosed" defaultIndex={1}>
 *   <Tab label="Tab 1">Content for Tab 1</Tab>
 *   <Tab label="Tab 2">Content for Tab 2</Tab>
 * </Tabs>
 */
const Tabs = ({
	children,
	variant = "default",
	defaultIndex = 0,
	...rest
}: TabProps): JSX.Element => {
	const arrayChildren = Children.toArray(children);

	const [_defaultIndex, setDefaultIndex] = useState(defaultIndex);

	return (
		<ChakraTabs
			isLazy
			defaultIndex={+_defaultIndex}
			maxW="100%"
			pb="3"
			variant={variant}
			{...rest}
		>
			<XScrollArrow pos="bottom">
				<TabList color="light" w="100%" pt="3">
					{Children.map(arrayChildren, (child: any, index) => {
						if (child.props.disabled && _defaultIndex === index) {
							setDefaultIndex((prev) => prev + 1);
						}
						return (
							<>
								{child.props.label && (
									<Tab
										fontSize="sm"
										isDisabled={child.props.disabled}
										style={{ userSelect: "none" }}
									>
										{child.props.label}
									</Tab>
								)}
							</>
						);
					})}
				</TabList>
			</XScrollArrow>
			<TabPanels>
				{Children.map(arrayChildren, (child: any) => {
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
