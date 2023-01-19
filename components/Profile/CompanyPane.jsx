import {
	Avatar,
	Box,
	Circle,
	Divider,
	Flex,
	Heading,
	Text,
} from "@chakra-ui/react";
import { Buttons, Cards, Icon, IconButtons } from "..";

const CompanyPane = () => {
	return (
		<Cards>
			<Flex gap="5" align="center">
				<Circle bg="divider" size={28}>
					<Avatar w="90" h="90" src="/images/seller_logo.jpg" />
				</Circle>
				<Box>
					<Heading fontSize={18} fontWeight="semibold">
						Angel Tech Private Limited
					</Heading>
					<Flex fontSize={14} fontWeight="medium">
						<Text>Eko Code:</Text>
						<Text color={"primary.DEFAULT"}>
							<span>&nbsp;</span> 387608
						</Text>
					</Flex>
				</Box>
			</Flex>

			<Box mt="70">
				<Flex justify="space-between" h="42px" wrap={"wrap"}>
					<Box>
						<Text color="light" fontSize={14}>
							Account type
						</Text>
						<Text color="dark" fontSize={16} fontWeight="medium">
							iMerchant
						</Text>
					</Box>
					<Divider orientation="vertical" />
					<Box>
						<Text color="light" fontSize={14}>
							Plan name
						</Text>
						<Text color="dark" fontSize={16} fontWeight="medium">
							Specialist
						</Text>
					</Box>
					<Divider orientation="vertical" />
					<Box>
						<Text color="light" fontSize={14}>
							KYC status
						</Text>
						<Text color="dark" fontSize={16} fontWeight="medium">
							KYC Compliant
						</Text>
					</Box>
				</Flex>
			</Box>

			<Box mt={12}>
				<Buttons w="215px" h="60px" title="Update Information" />
			</Box>

			<Box
				mt="70"
				p="20px"
				h="160"
				border="1px solid #D2D2D2"
				borderRadius="15px"
				bg="#FAFDFF"
			>
				<Flex justify="space-between" align="center" mb={4}>
					<Box alignItems="center">
						<Flex gap={4} align="center" justify="center">
							<Circle size={10} bg={"divider"}>
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
									<span>&#x20B9; </span>15,893.00
								</Text>
							</Box>
						</Flex>
					</Box>
					<Box>
						<Circle size={10} bg={"success"} color="white">
							<Icon name="add" height="24px" width="24px" />
						</Circle>
					</Box>
				</Flex>
				<Divider />
				<Flex align="center" justify="center" mt="4">
					<IconButtons
						title="View All Transactions"
						iconFill="0"
						iconName="arrow-forward"
						iconPos="right"
						iconStyle={{ h: "15px", w: "18px" }}
					/>
				</Flex>
			</Box>
		</Cards>
	);
};

export default CompanyPane;
