import { Avatar, Box, Flex, Text } from "@chakra-ui/react";
import { Icon } from "components";
/**
 * A <RecentTrxnCard> component
 * TODO: Write more description here
 * @param 	{object}	prop	Properties passed to the component
 * @param	{string}	prop.prop1	TODO: Property description.
 * @param	{...*}	rest	Rest of the props passed to this component.
 * @example	`<RecentTrxnCard></RecentTrxnCard>` TODO: Fix example
 */
const RecentTrxnCard = () => {
	return (
		<div>
			<Flex
				minH={{
					base: "auto",
					sm: "auto",
					md: "387px",
					lg: "300px",
					xl: "387px",
				}}
				maxH={{
					base: "auto",
					sm: "auto",
					md: "387px",
					lg: "400px",
					xl: "387px",
				}}
				minW={{
					base: "auto",
					sm: "auto",
					md: "380px",
					lg: "360px",
					xl: "350px",
				}}
				maxW={{
					base: "auto",
					sm: "auto",
					md: "1000px",
					lg: "400px",
					xl: "580px",
				}}
				borderRadius={{
					base: "10px 10px 10px 10px",
					sm: "10px 10px 10px 10px",
					md: "10px",
				}}
				background={"white"}
				direction={"column"}
				// align={{
				// 	base: "flex-start",
				// }}
				rowGap={{
					base: "20px",
					sm: "30px",
					md: "50px",
					lg: "20px",
					xl: "10px",
				}}
				px={{
					base: "20px",
					sm: "40px",
					md: "18px",
					lg: "15px",
					xl: "15px 10px",
				}}
				py={{
					base: "12px",
					sm: "30px",
					md: "18px",
					lg: "14px",
					xl: "15px",
				}}
				m={{ base: "18px", sm: "10px", md: "0px" }}
			>
				<Flex justifyContent="space-between">
					<Text as="b">Recent transactions</Text>
					<Text as="b" color="primary.DEFAULT">
						Show All
					</Text>
				</Flex>
				<Flex justifyContent="space-between">
					<Flex justifyContent="space-between">
						<Avatar
							size="lg"
							border="2px solid #D2D2D2"
							bg="white"
							src="https://asia-exshopstatic-vivofs.vivo.com/KuCZNhz3cVxH4yrP/tw/1661950644473/355d924dfa49d160b07d5bd60b3c3ce4.jpg"
						/>
						<Box>
							<Text fontSize={{ xl: "md" }}>
								AePS Cashout to xxxxxx9834
							</Text>
							<Text>Transaction ID: 876430982351</Text>
						</Box>
					</Flex>
					<Flex justifyContent="space-between" alignItems="center">
						<Text color="primary.DEFAULT" paddingRight="6px">
							Details
						</Text>
						<Icon
							w="12px"
							name="arrow-forward"
							color="primary.DEFAULT"
						/>
					</Flex>
				</Flex>
			</Flex>
		</div>
	);
};

export default RecentTrxnCard;
