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
	position,
	calendersProps,
	labelPosition,

	...props
}) => {
	const [dateText, setDateText] = useState({
		// TODO: Edit state as required
		from: "YYYY/MM/DD",
		to: "YYYY/MM/DD",
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
							onClick={(e) => handleClickForInput("from")}
							align={"center"}
						>
							{" "}
							{sublabel ? (
								<InputLabel
									required={required}
									fontSize={{
										base: "14px",
										md: "12px",
										xl: "14px",
									}}
								>
									{sublabel}:&nbsp;
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
							>
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
									w="1px"
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
							<Flex
								w="100%"
								h="100%"
								alignItems="center"
								justifyContent="center"
							>
								<Icon
									color="dark"
									name="calender"
									width="27px"
									h="26px"
								/>
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
