// import { Box, Flex, Heading, Text } from "@chakra-ui/react";
// import { Button } from "components";

// const SingleOnboardingSuccess = ({ setIsOpen }) => {
// 	let isSuccess = false;

// 	const RetailerInfo = {
// 		Name: "Gopi Kumar",
// 		Mobile: "9279316994",
// 		Agent: "Retailer",
// 		Message: "Successfully Onboarded",
// 	};
// 	return (
// 		<>
// 			<Flex align="center" justify="center">
// 				<Box textAlign="center" p={4} maxWidth="500px" width="90%">
// 					<Heading mb={6} textColor={isSuccess ? "success" : "error"}>
// 						{"Onboarding "}
// 						{isSuccess ? "Successful" : "Failed"}
// 					</Heading>
// 					<Box mb={6}>
// 						{Object.entries(RetailerInfo).map(([key, value]) => (
// 							<Text key={key}>
// 								<strong>{key}:</strong> {value}
// 							</Text>
// 						))}
// 					</Box>
// 					<Flex
// 						alignItems="center"
// 						direction={{ base: "column", md: "row" }}
// 						gap={{ base: "2", md: "8" }}
// 						mt={8}
// 						justifyContent="center"
// 					>
// 						<Button
// 							mt={4}
// 							size="lg"
// 							h="48px"
// 							w="180px"
// 							onClick={() => setIsOpen(false)}
// 						>
// 							{isSuccess ? "Continue" : "Back"}
// 						</Button>
// 					</Flex>
// 				</Box>
// 			</Flex>
// 		</>
// 	);
// };

// export default SingleOnboardingSuccess;
