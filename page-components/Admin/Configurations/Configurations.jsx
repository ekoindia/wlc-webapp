import { Flex, Text } from "@chakra-ui/react";
import { PillTab } from "components";
import { useFeatureFlag } from "hooks";
import { useEffect, useState } from "react";
import { GeneralConfig, LandingPageConfig, ThemeConfig } from ".";

/**
 * A Configurations page-component
 */
const Configurations = () => {
	const [currTab, setCurrTab] = useState(null);

	const [isThemePickerEnabled] = useFeatureFlag("THEME_PICKER");
	const [isCmsLandingPageEnabled] = useFeatureFlag("CMS_LANDING_PAGE");

	const list = [
		{
			label: "Theme",
			component: <ThemeConfig />,
			visible: isThemePickerEnabled,
		},
		{
			label: "Landing Page",
			component: <LandingPageConfig />,
			visible: isCmsLandingPageEnabled,
		},
		{ label: "General", component: <GeneralConfig />, visible: false },
	];

	useEffect(() => {
		// TODO: remove this effect after theme picker UAT testing.
		if (isThemePickerEnabled) setCurrTab(0);
	}, [isThemePickerEnabled]);

	const onClick = (idx) => setCurrTab(idx);

	const getComp = (idx) => list[idx]?.component;

	return (
		<div>
			<Flex
				bg={{ base: "white", md: "none" }}
				borderRadius="0px 0px 20px 20px"
				py={{
					base: 0,
					md: 5,
				}}
				mb={{
					base: 5,
					md: 0,
				}}
			>
				<Flex
					direction={{ base: "column", md: "row" }}
					align={{ base: "flex-start", md: "center" }}
					gap={{ base: "2", md: "8" }}
					w="100%"
					m={{ base: "20px", md: "0" }}
					fontSize="sm"
					justify="space-between"
				>
					<Text fontWeight="semibold" fontSize="2xl">
						Configurations
					</Text>
					<PillTab {...{ list, currTab, onClick }} />
				</Flex>
			</Flex>
			{getComp(currTab)}
		</div>
	);
};

export default Configurations;
