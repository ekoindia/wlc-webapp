import { Flex } from "@chakra-ui/react";
import { useState } from "react";
import { BusinessDashboard, DashboardHeading, OnboardingDashboard } from ".";

/* pageId list for DashboardHeading component */
const headingList = ["Business", "Onboarding"];

/**
 * A Dashboard page component
 * TODO: Write more description here
 * @arg 	{Object}	prop	Properties passed to the component
 * @param	{string}	[prop.className]	Optional classes to pass to this component.
 * @example	`<Dashboard></Dashboard>`
 */
const Dashboard = () => {
	const [pageId, setPageId] = useState(0); //to find whether user is on business or onboarding dashboard

	const handleHeadingClick = (item) => setPageId(item);

	return (
		<div>
			<Flex
				bg={{ base: "white", md: "none" }}
				pb={{ base: pageId === 0 ? "0px" : "10px", md: "0px" }}
				borderRadius={pageId === 0 ? "0px" : "0px 0px 20px 20px"}
			>
				<DashboardHeading
					{...{ headingList, pageId, handleHeadingClick }}
				/>
			</Flex>
			{pageId === 0 ? (
				<BusinessDashboard />
			) : pageId === 1 ? (
				<OnboardingDashboard />
			) : null}
		</div>
	);
};

export default Dashboard;
