import { Flex, FormControl, FormLabel, useToast } from "@chakra-ui/react";
import { Button, MultiSelect, Radio } from "components";
import { Endpoints } from "constants";
import { TransactionIds } from "constants/EpsTransactions";
import { useSession } from "contexts/UserContext";
import { fetcher } from "helpers/apiHelper";
import useRefreshToken from "hooks/useRefreshToken";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

const OPERATION = {
	SUBMIT: 1,
	FETCH: 0,
};

const getStatus = (status) => {
	switch (status) {
		case 0:
			return "success";
		default:
			return "error";
	}
};

/**
 * Need to Refactor Below Forms Later
 */

const CommissionFrequency = () => {
	const { accessToken } = useSession();
	const toast = useToast();
	const { generateNewToken } = useRefreshToken();
	const [multiSelectLabel, setMultiSelectLabel] = useState();
	const [data, setData] = useState();
	const router = useRouter();

	const multiSelectRenderer = {
		value: "ekocspid",
		label: "DisplayName",
	};

	const {
		handleSubmit,
		watch,
		control,
		// setValue,
	} = useForm({
		defaultValues: {
			operation_type: "1",
			commission_type: "1",
		},
	});

	const watchOperationType = watch("operation_type");
	const watchCommissionType = watch("commission_type");

	const hitQuery = (operation, callback, finalData = {}) => {
		fetcher(process.env.NEXT_PUBLIC_API_BASE_URL + Endpoints.TRANSACTION, {
			headers: {
				"tf-req-uri-root-path": "/ekoicici/v1",
				"tf-req-uri": `/network/pricing_commissions/`,
				"tf-req-method": "POST",
			},
			body: {
				operation_type: watchOperationType,
				operation: operation,
				...finalData,
			},
			token: accessToken,
			generateNewToken,
		})
			.then((data) => {
				callback(data);
			})
			.catch((error) => {
				console.error("📡 Fetch Error:", error);
			});
	};

	useEffect(() => {
		if (watchOperationType == 2) {
			/* no need of api call when user clicked on product radio option in select_commission_for field as multiselect option is hidden for this */
			hitQuery(OPERATION.FETCH, (_data) => {
				if (_data.status === 0) {
					setData(_data?.data?.allScspList);
				} else {
					toast({
						title: _data.message,
						status: getStatus(_data.status),
						duration: 5000,
						isClosable: true,
					});
				}
			});

			let _operationTypeList = operationTypeList.filter(
				(item) => item.value == watchOperationType
			);

			let _label =
				_operationTypeList.length > 0 && _operationTypeList[0].label;

			setMultiSelectLabel(_label);
		}
	}, [watchOperationType]);

	const handleFormSubmit = (data) => {
		const _finalData = { ...data };

		const cspList = data?.multiselect?.map((num) => +num);
		_finalData.CspList = `${cspList}`;

		delete _finalData.select;
		delete _finalData.multiselect;

		const finalData = {
			source_flag: watchCommissionType,
			interaction_type_id: TransactionIds.COMMISSION_TYPE,
		};

		if (watchOperationType == 2) {
			finalData.communication = 2;
			finalData.CspList = _finalData.CspList;
		}

		fetcher(process.env.NEXT_PUBLIC_API_BASE_URL + Endpoints.TRANSACTION, {
			body: finalData,
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

	const operationTypeList = [
		{ value: "1", label: "Self" },
		{ value: "2", label: "Distributor" },
	];

	const commissionTypeList = [
		{ value: "1", label: "Monthly" },
		{ value: "2", label: "Daily" },
	];

	return (
		<form onSubmit={handleSubmit(handleFormSubmit)}>
			<Flex direction="column" gap="10">
				<RadioInput
					name="operation_type"
					label={`Select Commission For`}
					radioGroupList={operationTypeList}
					control={control}
				/>

				{/* no need of multiselect when user clicked on product radio option in select_commission_for field */}
				{watchOperationType == 2 && (
					<FormControl
						id="multiselect"
						w={{ base: "100%", md: "500px" }}
					>
						<FormLabel>Select {multiSelectLabel}</FormLabel>
						<Controller
							name="multiselect"
							control={control}
							render={({ field: { onChange } }) => (
								<MultiSelect
									required
									options={data}
									renderer={multiSelectRenderer}
									onChange={onChange}
								/>
							)}
						/>
					</FormControl>
				)}

				<RadioInput
					name="commission_type"
					label="Select Commission Type"
					radioGroupList={commissionTypeList}
					control={control}
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
					>
						Set
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

/**
 * Component to show radio button, label
 * @param {*} param0
 * @returns
 */
const RadioInput = ({ name, label, defaultValue, radioGroupList, control }) => {
	return (
		<FormControl id={name}>
			<FormLabel>{label}</FormLabel>
			<Controller
				name={name}
				control={control}
				defaultValue={defaultValue}
				render={({ field: { onChange, value } }) => (
					<Radio
						options={radioGroupList}
						value={value}
						onChange={onChange}
					/>
				)}
			/>
		</FormControl>
	);
};
