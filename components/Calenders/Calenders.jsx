import React, { useEffect, useState, useRef } from "react";
import {
	Box,
	Center,
	Flex,
	Input,
	Text,
	VStack,
	Button,
} from "@chakra-ui/react";
import { Buttons, Icon, InputLabel } from "components";

const Calenders = ({
	label,
	sublabel,
	name,
	type,
	required = false,
	labelStyle,
	inputContStyle,
	calendersProps,
	labelPosition,
	...props
}) => {
	const [dateText, setDateText] = useState({
		// TODO: Edit state as required
		from: "DD/MM/YYYY",
		to: "DD/MM/YYYY",
	});
	const fromRef = useRef(null);
	const toRef = useRef(null);

	const handleClickForInput = (type) => {
		if (type == "to") {
			toRef.current.showPicker();
		} else {
			console.log(fromRef.current);
			fromRef.current.showPicker();
		}
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
				onClick={(e) => handleClickForInput("from")}
				bg={"white"}
				px="15px"
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
					<Flex gap="5px">
						<Flex
							onClick={(e) => handleClickForInput("from")}
							align={"center"}
							w="100%"
						>
							{" "}
							{sublabel ? (
								<InputLabel required={required} fontSize="14px">
									{sublabel}:
								</InputLabel>
							) : (
								""
							)}
						</Flex>
						{/* Input Palceholder */}

						<Flex w="100px">
							<Text fontSize="14px" w="100px">
								{dateText.from}
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
									w="2px"
									type="date"
									height="100%"
									ref={fromRef}
									onClick={(e) => handleClickForInput("from")}
									onChange={(e) => {
										if (!e.target.value) {
											setDateText((prev) => {
												return {
													...prev,
													from: "DD/MM/YYYY",
												};
											});
										} else {
											setDateText((prev) => {
												return {
													...prev,
													from: e.target.value,
												};
											});
										}
									}}
									border={"none"}
									focusBorderColor={"transparent"}
									{...calendersProps}
								/>
							</Box>

							{/* Icon */}
							<Flex>
								<Center alignItems="flex-end">
									<Icon
										name="calender"
										width="23px"
										height="24px"
									/>
								</Center>
							</Flex>
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
