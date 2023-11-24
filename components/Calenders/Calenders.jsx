import { Box, Flex, Input, Text } from "@chakra-ui/react";
import { Icon, InputLabel } from "components";
import { forwardRef, useRef } from "react";

const Calenders = forwardRef(
	(
		{
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
			minDate,
			maxDate,
			onChange = () => {},
			...rest
		},
		ref
	) => {
		const calendarRef = useRef(null);

		const handleClickForInput = () => {
			calendarRef.current.showPicker();
		};

		return (
			<Flex direction={{ base: "column", md: "" }} {...rest}>
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
					borderRadius="5px"
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
						<Flex align="center">
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
										mb="0px"
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
										base: "xs",
										md: "sm",
									}}
									w="100%"
									lineHeight="normal"
								>
									{value || "YYYY-MM-DD"}
								</Text>
							</Flex>
						</Flex>

						<Flex>
							{/* Icon */}
							<Flex pos="relative" ref={ref}>
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
										name={name}
										value={value}
										min={minDate}
										max={maxDate}
										ref={calendarRef}
										onClick={handleClickForInput}
										onChange={(e) => onChange(e)}
										border={"none"}
										focusBorderColor={"transparent"}
										{...calendersProps}
									/>
								</Box>
								<Icon
									color="dark"
									name="calender"
									size="24px"
								/>
							</Flex>
						</Flex>
					</Flex>
				</Flex>
			</Flex>
		);
	}
);

Calenders.displayName = "Calenders";

export default Calenders;
