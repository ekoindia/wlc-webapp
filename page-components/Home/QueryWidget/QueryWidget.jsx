import { Flex, Text } from "@chakra-ui/react";
import { Button, Icon } from "components";
import { useOrgDetailContext } from "contexts";
/**
 * Contact widget in home page
 * Contact widget on home page
 * @param 	{object}	prop	Properties passed to the component
 * @param	{string}	prop.prop1	TODO: Property description.
 * @param	{...*}	rest	Rest of the props passed to this component.
 * @example	`<QueryWidget></QueryWidget>` TODO: Fix example
 */
const QueryWidget = () => {
	const { orgDetail } = useOrgDetailContext();
	const { support_contacts } = orgDetail || {};
	const { phone, email } = support_contacts || {};

	// If both cellnumber & email are not available, hide the widget
	if (!phone && !email) {
		return null;
	}

	return (
		<Flex
			h={{
				base: "auto",
				md: "320px",
				"2xl": "360px",
			}}
			borderRadius={{
				sm: "0px 0px 2px 2px",
				md: "10px",
			}}
			background={{
				base: "linear-gradient(to bottom, #2dbb5c, #02762c)",
				md: "url('./havequery.svg') no-repeat, linear-gradient(to bottom, #2dbb5c, #02762c)",
			}}
			backgroundSize="cover"
			direction="column"
			align={{
				base: "flex-start",
				md: "center",
			}}
			rowGap={{
				base: "20px",
			}}
			px={4}
			py={{
				base: "20px",
				xl: "25px",
			}}
			backgroundPosition="center"
		>
			<Flex
				width={{ md: "100%" }}
				alignContent="center"
				justifyContent="center"
				alignItems="baseline"
				color={"white"}
				as="b"
				pt={{ base: "10px" }}
				pb={{ base: "10px" }}
				direction={"row"}
			>
				<Text fontSize="21px" display="inline">
					Have a
				</Text>
				<Text fontSize="30px" display="inline" pl="0.3em">
					QUERY?
				</Text>
			</Flex>

			<Flex
				alignContent={{ base: "left", md: "center" }}
				w={{ base: "100%", md: "auto" }}
				direction={{ base: "row", md: "column" }}
				rowGap="20px"
				justifyContent="space-between"
			>
				{phone ? (
					<Flex>
						<a href={`tel:${phone}`} target="_blank">
							<Icon
								size="32px"
								name="phone-circle-outline"
								color="white"
								display="flex"
								mt={{ base: "2px", md: "23px" }}
								mr={{ base: "4px", md: "8px" }}
							/>
						</a>
						<Flex direction={"column"}>
							<Text
								color={"white"}
								fontSize={{
									base: "0.700rem",
									md: "18px",
								}}
								textAlign="auto"
								paddingLeft={{
									base: "0px",
									md: "15px",
								}}
							>
								Call us on
							</Text>
							<a href={`tel:${phone}`} target="_blank">
								<Text
									as="b"
									color={"white"}
									fontSize={{
										base: "0.700rem",
										md: "lg",
									}}
								>
									+91 {phone}
								</Text>
							</a>
						</Flex>
					</Flex>
				) : null}

				{phone && email ? (
					<Text
						color={"white"}
						display={{ base: "none", md: "block" }}
						textAlign={{ base: "left", md: "center" }}
					>
						or
					</Text>
				) : null}

				{email ? (
					<Flex direction={"column"}>
						<a href={`mailto:${email}`} target="_blank">
							<Button
								bg={"white"}
								border="1px solid white"
								color="accent.DEFAULT"
								_hover={{
									bg: "transparent",
									color: "white",
								}}
								icon={
									<Icon
										name="chat-outline"
										size={{ base: "18px", md: "20px" }}
									/>
								}
								borderRadius={{
									base: "5px",
									md: "10px",
								}}
								h={{
									base: "40px",
									md: "48px",
								}}
								w={{
									base: "120px",
									md: "190px",
								}}
							>
								<Text fontSize={{ base: "sm" }}>
									Write to us
								</Text>
							</Button>
						</a>
					</Flex>
				) : null}
			</Flex>
		</Flex>
	);
};

export default QueryWidget;
