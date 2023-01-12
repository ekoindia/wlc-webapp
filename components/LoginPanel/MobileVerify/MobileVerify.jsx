import { ArrowBackIcon } from "@chakra-ui/icons";
import { Box, Flex, Heading, Text } from "@chakra-ui/react";
import { Buttons, Input } from "../../";

const MobileVerify = ({ className = "", setStep, ...props }) => {
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

			<Flex mt="30px" ml="3rem" mb="6.8rem" fontSize="lg">
				<Text>
					Sent on <Text as="b">+91 989 134 5867</Text>
				</Text>
			</Flex>

			<Input
				label="Enter mobile number"
				placeholder={"XXX XXX XXXX"}
				// value={number}
				disabled={false}
				hidden={false}
				invalid={false}
				errorMsg="Hello this is error"
				labelStyle={{
					fontSize: "lg",
					color: "light",
					pl: "0",
					fontWeight: "semibold",
				}}
				inputContStyle={{ h: "4rem", pos: "relative" }}
				isNumInput={true}
			/>

			<Buttons
				mt="4.35rem"
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

export default MobileVerify;
