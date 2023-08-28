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
import { SingleOnboardingSuccess } from ".";

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
	console.log("submittedVal", submittedVal);

	const [ready, setReady] = useState(false);
	console.log("ready", ready);
	const [isOpen, setIsOpen] = useState(null);

	const onSubmit = (submittedData) => {
		let submitted = submittedData;
		submitted["applicantType"] = applicantType;
		setSubmittedVal(submitted);

		setReady(true);
		//setIsOpen(true);

		handleClose();

		// Create Request Body
		// API Call
		// Send Response to next screen( Success/Failure )

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

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
		reset,
	} = useForm();

	const emptyValue = {
		mobileNumber: "",
		distributorMobileNum: "",
		name: "",
	};

	const handleClose = () => {
		setIsOpen(true);
	};

	const resetForm = () => {
		setReady(null);
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
			{isOpen && <SingleOnboardingSuccess setIsOpen={setIsOpen} />}
			{!isOpen && (
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
								({
									id,
									label,
									//required,
									parameter_type_id,
								}) => {
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
																required
																leftAddon="+91"
																type="numeric"
																fontSize="md"
																invalid={
																	errors.id
																		? true
																		: false
																}
																errorMsg={
																	errors?.id
																		?.message
																}
																maxLength={10}
																{...register(
																	id,
																	{
																		required: true,
																	}
																)}
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
															required
															invalid={
																errors.id
																	? true
																	: false
															}
															errorMsg={
																errors?.id
																	?.message
															}
															type="text"
															fontSize="md"
															{...register(id, {
																required: true,
															})}
														/>
													</FormControl>
												</Flex>
											);
									}
								}
							)}

							<Button
								loading={isSubmitting}
								mt={8}
								type="submit"
								size="lg"
							>
								Submit
							</Button>

							{/* {submittedVal && (
								<div>
									Submitted Data:
									<br />
									{JSON.stringify(submittedVal)}
								</div>
							)} */}
						</form>
					</Flex>
				</Flex>
			)}
		</>
	);
};

export default SingleOnboarding;
