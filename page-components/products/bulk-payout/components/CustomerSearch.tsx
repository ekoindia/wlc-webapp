import { Flex, Text } from "@chakra-ui/react";
import { ActionButtonGroup } from "components";
import { ParamType } from "constants/trxnFramework";
import { useForm, useWatch } from "react-hook-form";
import { Form } from "tf-components/Form";
import { useBulkPayout } from "../context/BulkPayoutContext";
import { useBulkPayoutApi } from "../hooks/useBulkPayoutApi";

interface CustomerSearchFormData {
	customer_id: string;
}

/**
 * CustomerSearch component for searching and validating customer
 * Step 1 in the Bulk Payout flow
 */
const CustomerSearch = () => {
	const { isLoading, error } = useBulkPayout();
	const { searchCustomer } = useBulkPayoutApi();

	const {
		handleSubmit,
		register,
		control,
		formState: { errors, isValid, isDirty },
	} = useForm<CustomerSearchFormData>({
		mode: "onChange",
	});

	const watcher = useWatch({ control });

	const customerSearchParameterList = [
		{
			name: "customer_id",
			label: "Customer Mobile / ID",
			parameter_type_id: ParamType.TEXT,
			placeholder: "Enter mobile number or customer ID",
			validations: {
				required: "Customer ID is required",
				minLength: {
					value: 5,
					message: "Enter at least 5 characters",
				},
			},
		},
	];

	const handleFormSubmit = async (data: CustomerSearchFormData) => {
		await searchCustomer(data.customer_id.trim());
	};

	const buttonConfigList = [
		{
			type: "submit" as const,
			size: "lg",
			label: "Search Customer",
			loading: isLoading,
			disabled: !isValid || !isDirty || isLoading,
			styles: { h: "64px", w: { base: "100%", md: "200px" } },
		},
	];

	return (
		<Flex
			direction="column"
			bg="white"
			p={{ base: 6, md: 10 }}
			borderRadius="15px"
			boxShadow="0px 5px 20px rgba(0, 0, 0, 0.08)"
			border="1px solid"
			borderColor="divider"
			maxW="600px"
			w="100%"
		>
			<Text
				fontSize={{ base: "xl", md: "2xl" }}
				fontWeight="semibold"
				mb="2"
				color="dark"
			>
				Bulk Payout
			</Text>
			<Text fontSize="sm" color="light" mb="8">
				Search for customer to initiate bulk fund transfer
			</Text>

			<form onSubmit={handleSubmit(handleFormSubmit)}>
				<Flex direction="column" gap="6">
					<Form
						parameter_list={customerSearchParameterList}
						formValues={watcher}
						control={control}
						register={register}
						errors={errors}
					/>

					{error && (
						<Flex
							bg="red.50"
							color="red.600"
							p="3"
							borderRadius="8px"
							fontSize="sm"
						>
							{error}
						</Flex>
					)}

					<ActionButtonGroup buttonConfigList={buttonConfigList} />
				</Flex>
			</form>
		</Flex>
	);
};

export default CustomerSearch;
