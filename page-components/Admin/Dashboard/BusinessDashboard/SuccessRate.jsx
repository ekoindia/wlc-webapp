import { Divider, Flex, Stack, Text } from "@chakra-ui/react";

/**
 * A SuccessRate page-component
 * TODO: Write more description here
 * @arg 	{Object}	prop	Properties passed to the component
 * @param	{string}	[prop.className]	Optional classes to pass to this component.
 * @example	`<SuccessRate></SuccessRate>`
 */
const SuccessRate = ({ data }) => {
	const successRateList = [
		{ key: "dmt", label: "DMT", value: data?.dmt },
		{ key: "bbps", label: "BBPS", value: data?.bbps },
		{ key: "aepsCashout", label: "AePS Cashout", value: data?.aepsCashout },
		{
			key: "aepsMiniStatement",
			label: "AePS mini statement",
			value: data?.aepsMiniStatement,
		},
		{
			key: "accountVerification",
			label: "Account Verification",
			value: data?.accountVerification,
		},
	];
	return (
		<Flex
			direction="column"
			bg="white"
			p="30px 20px"
			borderRadius="10"
			border="basic"
			gap="3"
			w="100%"
		>
			<Text fontSize="xl" fontWeight="semibold">
				Success Rate
			</Text>
			<Divider />
			<Stack divider={<Divider />}>
				{successRateList?.map(
					(item) =>
						item.value && (
							<Flex
								justify="space-between"
								fontSize="sm"
								key={item.key}
							>
								<Text whiteSpace="nowrap">{item.label}</Text>
								<Text
									fontWeight="semibold"
									color="secondary.DEFAULT"
								>
									{item.value}%
								</Text>
							</Flex>
						)
				)}
			</Stack>
		</Flex>
	);
};

export default SuccessRate;
