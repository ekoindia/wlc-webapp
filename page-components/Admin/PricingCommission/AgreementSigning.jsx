import {
	Box,
	Flex,
	Image,
	Text,
	useDisclosure,
	useToast,
} from "@chakra-ui/react";
import {
	Button,
	Dropzone,
	Icon,
	Input,
	InputLabel,
	Modal,
	OtpInput,
} from "components";
import { Address } from "components";
import { Endpoints, TransactionIds } from "constants";
import { useSession, useUser, useOrgDetailContext } from "contexts";
import { fetcher } from "helpers";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useFeatureFlag, useRaiseIssue } from "hooks";

const getStatus = (status) => {
	switch (status) {
		case 0:
			return "success";
		default:
			return "error";
	}
};

const formatAddress = ({
	address_line1 = "",
	address_line2 = "",
	pincode = "",
	city = "",
	country_state = "",
	country = "",
}) => {
	const parts = [
		address_line1,
		address_line2,
		city,
		pincode,
		country_state,
		country,
	].filter((part) => part.trim() !== "");

	return parts.length > 0 ? parts.join(", ") : "";
};

const AgreementSigning = () => {
	const [file, setFile] = useState(null);
	const [imageUrl, setImageUrl] = useState(null);
	const [email, setEmail] = useState("");
	const [address, setAddress] = useState();
	const [isOtpValid, setIsOtpValid] = useState(false);
	const { accessToken } = useSession();

	const { userData, refreshUser } = useUser();

	const modal = useDisclosure();
	const [modalContent, setModalContent] = useState(null);

	const toast = useToast();

	const [otp, setOtp] = useState("");
	const [showOtpSend, setShowOtpSend] = useState(true);
	const [isOtpSent, setIsOtpSent] = useState(false);
	// const [isVerifying, setIsVerifying] = useState(false);
	const [timer, setTimer] = useState(30);
	const [isTimerRunning, setIsTimerRunning] = useState(false);
	const { orgDetail } = useOrgDetailContext();
	const [signerName, setSignerName] = useState("");

	const [isRaiseIssueAllowed] = useFeatureFlag("RAISE_ISSUE");
	const { showRaiseIssueDialog } = useRaiseIssue();

	const {
		handleSubmit,
		register,
		formState: { errors, isSubmitting, isValid },
		reset,
		watch,
	} = useForm();

	const inputEmail = watch("email");
	const inputSignerName = watch("signer");

	useEffect(() => {
		getRecentSignature();
		setEmail(userData.userDetails.business_email);

		const { address_line1, address_line2, pincode, city, state, country } =
			userData?.businessDetails;
		const addressDecorated = formatAddress({
			address_line1: address_line1,
			address_line2: address_line2,
			pincode: pincode,
			city: city,
			country_state: state,
			country: country,
		});
		setAddress(addressDecorated);
	}, []);

	const resetEmailState = () => {
		setOtp("");
		setTimer(30);
		reset({ ...email });
		setIsOtpSent(false);
		setShowOtpSend(true);
	};

	const resetSignatureState = () => {
		setFile(null);
		//reset({...signer });
	};

	const resetAddressState = () => {
		//setAddress(null);
	};

	const getRecentSignature = () => {
		fetcher(process.env.NEXT_PUBLIC_API_BASE_URL + Endpoints.TRANSACTION, {
			headers: {
				"tf-req-uri-root-path": "/ekoicici/v2",
				"tf-req-uri": `/network/agreement/recent-signature`,
				"tf-req-method": "GET",
			},
			token: accessToken,
		})
			.then((res) => {
				const data = res?.data;
				const base64ImageUrl = `data:image/jpeg;base64,${data?.code}`;
				if (data?.code) {
					setImageUrl(base64ImageUrl);
					setSignerName(data?.authorized_signatory_name);
				}
			})
			.catch((err) => {
				console.log("error", err);
			});
	};

	const handleSignatureUpload = () => {
		const formDataObj = {
			client_ref_id: Date.now() + "" + Math.floor(Math.random() * 1000),
			source: "WLC",
			doc_type: "19",
			intent_id: "4",
			authorized_signatory_name: inputSignerName,
		};

		const formData = new FormData();
		formData.append("formdata", new URLSearchParams(formDataObj));
		formData.append("file1", file);

		fetch(
			process.env.NEXT_PUBLIC_API_BASE_URL + Endpoints.UPLOAD_CUSTOM_URL,
			{
				method: "POST",
				headers: {
					Authorization: `Bearer ${accessToken}`,
					"tf-req-uri-root-path": "/ekoicici/v2",
					"tf-req-uri": `/network/agreement/upload-doc-sign-config`,
					"tf-req-method": "POST",
				},
				body: formData,
			}
		)
			.then((res) => res.json())
			.then((res) => {
				toast({
					title: res.message,
					status: getStatus(res.status),
					duration: 6000,
					isClosable: true,
				});
				if (res.status === 0) {
					const url = file ? URL.createObjectURL(file) : "";
					setImageUrl(url);
					setSignerName(inputSignerName);
				}
				handleModalClose();
			})
			.catch((err) => {
				console.error("err", err);
			});
	};

	const handleModalClose = () => {
		if (modalContent === "email") {
			resetEmailState();
		} else if (modalContent === "signature") {
			resetSignatureState();
		} else if (modalContent === "address") {
			resetAddressState();
		}
		modal.onClose();
	};

	useEffect(() => {
		let interval;
		if (isTimerRunning && timer > 0) {
			interval = setInterval(() => {
				setTimer((prevTimer) => prevTimer - 1);
			}, 1000);
		} else if (timer === 0) {
			setIsTimerRunning(false);
		}
		return () => clearInterval(interval);
	}, [isTimerRunning, timer]);

	const timeOutCallback = useCallback(
		() => setTimer((currTimer) => currTimer - 1),
		[]
	);

	useEffect(() => {
		timer > 0 && setTimeout(timeOutCallback, 1000);
	}, [timer, timeOutCallback]);

	useEffect(() => {
		if (timer > 0) {
			const interval = setInterval(
				() => setTimer((prev) => prev - 1),
				1000
			);
			return () => clearInterval(interval);
		}
	}, [timer]);

	const resetTimer = () => {
		if (!timer || timer <= 0) {
			setTimer(30);
		}
	};

	useEffect(() => {
		if (otp.length === 6) {
			setIsOtpValid(true);
		} else {
			setIsOtpValid(false);
		}
	}, [otp]);

	const sendOtpRequest = (type_id) => {
		const postData = {
			email: inputEmail,
			intent_id: 16,
			interaction_type_id: type_id,
		};

		fetcher(process.env.NEXT_PUBLIC_API_BASE_URL + Endpoints.TRANSACTION, {
			body: postData,
			token: accessToken,
		})
			.then((data) => {
				if (data.status == 0) {
					setShowOtpSend(false);
					setIsOtpSent(true);
					setIsTimerRunning(true);
					setTimer(30);
				} else {
					toast({
						title: "Failed to send OTP. Please try again.",
						status: "error",
						duration: 6000,
					});
				}
			})
			.catch((err) => {
				console.log("Error", err);
			});
	};

	const handleVerifyEmail = (data) => {
		const postData = {
			email: data.email,
			intent_id: 16,
			interaction_type_id: 555,
			otp: otp,
		};

		fetcher(process.env.NEXT_PUBLIC_API_BASE_URL + Endpoints.TRANSACTION, {
			body: postData,
			token: accessToken,
		})
			.then((res) => {
				if (res.status == 0) {
					setEmail(data.email);
					refreshUser();
					handleModalClose();
				} else {
					toast({
						title: "Failed to verify your email. Please try again.",
						status: "error",
						duration: 6000,
					});
				}
			})
			.catch((err) => {
				console.log("Error", err);
			});
	};

	const verifyOtpHandler = (_otp) => {
		//console.log("Otp Handler", otp);
		setOtp(_otp);
	};

	const resendOtpHandler = async () => {
		resetTimer();
		setOtp("");
		await sendOtpRequest(TransactionIds.RESEND_OTP);
	};

	const handleAddressSubmit = (data) => {
		console.log("data address", data);
		const address = formatAddress(data);

		const postData = {
			address_type_id: "3",
			merchant_code: userData.userDetails.code,
			contact_person_cell: userData.userDetails.mobile,
			...data,
		};
		console.log("PostData", postData);

		fetcher(
			process.env.NEXT_PUBLIC_API_BASE_URL + Endpoints.TRANSACTION_JSON,
			{
				headers: {
					"tf-req-uri-root-path": "/ekoicici/v1",
					"tf-req-uri": `/network/agents/profile/address/update`,
					"tf-req-method": "POST",
				},
				body: postData,
				token: accessToken,
			}
		)
			.then((res) => {
				// if success - format address - then set in setAddress - Toast - Close
				if (res.status == 0) {
					setAddress(address);
					refreshUser();
					handleModalClose();
					toast({
						title: res.message,
						status: "success",
						duration: 2000,
						isClosable: true,
					});

					// Update Session Storage
					const businessDetails = {
						address_line1: data.address_line1,
						address_line2: data.address_line2,
						pincode: data.pincode,
						city: data.city,
						state: data.state,
						country: data.country,
					};

					sessionStorage.setItem(
						"business_details",
						JSON.stringify(businessDetails)
					);
				}
			})
			.catch((err) => {
				console.log("error", err);
			});
	};

	const renderModalContent = () => {
		switch (modalContent) {
			case "signature":
				return (
					<Flex direction="column" mt={4}>
						<InputLabel required>Upload Signature</InputLabel>
						<Dropzone
							file={file}
							setFile={setFile}
							accept=".jpg,.png,.jpeg"
						/>
						<Input
							required
							mt={2}
							label="Signer Name"
							{...register("signer", {
								required: "Signer Name is required",
								pattern: {
									value: /^[A-Za-z\s]+$/,
									message:
										"Only alphabetic characters are allowed",
								},
							})}
						/>
						{errors.signer && (
							<Text color="red.500">{errors.signer.message}</Text>
						)}

						<Flex gap="4" mt={6} mb={2}>
							<Button
								type="submit"
								w="100%"
								size="lg"
								fontWeight="bold"
								onClick={handleSignatureUpload}
								_hover={{ bg: "accent.dark" }}
								//isDisabled={!isValid}
								//loading={isSubmitting}
							>
								Save
							</Button>
							<Button
								w="100%"
								size="lg"
								variant="link"
								color="primary.DEFAULT"
								align="center"
								onClick={handleModalClose}
							>
								Cancel
							</Button>
						</Flex>
					</Flex>
				);
			case "email":
				return (
					<Flex
						as="form"
						onSubmit={handleSubmit(handleVerifyEmail)}
						direction="column"
						gap={4}
					>
						<InputLabel required={true}>Email</InputLabel>
						<Input
							placeholder="Enter your email"
							{...register("email", {
								required: "Email is required",
								pattern: {
									value: /\S+@\S+\.\S+/,
									message:
										"Entered value does not match email format",
								},
							})}
						/>
						{errors.email && (
							<Text color="red.500">{errors.email.message}</Text>
						)}
						{showOtpSend && (
							<Button
								size="xs"
								width="80px"
								height="20px"
								_hover={{ bg: "primary.dark" }}
								onClick={() =>
									sendOtpRequest(TransactionIds.SEND_OTP)
								}
								isDisabled={!isValid}
								bg="primary.DEFAULT"
							>
								Send OTP
							</Button>
						)}
						{isOtpSent && (
							<Flex direction="column">
								<Flex w="full" align="center" justify="center">
									<OtpInput
										inputStyle={{
											w: { base: 12, sm: 14 },
											h: { base: 12 },
											fontSize: "sm",
										}}
										length={6}
										onChange={setOtp}
										onEnter={verifyOtpHandler}
										onComplete={(otp) => {
											verifyOtpHandler(otp);
										}}
									/>
								</Flex>
								<Flex
									justify="center"
									mt={{ base: 6, "2xl": "2.5rem" }}
									fontSize={{ base: "sm", "2xl": "lg" }}
									gap="0px 10px"
									userSelect="none"
								>
									{timer >= 1 ? (
										<>
											<Text as={"span"}>
												Resend OTP in{" "}
											</Text>
											<Flex
												align="center"
												color="error"
												columnGap="4px"
											>
												<Icon
													name="timer"
													size="18px"
												/>
												00:
												{timer <= 9
													? "0" + timer
													: timer}
											</Flex>
										</>
									) : (
										<>
											<Text as={"span"}>
												Did not receive yet?
											</Text>
											<Text
												cursor="pointer"
												as="span"
												color="primary.DEFAULT"
												onClick={resendOtpHandler}
												fontWeight="medium"
											>
												Resend OTP
											</Text>
										</>
									)}
								</Flex>
							</Flex>
						)}
						<Flex gap="4" mt={6} mb={2}>
							<Button
								type="submit"
								w="100%"
								size="lg"
								fontWeight="bold"
								isDisabled={!isOtpValid}
								_hover={{ bg: "primary.dark" }}
							>
								Save
							</Button>
							<Button
								w="100%"
								size="lg"
								variant="link"
								color="primary.DEFAULT"
								align="center"
								onClick={handleModalClose}
							>
								Cancel
							</Button>
						</Flex>
					</Flex>
				);
			case "address":
				return (
					<Address
						onSubmit={handleAddressSubmit}
						onCancel={handleModalClose}
					></Address>
				);
			default:
				return null;
		}
	};

	return (
		<Flex direction="column" gap="8">
			<Flex direction="column" gap="8" w={{ base: "100%", md: "500px" }}>
				<Flex direction="column">
					<InputLabel required={true}>Email</InputLabel>
					<Flex direction="row" gap={4}>
						{email && <Text>{email}</Text>}

						{/* {!email && ( */}
						<Button
							size="l"
							bg="primary.DEFAULT"
							height="30px"
							width={email ? "60px" : "100px"}
							_hover={{ bg: "primary.dark" }}
							onClick={() => {
								setModalContent("email");
								modal.onOpen();
							}}
						>
							Add
						</Button>
						{/* )} */}
					</Flex>
				</Flex>
				<Flex direction="column">
					<InputLabel required={true}>Business Address</InputLabel>
					<Flex direction="row" gap={4}>
						{address && <Text>{address}</Text>}
						{/* {!address && ( */}
						<Button
							size="l"
							bg="primary.DEFAULT"
							height="30px"
							width={address ? "60px" : "100px"}
							_hover={{ bg: "primary.dark" }}
							onClick={() => {
								setModalContent("address");
								modal.onOpen();
							}}
						>
							{address ? "Edit" : "Add "}
						</Button>
						{/* )}   */}
					</Flex>
				</Flex>

				{email?.length > 0 && address?.length > 0 && (
					<Flex direction="column">
						<InputLabel required>Your Signature</InputLabel>
						<Flex direction="row" align="center" gap={4}>
							{imageUrl && (
								<Box height="auto">
									<Image
										src={imageUrl}
										width="100%"
										height="120px"
										objectFit="contain"
									/>
									{signerName ? (
										<Text>
											<span style={{ fontWeight: "500" }}>
												Signer Name:
											</span>{" "}
											{signerName}{" "}
										</Text>
									) : null}
								</Box>
							)}

							<Button
								size="l"
								bg="primary.DEFAULT"
								height="30px"
								width="60px"
								_hover={{ bg: "primary.dark" }}
								onClick={() => {
									setModalContent("signature");
									modal.onOpen();
								}}
							>
								{imageUrl ? "Edit" : "Add "}
							</Button>
						</Flex>
					</Flex>
				)}

				<Flex direction="column">
					<InputLabel>Update Organisation Name</InputLabel>
					<Flex direction="row" gap={4}>
						<Text>{orgDetail.org_name}</Text>
						{isRaiseIssueAllowed ? (
							<Button
								size="l"
								bg="primary.DEFAULT"
								//icon="feedback"
								_hover={{ bg: "primary.dark" }}
								width={address ? "60px" : "100px"}
								height="30px"
								onClick={() => {
									showRaiseIssueDialog({
										origin: "Agreement Signing",
										customIssueType:
											"Update Organisation Name",
										heading: "Update Organisation Name",
										metadata: {
											//transaction_detail: item,
											// parameters_formatted:
											pre_msg_template:
												"Transaction History Details",
											post_msg_template: "",
										},
									});
								}}
							>
								Edit
							</Button>
						) : null}
					</Flex>
				</Flex>
			</Flex>

			<Modal
				isOpen={modal.isOpen}
				onClose={handleModalClose}
				title={"Add " + modalContent}
				disabled={isSubmitting}
			>
				{renderModalContent()}
			</Modal>
		</Flex>
	);
};

export { AgreementSigning };
