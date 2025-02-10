import { Flex, FormControl, Text } from "@chakra-ui/react";
import { ActionButtonGroup, Input } from "components";
import { Endpoints } from "constants";
import { useSession } from "contexts";
import { fetcher } from "helpers";
import { useRouter } from "next/router";
import { useFieldArray, useForm } from "react-hook-form";
import { getFormErrorMessage } from "utils";

const MOBILE_NUMBER_REGEX = /^[6-9]{1}[0-9]{9}$/;
const NAME_REGEX = /^[A-Za-z\s]+$/;

/**
 * OnboardDistributor page-component
 * @param root0
 * @param root0.applicantType
 * @param root0.setResponse
 */
const OnboardDistributor = ({ applicantType, setResponse }) => {
	const {
		handleSubmit,
		register,
		control,
		// trigger,
		formState: { errors, isSubmitting, isDirty, isValid },
	} = useForm({
		defaultValues: {
			agents: [{ agent_name: "", agent_mobile: "" }],
		},
	});

	const { fields /* append  remove */ } = useFieldArray({
		control,
		name: "agents",
	});

	const { accessToken } = useSession();
	const router = useRouter();

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

	const buttonConfigList = [
		{
			type: "submit",
			size: "lg",
			label: "Save",
			loading: isSubmitting,
			disabled: !isValid || !isDirty,
			styles: { h: "64px", w: { base: "100%", md: "200px" } },
		},
		{
			variant: "link",
			label: "Cancel",
			onClick: () => router.back(),
			styles: {
				color: "primary.DEFAULT",
				bg: { base: "white", md: "none" },
				h: { base: "64px", md: "64px" },
				w: { base: "100%", md: "auto" },
				_hover: { textDecoration: "none" },
			},
		},
	];

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
						</Flex>
					);
				})}

				<ActionButtonGroup {...{ buttonConfigList }} />
			</Flex>
		</form>
	);
};

export default OnboardDistributor;

/* 
    <Button
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
                });
            }
        }}
    >
        + Add New
    </Button> 
*/
