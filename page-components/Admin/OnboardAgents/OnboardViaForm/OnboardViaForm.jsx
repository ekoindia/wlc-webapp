import { Box, Flex } from "@chakra-ui/react";
import { Radio } from "components";
import { useState } from "react";
import { OnboardDistributor, OnboardRetailer } from ".";
import { OnboardAgentResponse } from "..";

const AGENT_TYPE = {
	RETAILERS: "0",
	DISTRIBUTOR: "2",
};

const agent_type_list = [
	{ value: AGENT_TYPE.RETAILERS, label: "Retailers" },
	{ value: AGENT_TYPE.DISTRIBUTOR, label: "Distributors" },
];

/**
 * A OnboardViaForm page-component
 * @example	`<OnboardViaForm></OnboardViaForm>` TODO: Fix example
 */
const OnboardViaForm = () => {
	const [applicantType, setApplicantType] = useState(AGENT_TYPE.RETAILERS);
	const [response, setResponse] = useState(null);

	return (
		<div>
			{response === null ? (
				<Flex direction="column" gap="8">
					<Radio
						id="applicant_type"
						label="Select Agent Type"
						value={applicantType}
						onChange={(value) => setApplicantType(value)}
						options={agent_type_list}
					/>

					{applicantType === AGENT_TYPE.RETAILERS ? (
						<OnboardRetailer {...{ applicantType, setResponse }} />
					) : (
						<OnboardDistributor
							{...{ applicantType, setResponse }}
						/>
					)}
				</Flex>
			) : (
				<Flex direction="column" gap="2">
					<Flex fontSize="sm" direction="column" gap="1">
						<span>
							{response?.message || "Something went wrong"}!!
						</span>
						{response?.data?.processed_records > 0 && (
							<Flex gap="1">
								<Box as="span" fontWeight="semibold">
									Accepted:
								</Box>
								<span>{response?.data?.processed_records}</span>
								<span>
									{response?.data?.processed_records === 1
										? "record"
										: "records"}
								</span>
							</Flex>
						)}
						{response?.data?.failed_count > 0 && (
							<Flex gap="1">
								<Box as="span" fontWeight="semibold">
									Rejected:
								</Box>
								<span>{response?.data?.failed_count}</span>
								<span>
									{response?.data?.failed_count === 1
										? "record"
										: "records"}
								</span>
							</Flex>
						)}
					</Flex>

					{response?.data?.csp_list?.length > 0 && (
						<OnboardAgentResponse
							responseList={response?.data?.csp_list}
							applicantType={applicantType}
						/>
					)}
				</Flex>
			)}
		</div>
	);
};

export default OnboardViaForm;
