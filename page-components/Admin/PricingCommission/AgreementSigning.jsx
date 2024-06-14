// import { Box, Flex, Image, Text, useDisclosure } from "@chakra-ui/react";
// import { Button, Dropzone, Input, InputLabel, Modal } from "components";
// import { Address } from "components/Calenders/Address.jsx";
// import { Endpoints } from "constants";
// import { useSession } from "contexts";
// import { fetcher } from "helpers";
// import { useRouter } from "next/router";
// import { useCallback, useEffect, useState } from "react";
// import { useForm } from "react-hook-form";
// import { saveDataToFile } from "utils";

// const AgreementSigning = () => {
// 	const [file, setFile] = useState(null);
// 	const [email, setEmail] = useState("");
// 	const [address, setAddress] = useState();

// 	const { accessToken } = useSession();

// 	const modal = useDisclosure();
// 	const [modalContent, setModalContent] = useState(null);

// 	const router = useRouter();

// 	const [otp, setOtp] = useState("");
// 	const [showOtpSend, setShowOtpSend] = useState(true);
// 	const [isOtpSent, setIsOtpSent] = useState(false);
// 	const [isVerifying, setIsVerifying] = useState(false);
// 	const [timer, setTimer] = useState(30);
// 	const [isTimerRunning, setIsTimerRunning] = useState(false);

// 	const {
// 		handleSubmit,
// 		register,
// 		formState: { errors, isSubmitting },
// 		control,
// 		reset,
// 	} = useForm();

// 	useEffect(() => {
// 		let interval;
// 		if (isTimerRunning && timer > 0) {
// 			interval = setInterval(() => {
// 				setTimer((prevTimer) => prevTimer - 1);
// 			}, 1000);
// 		} else if (timer === 0) {
// 			setIsTimerRunning(false);
// 		}
// 		return () => clearInterval(interval);
// 	}, [isTimerRunning, timer]);

// 	const timeOutCallback = useCallback(
// 		() => setTimer((currTimer) => currTimer - 1),
// 		[]
// 	);

//     console.log("@@@@@ interval", modalContent );

// 	useEffect(() => {
// 		timer > 0 && setTimeout(timeOutCallback, 1000);
// 	}, [timer, timeOutCallback]);

// 	const resetTimer = () => {
// 		if (!timer || timer <= 0) {
// 			setTimer(30);
// 		}
// 	};

// 	const handleFileDownload = () => {
// 		fetcher(process.env.NEXT_PUBLIC_API_BASE_URL + Endpoints.TRANSACTION, {
// 			headers: {
// 				"tf-is-file-download": "1",
// 			},
// 			body: {
// 				interaction_type_id: 707,
// 				service_code: 57,
// 			},
// 			token: accessToken,
// 		})
// 			.then((data) => {
// 				const _blob = data?.file?.blob;
// 				const _filename = data?.file?.name || "file";
// 				const _type = data?.file["content-type"];
// 				const _b64 = true;
// 				saveDataToFile(_blob, _filename, _type, _b64);
// 			})
// 			.catch((err) => {
// 				console.error("err", err);
// 			});
// 	};

// 	const handleSignatureUpload = () => {
// 		const formDataObj = {
// 			client_ref_id: Date.now() + "" + Math.floor(Math.random() * 1000),
// 			source: "WLC",
// 		};

// 		const formData = new FormData();
// 		formData.append("formdata", new URLSearchParams(formDataObj));
// 		formData.append("file", file);

// 		fetch(
// 			process.env.NEXT_PUBLIC_API_BASE_URL + Endpoints.UPLOAD_CUSTOM_URL,
// 			{
// 				method: "POST",
// 				headers: {
// 					Authorization: `Bearer ${accessToken}`,
// 					"tf-req-uri-root-path": "/ekoicici/v1",
// 					"tf-req-uri": `/network/pricing_commissions/airtel_cms_bulk_update_commercial`,
// 					"tf-req-method": "PUT",
// 				},
// 				body: formData,
// 			}
// 		)
// 			.then((res) => res.json())
// 			.then((data) => {
// 				setData(data);
// 				modal.onClose();
// 				setFile(null);
// 			})
// 			.catch((err) => {
// 				console.error("err", err);
// 			});
// 	};

// 	const sendOtpRequest = async () => {
// 		setShowOtpSend(false);
// 		setIsOtpSent(true);
// 		setIsTimerRunning(true);
// 		setTimer(30);
// 	};

// 	const handleVerifyEmail = async () => {
// 		setIsVerifying(true);
// 		modal.onClose();
// 		setShowOtpSend(true);
// 		setIsOtpSent(false);
// 	};

// 	const verifyOtpHandler = () => {
// 		console.log("Otp Handler", otp);
// 	};

// 	const resendOtpHandler = async () => {
// 		resetTimer();
// 		await sendOtpRequest();
// 	};

// 	const handleAddressSubmit = (data) => {
// 		const address = formatAddress(data);
// 		console.log("@@@@@ address", address);
// 		setAddress(address);
// 	};

// 	const formatAddress = ({
//         address_line1,
//         address_line2,
//         pincode,
//         city,
//         country_state,
//         country,
//     }) => {
//         return `${address_line1 || ''}, ${address_line2 || ''}, ${city || ''}, ${pincode || ''}, ${country_state || ''}, ${country || ''}`;
//     };

// 	const renderModalContent = () => {
// 		switch (modalContent) {
// 			case "signature":
// 				return (
// 					<Flex direction="column" mt={4}>
// 						<InputLabel required>Upload Signature</InputLabel>
// 						<Dropzone
// 							file={file}
// 							setFile={setFile}
// 							accept=".jpg,.png"
// 						/>
// 						<Flex
// 							direction={{
// 								base: "column",
// 								md: "row",
// 							}}
// 							w="100%"
// 							gap="4"
// 							align="center"
// 							mt="4"
// 						>
// 							<Button
// 								type="submit"
// 								size="lg"
// 								h="48px"
// 								w={{ base: "100%", md: "200px" }}
// 								fontWeight="bold"
// 								borderRadius="10px"
// 								onClick={handleSignatureUpload}
// 								isLoading={isSubmitting}
// 								colorScheme="blue"
// 							>
// 								Save
// 							</Button>

// 							<Button
// 								h="48px"
// 								w={{ base: "100%", md: "auto" }}
// 								bg="transparent"
// 								variant="link"
// 								fontWeight="bold"
// 								color="red.500"
// 								_hover={{ textDecoration: "none" }}
// 								borderRadius="10px"
// 								onClick={() => router.back()}
// 							>
// 								Cancel
// 							</Button>
// 						</Flex>
// 					</Flex>
// 				);
// 			case "email":
// 				return (
// 					<Flex direction="column" gap={4}>
// 						<InputLabel required={true}>Email</InputLabel>
// 						<Input
// 							placeholder="Enter your email"
// 							value={email}
// 							onChange={(e) => setEmail(e.target.value)}
// 						/>
// 						{showOtpSend && (
// 							<Button
// 								size="xs"
// 								width="80px"
// 								height="20px"
// 								_hover={{ bg: "primary.dark" }}
// 								onClick={sendOtpRequest}
// 								isDisabled={!email}
// 								color="accent"
// 							>
// 								Send OTP
// 							</Button>
// 						)}
// 						{isOtpSent && (
// 							<Flex direction="column">
// 								<Flex w="full" align="center" justify="center">
// 									<OtpInput
// 										inputStyle={{
// 											w: { base: 12, sm: 14 },
// 											h: { base: 12 },
// 											fontSize: "sm",
// 										}}
// 										length={4}
// 										onChange={setOtp}
// 										onEnter={() => verifyOtpHandler()}
// 										onComplete={(otp) =>
// 											verifyOtpHandler(otp)
// 										}
// 									/>
// 								</Flex>
// 								<Flex
// 									justify="center"
// 									mt={{ base: 6, "2xl": "2.5rem" }}
// 									fontSize={{ base: "sm", "2xl": "lg" }}
// 									gap="0px 10px"
// 									userSelect="none"
// 								>
// 									{timer >= 1 ? (
// 										<>
// 											<Text as={"span"}>
// 												Resend OTP in{" "}
// 											</Text>
// 											<Flex
// 												align="center"
// 												color="error"
// 												columnGap="4px"
// 											>
// 												<Icon
// 													name="timer"
// 													size="18px"
// 												/>
// 												00:
// 												{timer <= 9
// 													? "0" + timer
// 													: timer}
// 											</Flex>
// 										</>
// 									) : (
// 										<>
// 											<Text as={"span"}>
// 												Did not receive yet?
// 											</Text>
// 											<Text
// 												cursor="pointer"
// 												as="span"
// 												color="primary.DEFAULT"
// 												onClick={resendOtpHandler}
// 												fontWeight="medium"
// 											>
// 												Resend OTP
// 											</Text>
// 										</>
// 									)}
// 								</Flex>
// 							</Flex>
// 						)}
// 					</Flex>
// 				);
// 			case "address":
// 				return <Address onSubmit={handleAddressSubmit}></Address>;
// 			default:
// 				return null;
// 		}
// 	};

// 	const getOnSubmitHandler = () => {
// 		switch (modalContent) {
// 			case "email":
// 				return handleVerifyEmail;
// 			case "signature":
// 				return handleSignatureUpload;
// 			case "address":
// 				return handleAddressSubmit;
// 			default:
// 				throw new Error(`Unknown modalContent: ${modalContent}`);
// 		}
// 	};

// 	const getSubmitText = () => {
//         console.log("@@@@ modalContent" , modalContent);
// 		switch (modalContent) {
// 			case "email":
// 				return "Verify Email";
// 			case "signature":
// 				return "Upload Signature";
// 			case "address":
// 				return "Submit Address";
// 			default:
// 				throw new Error(`Unknown modalContent: ${modalContent}`);
// 		}
// 	};

// 	return (
// 		<Flex direction="column" gap="8">
// 			<Flex direction="column" gap="8" w={{ base: "100%", md: "500px" }}>
// 				<Flex direction="column">
// 					<InputLabel required>Your Signature</InputLabel>
// 					<Flex direction="row" align="center" gap={4}>
// 						<Box height="auto">
// 							<Image
// 								src="https://via.assets.so/img.jpg?w=350&h=150&tc=blue&bg=#cecece"
// 								width="100%"
// 								height="120px"
// 								objectFit="contain"
// 							/>
// 						</Box>
// 						<Button
// 							size="l"
// 							bg="primary.DEFAULT"
// 							height="30px"
// 							width="60px"
// 							_hover={{ bg: "primary.dark" }}
// 							onClick={() => {
// 								setModalContent("signature");
// 								modal.onOpen();
// 							}}
// 						>
// 							Edit
// 						</Button>
// 					</Flex>
// 				</Flex>

// 				<Flex direction="column">
// 					<InputLabel required={true}>Email</InputLabel>
// 					<Flex direction="row" gap={4}>
// 						{email && <Text fontWeight={600}>{email}</Text>}
// 						<Button
// 							size="l"
// 							bg="primary.DEFAULT"
// 							height="30px"
// 							width={email ? "60px" : "100px"}
// 							_hover={{ bg: "primary.dark" }}
// 							onClick={() => {
// 								setModalContent("email");
// 								modal.onOpen();
// 							}}
// 						>
// 							{email ? "Edit" : "Add"}
// 						</Button>
// 					</Flex>
// 				</Flex>
// 				<Flex direction="column">
// 					<InputLabel required={true}>Business Address</InputLabel>
// 					<Flex direction="row" gap={4}>
// 						{address && <Text fontWeight={600}>{address}</Text>}
// 						<Button
// 							size="l"
// 							bg="primary.DEFAULT"
// 							height="30px"
// 							width={address ? "60px" : "100px"}
// 							_hover={{ bg: "primary.dark" }}
// 							onClick={() => {
// 								setModalContent("address");
// 								modal.onOpen();
// 							}}
// 						>
// 							{address ? "Edit" : "Add "}
// 						</Button>
// 					</Flex>
// 				</Flex>
// 			</Flex>

// 			<Modal
// 				isOpen={modal.isOpen}
// 				onClose={modal.onClose}
// 				title={"Add " + modalContent}
// 				onSubmit={
// 					modalContent === "email"
// 						? handleVerifyEmail
// 						: handleSignatureUpload
// 				}
// 				disabled={isSubmitting}
// 				submitText={
// 					modalContent === "email"
// 						? "Verify Email"
// 						: "Upload Signature"
// 				}
// 			>
// 				{renderModalContent()}
// 			</Modal>
// 		</Flex>
// 	);
// };

// export { AgreementSigning };
