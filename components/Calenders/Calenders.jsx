import { Box, Flex, Input, Text } from "@chakra-ui/react";
import { Icon, InputLabel } from "components";
import { useRef } from "react";

const Calenders = ({
	label,
	placeholder,
	name,
	type,
	required = false,
	labelStyle,
	inputContStyle,
	position,
	calendersProps,
	labelPosition,
	value,
	onChange = () => {},
	...props
}) => {
	// const [dateText] = useState("");
	// console.log("value", value);

	// {
	// 	console.log("dateTextdateTextdateText", dateText);
	// }
	// const fromRef = useRef(null);
	// const toRef = useRef(null);
	const calendarRef = useRef(null);

	const handleClickForInput = () => {
		// if (tpe == "to") {
		// 	toRef.current.showPicker();
		// } else {
		// 	console.log(fromRef.current);
		// 	fromRef.current.showPicker();
		// }
		calendarRef.current.showPicker();
	};
	return (
		<Flex direction={{ base: "column", md: "" }} {...props}>
			<Flex>
				{label ? (
					<InputLabel required={required} {...labelStyle}>
						{label}
					</InputLabel>
				) : null}
			</Flex>

			<Flex
				h="3rem"
				w="100%"
				border={"1px solid #D2D2D2"}
				borderRadius="10px"
				overflow={"hidden"}
				onClick={handleClickForInput}
				bg={"white"}
				px="10px"
				_hover={{
					bg: "focusbg",
					boxShadow: "0px 3px 6px #0000001A",
					borderColor: "hint",
					transition: "box-shadow 0.3s ease-out",
				}}
				{...inputContStyle}
			>
				<Flex
					justifyContent={"space-between"}
					w="full"
					h="100%"
					alignItems={"center"}
				>
					{/* From To */}
					<Flex alignItems={"center"}>
						<Flex
							onClick={handleClickForInput}
							align={"center"}
							lineHeight="normal"
						>
							{" "}
							{placeholder ? (
								<InputLabel
									required={required}
									fontSize={{
										base: "14px",
										md: "12px",
										xl: "14px",
									}}
								>
									{placeholder}:&nbsp;
								</InputLabel>
							) : (
								""
							)}
						</Flex>
						{/* Input Palceholder */}

						<Flex w="100%">
							<Text
								fontSize={{
									base: "14px",
									md: "12px",
									xl: "14px",
								}}
								w="100%"
								lineHeight="normal"
							>
								{value || "DD/MM/YYYY"}
							</Text>
						</Flex>
					</Flex>

					<Flex>
						{/* Icon */}
						<Flex pos="relative">
							<Box
								w={"100%"}
								h={"100%"}
								display={"flex"}
								alignItems={"center"}
							>
								<Input
									size="xs"
									w="1px"
									type="date"
									height="100%"
									// min="2023-01-20"
									// max="2023-04-20"
									ref={calendarRef}
									onClick={handleClickForInput}
									onChange={(e) => onChange(e)}
									border={"none"}
									focusBorderColor={"transparent"}
									{...calendersProps}
								/>
							</Box>

							{/* Icon */}
							{/* <Flex
								w="100%"
								h="100%"
								alignItems="center"
								justifyContent="center"
							> */}
							<Icon
								color="dark"
								name="calender"
								width="23px"
								h="24px"
							/>
							{/* </Flex> */}
						</Flex>
					</Flex>
				</Flex>
			</Flex>
		</Flex>
	);
};
Calenders.defaultProps = {
	onChange: () => {},
};

export default Calenders;
