import { Box, Flex, Button, Text } from "@chakra-ui/react";
import { Endpoints } from "constants/EndPoints";
import { ParamType } from "constants/trxnFramework";
import { TransactionIds } from "constants/EpsTransactions";
import { useSession } from "contexts";
import { fetcher } from "helpers";
import { useEffect, useState } from "react";
import { useForm, useWatch, FieldValues } from "react-hook-form";
import { Form } from "tf-components";

interface AddressProps {
	onSubmit: (_data: Record<string, any>) => void;
	onCancel: () => void;
	defaultAddress: Record<string, any>;
	desc?: string;
}

interface State {
	value: string;
	label: string;
}

interface ValueObject {
	value: string;
	[key: string]: any;
}

const findObjectByValue = (
	arr: ValueObject[],
	value: string
): ValueObject | undefined => {
	return arr.find((obj) => obj.value === value);
};

/**
 * A <Address> component
 * TODO: Write more description here
 * @component
 * @param {object} prop - Properties passed to the component
 * @param {string} prop.prop1 - TODO: Property description. A normal property.
 * @param {number} [prop.optionalProp2] - TODO: Property description. An optional property with default value.
 * @param prop.onSubmit
 * @param prop.onCancel
 * @param {...*} rest - Rest of the props
 * @example <Address></Address> TODO: Fix example
 */

const Address: React.FC<AddressProps> = ({
	onSubmit,
	onCancel,
	defaultAddress,
	desc,
}) => {
	const [statesList, setStatesList] = useState<State[]>([]);
	const { accessToken } = useSession();

	const current_address_parameter_list = [
		{
			name: "address_line1",
			label: "Address Line 1",
		},
		{
			name: "address_line2",
			label: "Address Line 2",
			required: false,
		},
		{
			name: "pincode",
			label: "Postal Code",
			parameter_type_id: ParamType.NUMERIC,
			step: "1",
			maxLength: 6,
		},
		{
			name: "city",
			label: "City",
		},
		{
			name: "country_state",
			label: "State",
			parameter_type_id: ParamType.LIST,
			list_elements: statesList,
		},
		{
			name: "country",
			label: "Country",
			disabled: true,
		},
	];

	const {
		handleSubmit,
		register,
		formState: { errors },
		control,
		reset,
		setValue,
	} = useForm<FieldValues>();

	const watcher = useWatch({ control });

	const fetchStatesList = () => {
		fetcher(process.env.NEXT_PUBLIC_API_BASE_URL + Endpoints.TRANSACTION, {
			body: {
				interaction_type_id: TransactionIds.STATE_TYPE,
			},
			token: accessToken,
			controller: undefined,
		})
			.then((res: any) => {
				if (res.status === 0) {
					setStatesList(res?.param_attributes.list_elements);
				}
			})
			.catch((err: any) => {
				console.error("err", err);
			});
	};

	useEffect(() => {
		fetchStatesList();
	}, []);

	useEffect(() => {
		if (defaultAddress) {
			Object.keys(defaultAddress).forEach((key) => {
				setValue(key, defaultAddress[key]);
			});
		}
	}, [defaultAddress, setValue]);

	useEffect(() => {
		let defaultValues: Record<string, any> = {
			country: "India",
			address_line1: defaultAddress?.shop_address,
		};

		reset({ ...defaultValues, ...defaultAddress });
	}, [statesList, reset, defaultAddress]);

	const fetchCityViaPincode = (pincode: string) => {
		fetcher(process.env.NEXT_PUBLIC_API_BASE_URL + Endpoints.TRANSACTION, {
			token: accessToken,
			body: {
				pincode: pincode,
				interaction_type_id: 353,
			},
			controller: undefined,
		})
			.then((res: any) => {
				if (res.status === 0) {
					const dependentParams = res.dependent_params;

					const cityParam = dependentParams.find(
						(param: { name: string }) =>
							param.name === "sender_city"
					);
					const stateParam = dependentParams.find(
						(param: { name: string }) =>
							param.name === "sender_state"
					);

					if (cityParam && stateParam) {
						const city = cityParam.value;
						const state = stateParam.value;

						const stateObject = findObjectByValue(
							statesList,
							state
						);
						setValue("city", city, { shouldValidate: false });
						setValue("country_state", stateObject, {
							shouldValidate: false,
						});
					}
				}
			})
			.catch((error: any) => {
				console.error(
					"[ProfilePanel] Get City and State Error:",
					error
				);
			});
	};

	const pincode = useWatch({
		control,
		name: "pincode",
	});

	useEffect(() => {
		if (pincode && pincode.length === 6) {
			fetchCityViaPincode(pincode);
		}
	}, [pincode]);

	const handleFormSubmit = (submittedData: Record<string, any>) => {
		const keysToFlatten = ["country_state"];

		const finalData = Object.entries(submittedData).reduce(
			(acc: Record<string, any>, [key, value]) => {
				if (keysToFlatten.includes(key)) {
					if (value?.value !== undefined && value?.value !== "") {
						acc[key] = value.value;
					}
				} else {
					if (value !== undefined && value !== "") {
						acc[key] = value;
					}
				}
				return acc;
			},
			{}
		);
		onSubmit(finalData);
	};

	return (
		<Box px={{ base: "20px", md: "0" }}>
			<Flex
				direction="column"
				w="100%"
				bg="white"
				borderRadius="10px"
				mt="20px"
				gap="4"
			>
				<form onSubmit={handleSubmit(handleFormSubmit)}>
					<Flex direction="column" gap="6">
						<Form
							prop1={""}
							{...{
								register,
								control,
								formValues: watcher,
								parameter_list: current_address_parameter_list,
								errors,
								templateColumns: {
									base: "1fr",
									lg: "repeat(auto-fit, minmax(300px, 1fr))",
								},
								columnGap: 4,
								width: "100%",
							}}
						/>
					</Flex>

					{desc && (
						<Text mt={4} color="red">
							<Text as="span" color="black" fontWeight="bold">
								Note:{" "}
							</Text>
							{desc.replace(/^Note:\s*/, "")}
						</Text>
					)}
					<Flex gap="4" mt={6} mb={2}>
						<Button
							type="submit"
							w="100%"
							size="lg"
							fontWeight="bold"
							textColor="white"
							variant="accent"
							_hover={{ backgroundColor: "accent.dark" }}
						>
							Save
						</Button>
						<Button
							w="100%"
							size="lg"
							variant="link"
							color="primary.DEFAULT"
							display="flex"
							justifyContent="center"
							onClick={onCancel}
						>
							Cancel
						</Button>
					</Flex>
				</form>
			</Flex>
		</Box>
	);
};

export default Address;
