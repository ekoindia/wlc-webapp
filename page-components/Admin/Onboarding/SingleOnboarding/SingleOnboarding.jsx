import {
	Flex,
	FormControl,
	Radio,
	RadioGroup,
	Text,
	useToast,
} from "@chakra-ui/react";
import { Button, Input } from "components";
import { ParamType } from "constants";
import { useState } from "react";
import { useForm } from "react-hook-form";

/**
 * A <SingleOnboarding> component
 * TODO: Write more description here
 * @param 	{object}	prop	Properties passed to the component
 * @param	{string}	prop.prop1	TODO: Property description.
 * @param	{...*}	rest	Rest of the props passed to this component.
 * @example	`<SingleOnboarding></SingleOnboarding>` TODO: Fix example
 */

const SingleOnboarding = () => {
	const toast = useToast();
	const [applicantType, setApplicantType] = useState("0");

	const [submittedVal, setSubmittedVal] = useState();

	const onSubmit = (submittedData) => {
		console.log(submittedData);
		let submitted = submittedData;
		submitted["applicantType"] = applicantType;

		setSubmittedVal(submitted);
		toast({
			title: "Onboarded SuccessFully",
			status: "success",
			duration: 6000,
			isClosable: true,
		});
		resetForm();
	};

	const applicantTypeList = [
		{ value: "0", label: "Seller" },
		{ value: "2", label: "Distributor" },
	];

	const { register, handleSubmit, watch, reset } = useForm();

	const watchApplicantType = watch("applicantType");
	console.log(watchApplicantType);

	const emptyValue = {
		mobileNumber: "",
		distributorMobileNum: "",
		name: "",
	};

	const resetForm = () => {
		reset({ ...emptyValue });
	};

	const formListObj = [
		{
			id: "mobileNumber",
			label: "Mobile Number",
			required: true,
			parameter_type_id: ParamType.NUMERIC,
		},
		{
			id: "name",
			label: "Name",
			required: true,
			parameter_type_id: ParamType.TEXT,
		},
		{
			id: "distributorMobileNum",
			label: "Distributor Mobile Number (Optional)",
			required: false,
			parameter_type_id: ParamType.NUMERIC,
		},
	];

	return (
		<>
			<Flex
				direction="column"
				w="100%"
				bg="white"
				borderRadius={8}
				fontSize="md"
			>
				<Flex
					direction="column"
					gap={4}
					w={{ base: "100%", md: "500px" }}
				>
					<Flex direction="column" gap="2">
						<RadioGroup
							defaultValue="0"
							value={applicantType}
							onChange={(value) => {
								setApplicantType(value);
								resetForm();
							}}
						>
							<Flex
								direction={{ base: "column", sm: "row" }}
								gap={{ base: "4", md: "16" }}
							>
								{applicantTypeList.map((item) => (
									<Radio
										size="lg"
										key={item.value}
										value={item.value}
									>
										<Text fontSize="sm">
											{"Onboard "}
											{item.label}
										</Text>
									</Radio>
								))}
							</Flex>
						</RadioGroup>
					</Flex>
					<form onSubmit={handleSubmit(onSubmit)}>
						{formListObj.map(
							({ id, label, required, parameter_type_id }) => {
								switch (parameter_type_id) {
									case ParamType.NUMERIC:
										return (
											<Flex direction="column" mt={4}>
												<FormControl
													key={id}
													w={{
														base: "100%",
														md: "500px",
													}}
												>
													{!(
														id ===
															"distributorMobileNum" &&
														applicantType == 2
													) && (
														<Input
															id={id}
															label={label}
															required={required}
															leftAddon="+91"
															type="numeric"
															fontSize="md"
															maxLength={10}
															{...register(id)}
														/>
													)}
												</FormControl>
											</Flex>
										);
									case ParamType.TEXT:
										return (
											<Flex direction="column" mt={4}>
												<FormControl
													key={id}
													w={{
														base: "100%",
														md: "500px",
													}}
												>
													<Input
														id={id}
														label={label}
														required={required}
														type="text"
														fontSize="md"
														{...register(id)}
													/>
												</FormControl>
											</Flex>
										);
								}
							}
						)}
						<Flex
							direction={{ base: "column", md: "row" }}
							gap={{ base: "4", md: "16" }}
							mt={8}
						>
							<Button
								h="64px"
								fontWeight="bold"
								w={{ base: "100%", md: "140px" }}
								type="submit"
							>
								Submit
							</Button>
						</Flex>
						{submittedVal && (
							<div>
								Submitted Data:
								<br />
								{JSON.stringify(submittedVal)}
							</div>
						)}
					</form>
				</Flex>
			</Flex>
		</>
	);
};

export default SingleOnboarding;
