import { Box, Divider, Flex, Text } from "@chakra-ui/react";
import { Currency, Icon } from "components";
import { useEarningSummary, useWallet } from "contexts";
import { WidgetBase } from "page-components/Home";
import { Fragment } from "react";

/**
 * An <EarningSummary> widget
 * @param 	{object}	prop	Properties passed to the component
 * @param	{...*}	rest	Rest of the props passed to this component.
 * @example	`<EarningSummary></EarningSummary>` TODO: Fix example
 */
const EarningSummary = ({ ...rest }) => {
	const data = useEarningSummary();
	const { isWalletVisible } = useWallet();
	// console.log("DataAtEarn", data);

	if (!data) {
		return null;
	}

	if (!isWalletVisible) {
		return null;
	}

	/**
	 * Return the percentage change between current and last value
	 * @param {number} currentValue
	 * @param {number} lastValue
	 * @returns {number} Percentage change
	 */
	const compare = (currentValue, lastValue) => {
		if (lastValue !== 0) {
			return ((currentValue - lastValue) / lastValue) * 100;
		}
		return 0;
	};

	const summary = [
		{
			label: "This month till yesterday",
			data: data.this_month_till_yesterday,
			dataType: "amount",
			comparison: compare(
				data.this_month_till_yesterday,
				data.last_month_till_yesterday
			),
			trailLabel: "from last month",
		},
		{
			label: "Last month's earning",
			data: data.last_month_total,
			dataType: "amount",
		},
		{
			label: "Commission Due",
			data: data.commission_due,
			dataType: "amount",
		},
	];

	return (
		<WidgetBase title="Earning Summary" {...rest}>
			<Box fontSize="sm">
				<Text
					fontSize="xs"
					color="primary.DEFAULT"
					mt="-16px"
					// mb="32px"
				>
					as of {data.asof}
				</Text>
				{summary.map((item, index) =>
					item.data !== undefined ? (
						<Fragment key={item.label}>
							{index > 0 && <Divider my="14px" />}
							<Flex justify="space-between" mt="14px">
								<Flex direction="column">
									<Text>{item.label}</Text>
									<Text
										fontSize="md"
										fontWeight="semibold"
										color="primary.DEFAULT"
									>
										{item.dataType == "amount" ? (
											<Currency amount={item.data} />
										) : null}
									</Text>
								</Flex>
								{item.comparison ? (
									<Flex gap="1">
										<Icon
											name={
												item.comparison > 0
													? "caret-up"
													: item.comparison < 0
														? "caret-down"
														: null
											}
											color={
												item.comparison > 0
													? "success"
													: item.comparison < 0
														? "error"
														: null
											}
											size="16px"
										/>
										<Flex direction="column">
											<Text fontWeight="semibold">
												{Math.round(item.comparison)}%
											</Text>
											<Text fontSize="12px">
												{item.trailLabel}
											</Text>
										</Flex>
									</Flex>
								) : null}
							</Flex>
						</Fragment>
					) : null
				)}
			</Box>
		</WidgetBase>
	);
};

export default EarningSummary;
