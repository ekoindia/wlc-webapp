import {
	Button,
	Center,
	Divider,
	Flex,
	Heading,
	Image,
	Text,
} from "@chakra-ui/react";
import { Buttons, Input } from "../../";

const Login = ({ setStep, setNumber, number }) => {
	const onChangeHandler = (val) => {
		if (val.length <= 10) setNumber(val);
	};
	return (
		<Flex direction="column">
			<Heading as="h3">Login</Heading>

			<Button
				variant
				mt="4.35rem"
				h="4.5rem"
				bg="#4185F4"
				w="100%"
				fontSize="2xl"
				color="white"
				fontWeight="medium"
				borderRadius="10px"
				position="relative"
				onClick={() => setStep(2)}
			>
				<Center
					bg="#FFFFFF"
					p="13px"
					borderRadius="10px"
					position="absolute"
					left="2px"
				>
					<Image src="./icons/google.png" />
				</Center>
				Login with Google
			</Button>

			<Flex align="center" justify="center" py="5.62rem">
				<Divider w="13rem" borderColor="#707070" />
				<Text
					fontSize="1rem"
					color="#0F0F0F"
					px="1.5"
					width="fit-content"
				>
					Or login with mobile number
				</Text>
				<Divider w="13rem" borderColor="#707070" />
			</Flex>

			<Input
				label="Enter mobile number"
				placeholder={"XXX XXX XXXX"}
				value={number}
				disabled={false}
				hidden={false}
				invalid={false}
				errorMsg="Hello this is error"
				mb="4.35rem"
				onChange={onChangeHandler}
				labelStyle={{
					fontSize: "lg",
					color: "light",
					pl: "0",
					fontWeight: "semibold",
					mb: "0.8rem",
				}}
				inputContStyle={{ h: "4rem", pos: "relative" }}
				isNumInput={true}
			/>

			<Buttons
				title="Verify"
				h="4.5rem"
				fontSize="xl"
				borderRadius="10px"
				boxShadow="0px 3px 10px #FE9F0040"
				onClick={() => setStep((prev) => prev + 1)}
			/>
		</Flex>
	);
};

export default Login;
