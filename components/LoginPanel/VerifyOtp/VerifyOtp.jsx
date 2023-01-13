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
import { Buttons, IconButtons } from "../../";

const VerifyOtp = ({ number, setStep }) => {
	const formatNum =
		number.slice(0, 3) +
		" " +
		number.slice(2, 5) +
		" " +
		number.slice(5, 11);
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

			<Flex mt="30px" ml="3rem" fontSize="lg" align="center">
				<Text>
					Sent on{" "}
					<Text as="span" fontWeight="semibold">
						+91 {formatNum}
					</Text>
				</Text>
				<IconButtons
					onClick={() => setStep((prev) => prev - 1)}
					iconPath="/icons/pen.svg"
					iconStyle={{ h: "12px", w: "12px" }}
				/>
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

			<Flex justify="center" mb="6.25rem" mt="2.5rem" align="center">
				<Text>Did not receive yet?</Text>
				<Text
					pl="2.5"
					as="span"
					color="accent.DEFAULT"
					fontSize="lg"
					fontWeight="medium"
				>
					Resend OTP
				</Text>
			</Flex>

			<Buttons
				title="Verify"
				h="4.5rem"
				fontSize="xl"
				borderRadius="10px"
				boxShadow="0px 3px 10px #FE9F0040"
			/>
		</Flex>
	);
};

export default VerifyOtp;
