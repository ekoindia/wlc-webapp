import { Box } from "@chakra-ui/react";
import { Headings, Tabs } from "components";
import { OnboardViaFile, OnboardViaForm } from ".";

/**
 * A OnboardAgents page-component
 * @example	`<OnboardAgents></OnboardAgents>` TODO: Fix example
 */
const OnboardAgents = () => {
	const tabList = [
		{ label: "Onboard Agents", comp: <OnboardViaForm /> }, // form based onboarding
		{ label: "Bulk Onboarding (Using File)", comp: <OnboardViaFile /> }, // file based onboarding
	];
	return (
		<>
			<Headings title="Onboard Agents" hasIcon={false} />
			<Box
				bg="white"
				borderRadius="10px"
				border="card"
				boxShadow="basic"
				mx={{ base: "4", md: "0" }}
				mb={{ base: "16", md: "0" }}
			>
				<Tabs>
					{tabList.map(({ label, comp }, index) => (
						<div key={`${index}-${label}`} label={label}>
							{comp}
						</div>
					))}
				</Tabs>
			</Box>
		</>
	);
};

export default OnboardAgents;
