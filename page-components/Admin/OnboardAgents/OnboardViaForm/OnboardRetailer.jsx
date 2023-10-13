import { Flex, FormControl, Text } from "@chakra-ui/react";
import { Button, Input } from "components";
import { Endpoints } from "constants";
import { useSession } from "contexts";
import { fetcher } from "helpers";
import { useFieldArray, useForm } from "react-hook-form";
import { getFormErrorMessage } from "utils";

const MOBILE_NUMBER_REGEX = /^[6-9]{1}[0-9]{9}$/;
const NAME_REGEX = /^[A-Za-z\s]+$/;

/**
 * OnboardRetailer page-component
 */
const OnboardRetailer = ({ applicantType, setResponse }) => {
	const {
		handleSubmit,
		register,
		control,
		// trigger,
		formState: { errors, isSubmitting },
	} = useForm({
		defaultValues: {
			agents: [{ agent_name: "", agent_mobile: "", dist_mobile: "" }],
		},
	});

	const { fields /* append  remove */ } = useFieldArray({
		control,
		name: "agents",
	});

	const { accessToken } = useSession();

	const handleFormSubmit = (data) => {
		fetcher(
			process.env.NEXT_PUBLIC_API_BASE_URL + Endpoints.TRANSACTION_JSON,
			{
				headers: {
					"Content-Type": "application/json",
					"tf-req-uri-root-path": "/ekoicici/v1",
					"tf-req-uri": "/network/agent/multiple_onboarding",
					"tf-req-method": "POST",
				},
				body: {
					applicant_type: applicantType,
					CspList: data.agents,
				},
				token: accessToken,
			}
		)
			.then((res) => {
				if (res.status == 0) {
					setResponse(res);
				}
			})
			.catch((err) => {
				console.error("error", err);
			});
	};

	return (
		<form onSubmit={handleSubmit(handleFormSubmit)}>
			<Flex direction="column" gap="8">
				{fields.map((field, index) => {
					return (
						<Flex
							key={`${field.id}-${index}`}
							direction="column"
							gap="8"
						>
							<FormControl w={{ base: "100%", md: "500px" }}>
								<Input
									id={field.id}
									label="Name"
									required={true}
									{...register(`agents.${index}.agent_name`, {
										required: true,
										pattern: NAME_REGEX,
									})}
								/>
								<Text
									fontSize="xs"
									fontWeight="medium"
									color={
										errors?.agents
											? "error"
											: "primary.dark"
									}
								>
									{errors?.agents?.[index]?.agent_name &&
										`⚠ (${getFormErrorMessage(
											"agent_name",
											errors?.agents?.[index]
										)})`}
								</Text>
							</FormControl>
							<FormControl w={{ base: "100%", md: "500px" }}>
								<Input
									id={field.id}
									label="Mobile Number"
									required={true}
									maxLength="10"
									{...register(
										`agents.${index}.agent_mobile`,
										{
											required: true,
											pattern: MOBILE_NUMBER_REGEX,
											minLength: 10,
											maxLength: 10,
										}
									)}
								/>
								<Text
									fontSize="xs"
									fontWeight="medium"
									color={
										errors?.agents
											? "error"
											: "primary.dark"
									}
								>
									{errors?.agents?.[index]?.agent_mobile &&
										`⚠ (${getFormErrorMessage(
											"agent_mobile",
											errors?.agents?.[index]
										)})`}
								</Text>
							</FormControl>
							<FormControl w={{ base: "100%", md: "500px" }}>
								<Input
									id={field.id}
									label="Distributor's Mobile Number"
									maxLength="10"
									{...register(
										`agents.${index}.dist_mobile`,
										{
											pattern: MOBILE_NUMBER_REGEX,
											minLength: 10,
											maxLength: 10,
										}
									)}
								/>
								<Text
									fontSize="xs"
									fontWeight="medium"
									color={
										errors?.agents
											? "error"
											: "primary.dark"
									}
								>
									{errors?.agents?.[index]?.dist_mobile &&
										`⚠ (${getFormErrorMessage(
											"dist_mobile",
											errors?.agents?.[index]
										)})`}
								</Text>
							</FormControl>
						</Flex>
					);
				})}
				<Flex
					direction={{ base: "row-reverse", md: "row" }}
					w={{ base: "100%", md: "500px" }}
					position={{ base: "fixed", md: "initial" }}
					gap={{ base: "0", md: "16" }}
					align="center"
					bottom="0"
					left="0"
				>
					<Button
						type="submit"
						size="lg"
						h="64px"
						w={{ base: "100%", md: "250px" }}
						fontWeight="bold"
						borderRadius={{ base: "none", md: "10" }}
						loading={isSubmitting}
					>
						Save
					</Button>

					{/* <Button
						h={{ base: "64px", md: "auto" }}
						w={{ base: "100%", md: "initial" }}
						bg={{ base: "white", md: "none" }}
						variant="link"
						fontWeight="bold"
						color="primary.DEFAULT"
						_hover={{ textDecoration: "none" }}
						borderRadius={{ base: "none", md: "10" }}
						onClick={async () => {
							const _noError = await trigger();
							if (_noError) {
								append({
									agent_name: "",
									agent_mobile: "",
									dist_mobile: "",
								});
							}
						}}
					>
						+ Add New
					</Button> */}
				</Flex>
			</Flex>
		</form>
	);
};

export default OnboardRetailer;
