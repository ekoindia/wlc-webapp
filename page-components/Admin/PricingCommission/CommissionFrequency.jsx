import { Flex, useToast } from "@chakra-ui/react";
import { Button } from "components";
import { Endpoints, ParamType, TransactionIds } from "constants";
import { useSession } from "contexts/UserContext";
import { fetcher } from "helpers/apiHelper";
import useRefreshToken from "hooks/useRefreshToken";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { Form } from "tf-components/Form";

const getStatus = (status) => {
	switch (status) {
		case 0:
			return "success";
		default:
			return "error";
	}
};

const _multiselectRenderer = {
	value: "user_code",
	label: "name",
};

const operation_type_list = [
	{ value: "1", label: "Self" },
	{ value: "2", label: "Distributor" },
];

const commission_type_list = [
	{ value: "2", label: "Daily" },
	{ value: "1", label: "Monthly" },
];

/**
 * Commission Frequency tab
 */
const CommissionFrequency = () => {
	const [multiSelectOptions, setMultiSelectOptions] = useState([]);
	// const [multiSelectLabel, setMultiSelectLabel] = useState();
	const toast = useToast();
	const router = useRouter();
	const { accessToken } = useSession();
	const { generateNewToken } = useRefreshToken();

	const {
		handleSubmit,
		register,
		control,
		formState: { errors, isSubmitting },
	} = useForm();

	const watcher = useWatch({ control });

	useEffect(() => {
		if (watcher.operation_type == 2) {
			fetcher(
				process.env.NEXT_PUBLIC_API_BASE_URL + Endpoints.TRANSACTION,
				{
					headers: {
						"tf-req-uri-root-path": "/ekoicici/v1",
						"tf-req-uri": "/network/agent-list?usertype=1",
						"tf-req-method": "GET",
					},
					token: accessToken,
					generateNewToken,
				}
			)
				.then((res) => {
					const _agents = res?.data?.csp_list ?? [];
					setMultiSelectOptions(_agents);
				})
				.catch((error) => {
					console.error("📡Error:", error);
				});

			// let _operationTypeList = operation_type_list.filter(
			// 	(item) => item.value == watcher.operation_type
			// );

			// let _label =
			// 	_operationTypeList.length > 0 && _operationTypeList[0].label;

			// setMultiSelectLabel(_label);
		}
	}, [watcher.operation_type]);

	const handleFormSubmit = (data) => {
		const _finalData = { ...data };

		const _CspList = data?.CspList?.map(
			(item) => item[_multiselectRenderer.value]
		);

		if (watcher.operation_type == 2) {
			_finalData.CspList = `${_CspList}`;
			_finalData.communication = 2;
		}

		delete _finalData.operation_type;

		fetcher(process.env.NEXT_PUBLIC_API_BASE_URL + Endpoints.TRANSACTION, {
			body: {
				interaction_type_id: TransactionIds.COMMISSION_TYPE,
				..._finalData,
			},
			token: accessToken,
		})
			.then((response) => {
				toast({
					title: response.message,
					status: getStatus(response.status),
					duration: 6000,
					isClosable: true,
				});
			})
			.catch((error) => {
				console.log(error);
			});
	};

	const commission_frequency_parameter_list = [
		{
			name: "operation_type",
			label: `Set Commission For`,
			parameter_type_id: ParamType.LIST,
			list_elements: operation_type_list,
			// defaultValue: DEFAULT.operation_type,
		},
		{
			name: "CspList",
			label: `Select Distributor`,
			parameter_type_id: ParamType.LIST,
			is_multi: true,
			list_elements: multiSelectOptions,
			visible_on_param_name: "operation_type",
			visible_on_param_value: /2/,
			multiSelectRenderer: _multiselectRenderer,
		},
		{
			name: "source_flag",
			label: `Select Commission Frequency`,
			parameter_type_id: ParamType.LIST,
			list_elements: commission_type_list,
		},
	];

	return (
		<form onSubmit={handleSubmit(handleFormSubmit)}>
			<Flex direction="column" gap="8">
				<Form
					parameter_list={commission_frequency_parameter_list}
					register={register}
					control={control}
					formValues={watcher}
					errors={errors}
				/>

				{/* Submit Button and Cancel Button */}
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

					<Button
						h={{ base: "64px", md: "auto" }}
						w={{ base: "100%", md: "initial" }}
						bg={{ base: "white", md: "none" }}
						variant="link"
						fontWeight="bold"
						color="primary.DEFAULT"
						_hover={{ textDecoration: "none" }}
						borderRadius={{ base: "none", md: "10" }}
						onClick={() => router.back()}
					>
						Cancel
					</Button>
				</Flex>
			</Flex>
		</form>
	);
};

export default CommissionFrequency;
