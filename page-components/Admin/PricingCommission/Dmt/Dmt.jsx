import {
	Box,
	Flex,
	HStack,
	Input,
	Radio,
	RadioGroup,
	Stack,
	Text,
	VStack,
} from "@chakra-ui/react";
import { Button, Icon, MultiSelect, Select } from "components";
import { useOrgDetailContext } from "contexts/OrgDetailContext";
import { useUser } from "contexts/UserContext";
import useRequest from "hooks/useRequest";
import { useEffect, useRef, useState } from "react";
/**
 * A <Dmt> component
 * TODO: Write more description here
 * @arg 	{Object}	prop	Properties passed to the component
 * @param	{string}	[prop.className]	Optional classes to pass to this component.
 * @example	`<Dmt></Dmt>`
 */

const Dmt = () => {
	const { userData } = useUser();
	const { orgDetail } = useOrgDetailContext();
	const [selected, setSelected] = useState("");
	const [selectedArr, setSelectedArr] = useState([]);
	const [iconValue, setIconValue] = useState("percent");
	const [selectedValue, setSelectedValue] = useState("1");
	const focusRef = useRef(null);
	const [value, setValue] = useState("1");
	const [selectedCommissionFor, setCommissionFor] = useState("1");
	const [dmt, setDmt] = useState(0);
	const [commission, setCommission] = useState(2.5);
	const handleRadioChange = (value) => {
		setSelectedValue(value);
	};
	const handleCommissionFor = (event) => {
		setCommissionFor(event.target.value);
		setValue(event.target.value);
	};
	const commisionFor = [
		{ key: "1", label: "Individuals" },
		{ key: "2", label: "Distributors" },
		// { key: "3", label: "Products" },
	];
	const getLabelFromKey = (key) => {
		const radio = commisionFor.find((radio) => radio.key === key);
		return radio ? radio.label : "";
	};
	const slabData = [
		{ key: 1, minSlabAmount: 100, maxSlabAmount: 200 },
		{ key: 2, minSlabAmount: 200, maxSlabAmount: 400 },
	];

	const popBoxHandle = (boxStateFlag) => {
		if (boxStateFlag) {
			focusRef.current.style.display = "block";
		} else {
			focusRef.current.style.display = "none	";
		}
	};
	const defineCommisionHandler = (e) => {
		setCommission(e.target.value);
	};
	const handlesetPricing = () => {
		setDmt((prevDmt) => (prevDmt === 1 ? 0 : 1));
	};
	const newSelectedArr = selectedArr
		? selectedArr.map((str) => parseInt(str))
		: [];
	console.log("newSelectedArr", newSelectedArr);
	//remove quotes from array
	/* API CALLING */
	let headers = {
		"tf-req-uri-root-path": "/ekoicici/v1",
		"tf-req-uri": `/network/pricing_commissions/dmt`,
		"tf-req-method": "POST",
	};
	const { data, error, isLoading, mutate } = useRequest({
		method: "POST",
		baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL + "/transactions/do",
		headers: { ...headers },
		body: {
			operation_type: selectedCommissionFor, //selectedCommissionFor
			CspList: newSelectedArr,
			operation: dmt,
			min_slab_amount: selected.minSlabAmount, //selected.minSlabAmount
			max_slab_amount: selected.maxSlabAmount, //selected.maxSlabAmount
			actual_pricing: commission,
			pricing_type: selectedValue, //selectedValue
			OrgId: "1",
		},
		authorization: `Bearer ${userData.access_token}`,
	});
	useEffect(() => {
		mutate(
			process.env.NEXT_PUBLIC_API_BASE_URL + "/transactions/do",
			headers
		);
	}, [headers["tf-req-uri"], selectedCommissionFor, dmt]);
	const selectdata = data?.data?.allCspList ?? [];

	const renderer = {
		value: "ekocspid",
		label: "DisplayName",
	};
	return (
		<Stack w={"100%"} minH={{ base: "100%", md: "100%" }} gap={"10"}>
			<VStack w={"100%"} gap={".5"}>
				<Box w={"100%"}>
					<Text fontSize={"md"} fontWeight={"semibold"}>
						Select commissions for
					</Text>
				</Box>
				<HStack justifyContent={"flex-start"} w={"100%"}>
					<RadioGroup
						w={"100%"}
						onChange={setValue}
						value={value}
						defaultValue="0"
					>
						<Stack
							direction={{ base: "column", md: "row" }}
							gap={{ base: "25px", sm: "20px", md: "20px" }}
							flexWrap={"wrap"}
						>
							{commisionFor.map((radio) => (
								<Radio
									key={radio.key}
									size="lg"
									value={radio.key}
									isChecked={
										selectedCommissionFor === radio.key
									}
									onChange={handleCommissionFor}
								>
									<Text fontSize={{ base: "sm", sm: "md" }}>
										{radio.label}
									</Text>
								</Radio>
							))}
						</Stack>
					</RadioGroup>
				</HStack>
			</VStack>

			<Flex>
				<MultiSelect
					label={`Select ${getLabelFromKey(value)}`} //title change according to radio button value
					options={selectdata}
					renderer={renderer}
					setData={setSelectedArr}
				/>
			</Flex>

			<Flex>
				<Select
					label="Select Slab"
					data={slabData}
					setSelected={setSelected}
				/>
			</Flex>

			<VStack w={"100%"} gap={"2.5"}>
				<Box w={"100%"}>
					<Text fontSize={"md"} fontWeight={"semibold"}>
						Select Commission Type
					</Text>
				</Box>
				<HStack justifyContent={"flex-start"} w={"100%"}>
					<RadioGroup
						w={"100%"}
						defaultValue="1"
						value={selectedValue}
						onChange={handleRadioChange}
					>
						<Stack
							direction={{ base: "column", md: "row" }}
							gap={{ base: "5px", sm: "20px", md: "60px" }}
							flexWrap={"wrap"}
						>
							<Radio size="lg" value="1">
								<Text fontSize={{ base: "xs", sm: "inherit" }}>
									Percentage (%)
								</Text>
							</Radio>

							<Radio size="lg" value="2">
								<Text fontSize={{ base: "xs", sm: "inherit" }}>
									Fixed
								</Text>
							</Radio>
						</Stack>
					</RadioGroup>
				</HStack>
			</VStack>

			<VStack w={"100%"} gap={"2.5"}>
				<Box w={"100%"} h={"100%"}>
					<Text fontSize={"md"} fontWeight={"semibold"}>
						Define Commission
					</Text>
				</Box>
				<HStack
					className="hstack"
					justifyContent={"flex-start"}
					w={"100%"}
					minH={{ base: "50px", md: "183px" }}
					direction={{ base: "column", md: "row" }}
				>
					<Flex
						h={"100%"}
						direction={{ base: "column", md: "row" }}
						columnGap="20px"
						w={{ base: "100%", xl: "71%", "2xl": "56.5%" }}
						mr={{ base: "0px", lg: "50px" }}
					>
						<Flex direction={"column"} rowGap={"4.375rem"}>
							<Flex
								w={{
									base: "100%",
									sm: "72%",
									md: "380px",
									xl: "400px",

									"2xl": "500px",
								}}
								h="3rem"
								border={"card"}
								borderRadius={{ base: "10px", xl: "10px" }}
								pr={"15px"}
								gap="15px"
								align="center"
							>
								<Input
									placeholder="Commission Percentage"
									defaultValue={2.5}
									type="text"
									w={{ base: "100%" }}
									h={"48px"}
									border={"none"}
									min={"0"}
									focusBorderColor={"transparent"}
									fontSize={{
										base: "sm",
										md: "sm",
										"2xl": "lg",
									}}
									onClick={() => {
										popBoxHandle(true);
									}}
									onBlur={() => {
										popBoxHandle(false);
									}}
									onChange={defineCommisionHandler}
									onKeyPress={(event) => {
										if (
											!/[0-9.]|Backspace/.test(event.key)
										) {
											event.preventDefault();
										}
									}}
								/>
								<Icon
									name={
										iconValue === "percent"
											? "percent_bg"
											: "rupee_bg"
									}
									w="23px"
									h="20px"
									color="accent.DEFAULT"
								/>
							</Flex>

							<Flex
								position={{ base: "fixed", md: "initial" }}
								w={"100%"}
								// h={"83px"}
								bottom={"0%"}
								left={"0%"}
								zIndex={"99"}
								boxShadow={{
									base: "0px -3px 10px #0000001A",
									md: "none",
									bg: "white",
								}}
							>
								<Flex
									gap={{ base: "5", md: "3.375rem" }}
									align={"center"}
									display={{ base: "none", md: "flex" }}
								>
									<Button
										w={{
											base: "100%",
											sm: "150px",
											md: "200px",
											lg: "210px",

											"2xl": "249px",
										}}
										h={{
											base: "40px",
											sm: "40px",
											md: "64px",
										}}
										fontSize={{
											base: "xs",
											md: "lg",
										}}
										borderRadius={{
											base: "5px",
											md: "10px",
										}}
										fontWeight={"bold"}
										boxShadow="0px 3px 10px #FE9F0040"
										onClick={handlesetPricing}
									>
										Save Commissions
									</Button>
									<Button
										fontSize={{
											base: "xs",
											md: "lg",
										}}
										borderRadius={{
											base: "5px",
											xl: "10px",
										}}
										variant="ghost"
										color={"accent.DEFAULT"}
										fontWeight={"bold"}
									>
										Cancel
									</Button>
								</Flex>

								<Flex
									display={{ base: "flex", md: "none" }}
									mt="20px"
								>
									<Flex
										display={{ md: "none" }}
										w={"100%"}
										overflow={"hidden"}
										h={"100%"}
									>
										<Button
											as={Button}
											// aria-label="Options"
											w={"50vw"}
											bg="white"
											h={"63px"}
											borderRadius={"0px"}
											color="accent.DEFAULT"
											_active={{
												bg: "white",
											}}
											_hover={{
												bg: "white",
											}}
										>
											<Text
												color="accent.DEFAULT"
												fontSize={"20px"}
												lineHeight={"0"}
												fontWeight={"semibold"}
												display={"flex"}
												justifyContent={"center"}
												alignItems={"center"}
												// gap={"10px"}
											>
												Cancel
											</Text>
										</Button>
									</Flex>
									<Flex>
										<Button
											display={"flex"}
											gap={"10px"}
											// ref={btnRef}
											onClick={handlesetPricing}
											w={"50vw"}
											h={"63px"}
											bg="primary.DEFAULT"
											color="accent.DEFAULT"
											borderRadius={"0px"}
											boxShadow=" 0px 3px 10px #11299E1A"
											_active={{
												bg: "primary.DEFAULT",
											}}
											_hover={{
												bg: "primary.DEFAULT",
											}}
										>
											<Text
												as="span"
												color="white"
												fontSize={"18px"}
												lineHeight={"5"}
												fontWeight={"semibold"}
											>
												Save
												<br /> Commissions
											</Text>
										</Button>
									</Flex>
								</Flex>
							</Flex>
						</Flex>

						<Box
							mt={{ base: "10px", md: "0" }}
							position="relative"
							border="br-popupcard"
							boxShadow="0px 3px 6px #EFEFEF"
							w={{
								base: "100%",
								sm: "72%",
								md: "45%",
								xl: "42%",
							}}
							h={"180px"}
							borderRadius={{ base: "6px", sm: "10px" }}
							transition={"ease"}
							display={"none"}
							ref={focusRef}
						>
							<Box w={"100%"} h={"200px"}>
								<Box
									width={"15px"}
									height={"15px"}
									border="br-popupcard"
									borderRight="none"
									borderRadius="2px"
									transform={"rotate(45deg)"}
									mt={{ base: "-4px", md: "15px" }}
									ml={{ base: "25px", md: "-4px" }}
									bg="focusbg"
								></Box>

								<Box
									top={"0%"}
									bg="focusbg"
									borderRadius={"10px"}
									left={"0%"}
									width={{
										base: "100%",
										sm: "100%",
										md: "100%",
									}}
									h={"100%"}
									position={"absolute"}
									px={"11px"}
									py={"10px"}
								>
									<Flex
										w={"100%"}
										h={{ base: "auto", sm: "30px" }}
										color={"white"}
										bg={"primary.DEFAULT"}
										borderRadius={"6px"}
										justify={"space-between"}
										px={{ base: "12px", sm: "15px" }}
										py={{ base: "7px", sm: "8px" }}
										flexDir={{ base: "column", sm: "row" }}
										align={{ base: "", sm: "row" }}
									>
										<Text
											fontSize={"12px"}
											lineHeight="normal"
										>
											Benchmark Transaction
										</Text>
										<Flex
											align={"center"}
											columnGap={"5px"}
										>
											<Icon
												name="rupee"
												w="9px"
												h="11px"
											/>
											<Text fontSize={"12px"}>
												5000.00
											</Text>
										</Flex>
									</Flex>
									<Flex
										w={"100%"}
										h={"calc( 100% - 30px)"}
										p={"7px"}
										py={"14px"}
										direction={"column"}
										gap={{ base: "15px", sm: "25px" }}
									>
										<Flex w={"100%"}>
											<Flex
												direction={"column"}
												width={"50%"}
												h={"50%"}
											>
												<Text
													fontSize={"12px"}
													color="#0F0F0F"
												>
													Fixed charges
												</Text>
												<Flex
													w={"100%"}
													gap={"5px"}
													align={"center"}
												>
													<Icon
														name="rupee"
														w="9px"
														h="11px"
													/>

													<Text
														fontSize={"14px"}
														fontWeight={"semibold"}
													>
														1.80
													</Text>
												</Flex>
											</Flex>

											<Flex
												direction={"column"}
												width={"50%"}
												h={"50%"}
											>
												<Text fontSize={"12px"}>
													Taxes
												</Text>
												<Flex
													w={"100%"}
													gap={"5px"}
													align={"center"}
												>
													<Icon
														name="rupee"
														w="9px"
														h="11px"
													/>

													<Text
														fontSize={"14px"}
														fontWeight={"semibold"}
													>
														0.80
													</Text>
												</Flex>
											</Flex>
										</Flex>
										<Flex w={"100%"}>
											<Flex
												direction={"column"}
												width={"50%"}
												h={"50%"}
											>
												<Text
													fontSize={"12px"}
													color="#0F0F0F"
												>
													Fixed charges
												</Text>
												<Flex
													w={"100%"}
													gap={"5px"}
													align={"center"}
												>
													<Icon
														name="rupee"
														w="9px"
														h="11px"
													/>

													<Text
														fontSize={"14px"}
														fontWeight={"semibold"}
													>
														1.80
													</Text>
												</Flex>
											</Flex>

											<Flex
												direction={"column"}
												width={"50%"}
												h={"50%"}
											>
												<Text fontSize={"12px"}>
													Taxes
												</Text>
												<Flex
													w={"100%"}
													gap={"5px"}
													align={"center"}
												>
													<Icon
														name="rupee"
														w="9px"
														h="11px"
													/>
													<Text
														fontSize={"14px"}
														fontWeight={"semibold"}
													>
														0.80
													</Text>
												</Flex>
											</Flex>
										</Flex>
									</Flex>
								</Box>
							</Box>
						</Box>
					</Flex>
				</HStack>
			</VStack>
		</Stack>
	);
};

export default Dmt;
