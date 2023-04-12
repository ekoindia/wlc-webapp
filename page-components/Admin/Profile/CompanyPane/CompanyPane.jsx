import {
	Avatar,
	Box,
	Circle,
	Divider,
	Flex,
	Heading,
	Text,
	useMediaQuery,
} from "@chakra-ui/react";
import { Buttons, Cards, Icon, IconButtons } from "components";
import Router from "next/router";
/**
 * A <CompanyPane> component
 * TODO: Write more description here
 * @arg 	{Object}	prop	Properties passed to the component
 * @param	{string}	[prop.className]	Optional classes to pass to this component.
 * @example	`<CompanyPane></CompanyPane>`
 */
const CompanyPane = (props) => {
	const compdata = props.rowdata;
	// console.log(compdata, "Company pane data");
	const [isSmallerThan440] = useMediaQuery("(max-width:440px)");
	return (
		<Cards>
			<Flex gap="5" align="center">
				<Circle bg="divider" size={{ base: 20, lg: 20, xl: 28 }}>
					<Avatar
						w={{ base: 16, lg: 59, xl: 90 }}
						h={{ base: 16, lg: 59, xl: 90 }}
						src="/images/seller_logo.jpg"
					/>
				</Circle>
				<Box>
					<Heading
						fontSize={{ base: 20, md: 15, lg: 17, xl: 18 }}
						fontWeight="semibold"
					>
						{compdata.shop_name}
					</Heading>
					<Flex
						fontSize={{ base: 14, md: 12, lg: 14 }}
						fontWeight="medium"
					>
						<Text>User Code:</Text>
						<Text color={"primary.DEFAULT"}>
							<span>&nbsp;</span> {compdata.eko_code}
						</Text>
					</Flex>
				</Box>
			</Flex>

			<Box mt={{ base: "38", lg: "39", xl: "70" }}>
				<Flex justify="space-between" h="42px" wrap={"wrap"}>
					<Box
						display="flex"
						flexDirection={isSmallerThan440 ? "row" : "column"}
						alignItems={{ base: "center", sm: "flex-start" }}
						gap={isSmallerThan440 ? 2 : 0}
					>
						<Text
							color="light"
							fontSize={{ base: 14, md: 12, lg: 14 }}
						>
							Account type
							{isSmallerThan440 ? <Text as="span">:</Text> : ""}
						</Text>
						<Text
							color="dark"
							fontSize={{ base: 16, md: 13, lg: 16 }}
							fontWeight="medium"
						>
							{compdata.account_type}
						</Text>
					</Box>
					{isSmallerThan440 ? (
						<Divider orientation="horizontal" my={2} />
					) : (
						<Divider orientation="vertical" />
					)}
					<Box
						display="flex"
						flexDirection={isSmallerThan440 ? "row" : "column"}
						alignItems={{ base: "center", sm: "flex-start" }}
						gap={isSmallerThan440 ? 2 : 0}
					>
						<Text
							color="light"
							fontSize={{ base: 14, md: 12, lg: 14 }}
						>
							Plan name
							{isSmallerThan440 ? <Text as="span">:</Text> : ""}
						</Text>
						<Text
							color="dark"
							fontSize={{ base: 16, md: 13, lg: 16 }}
							fontWeight="medium"
						>
							{compdata.plan_name}
						</Text>
					</Box>
					{isSmallerThan440 ? (
						<Divider orientation="horizontal" my={2} />
					) : (
						<Divider orientation="vertical" />
					)}
					<Box
						display="flex"
						flexDirection={isSmallerThan440 ? "row" : "column"}
						alignItems={{ base: "center", sm: "flex-start" }}
						gap={isSmallerThan440 ? 2 : 0}
					>
						<Text
							color="light"
							fontSize={{ base: 14, md: 12, lg: 14 }}
						>
							KYC status
							{isSmallerThan440 ? <Text as="span">:</Text> : ""}
						</Text>
						<Text
							color="dark"
							fontSize={{ base: 16, md: 13, lg: 16 }}
							fontWeight="medium"
						>
							KYC Compliant
						</Text>
					</Box>
				</Flex>
			</Box>

			<Box mt={{ base: "95", lg: "20", xl: "70" }}>
				<Buttons
					onClick={() =>
						Router.push("/admin/my-network/profile/up-sell-info")
					}
					w={{ base: "100%", lg: "205px", xl: "215px" }}
					h="60px"
					title="Update Information"
				/>
			</Box>

			<Box
				mt={{ base: "38", md: "50", xl: "70" }}
				p="20px"
				h="160"
				border="1px solid #D2D2D2"
				borderRadius="15px"
				bg="#FAFDFF"
			>
				<Flex justify="space-between" align="center" mb={4}>
					<Box alignItems="center">
						<Flex gap={4} align="center" justify="center">
							<Circle size={14} bg={"divider"}>
								<Icon
									name="account-balance-wallet"
									width="24px"
									height="21px"
								/>
							</Circle>
							<Box>
								<Text color={"light"} fontSize={14}>
									Wallet Balance
								</Text>
								<Text
									color={"accent.DEFAULT"}
									fontWeight="medium"
									fontSize={20}
								>
									<span>&#x20B9; </span>
									{compdata.wallet_balance}
								</Text>
							</Box>
						</Flex>
					</Box>
					<Box>
						<Circle
							size={isSmallerThan440 ? 10 : 12}
							bg={"success"}
							color="white"
							boxShadow="0px 3px 6px #00000029"
							border="2px solid #FFFFFF"
						>
							<Icon name="add" height="24px" width="24px" />
						</Circle>
					</Box>
				</Flex>
				<Divider />
				<Flex align="center" justify="center" mt="6">
					<IconButtons
						title="View All Transactions"
						iconName="arrow-forward"
						hasBG={false}
						iconStyle={{
							width: "18px",
							height: "15px",
						}}
					/>
				</Flex>
			</Box>
		</Cards>
	);
};

export default CompanyPane;
