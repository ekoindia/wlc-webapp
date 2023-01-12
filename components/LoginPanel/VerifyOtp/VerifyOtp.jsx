import { ArrowBackIcon } from "@chakra-ui/icons";
import {
	Box,
	Flex,
	Heading,
	HStack,
	PinInput,
	PinInputField,
	Text,
} from "@chakra-ui/react";
import { Buttons } from "../../";

const VerifyOtp = ({ number, setStep }) => {
	return (
		<Flex direction="column">
			<Flex align="center">
				<Box onClick={() => setStep(0)}>
					<ArrowBackIcon boxSize={6} w="18px" h="15px" />
				</Box>
				<Heading as="h3" pl={5} fontWeight="600">
					Verify with OTP
				</Heading>
			</Flex>

			<Flex mt="30px" ml="3rem" fontSize="lg">
				<Text>
					Sent on <Text as="b">+91 989 134 5867</Text>
				</Text>
			</Flex>

			<HStack justify="space-between" mt="7.25rem">
				<PinInput type="number" otp size="lg" placeholder="">
					<PinInputField w="95px" h="64px" borderColor="hint" />
					<PinInputField w="95px" h="64px" borderColor="hint" />
					<PinInputField w="95px" h="64px" borderColor="hint" />
					<PinInputField w="95px" h="64px" borderColor="hint" />
					<PinInputField w="95px" h="64px" borderColor="hint" />
					<PinInputField w="95px" h="64px" borderColor="hint" />
				</PinInput>
			</HStack>

			<Flex justify="center" mb="6.25rem" mt="2.5rem">
				<Text>
					Did not receive yet?
					<Text pl="3" as="span">
						Resend OTP
					</Text>
				</Text>
			</Flex>

			<Buttons
				title="Verify"
				h="4.5rem"
				fontSize="xl"
				borderRadius="10px"
				boxShadow="0px 3px 10px #FE9F0040"
				// onClick={() => setStep(prev => prev + 1)}
			/>
		</Flex>
	);
};

export default VerifyOtp;
