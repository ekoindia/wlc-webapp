import { Box, Divider, Flex, Text } from "@chakra-ui/react";
import { Currency } from "components/Currency";
import { Icon } from "components/Icon";
import { TransactionTypes } from "constants/EpsTransactions";
import { useUser } from "contexts/UserContext";
import { fetcher } from "helpers/apiHelper";
import { WidgetBase } from "page-components/Home";
import { Fragment, useEffect, useState } from "react";

/**
 * A <EarningSummary> component
 * TODO: Write more description here
 * @param 	{object}	prop	Properties passed to the component
 * @param	{string}	prop.prop1	TODO: Property description.
 * @param	{...*}	rest	Rest of the props passed to this component.
 * @example	`<EarningSummary></EarningSummary>` TODO: Fix example
 */
const EarningSummary = ({ prop1, ...rest }) => {
	const { userData } = useUser();
	const [data, setData] = useState({});
	console.log("data", data);

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
			comparision: compare(
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
	];

	useEffect(() => {
		fetcher(process.env.NEXT_PUBLIC_API_BASE_URL + "/transactions/do", {
			body: {
				interaction_type_id: TransactionTypes.GET_EARNING_SUMMARY,
			},
			token: userData.access_token,
		}).then((data) => {
			if (
				data.data &&
				"this_month" in data.data &&
				data.data.this_month >= 0
			) {
				let yesterday = new Date();
				yesterday.setDate(yesterday.getDate() - 1);

				const asofDate = yesterday.toLocaleString("en-IN", {
					day: "numeric",
					month: "short",
				});
				const dayOfWeek = yesterday.toLocaleString("en-IN", {
					weekday: "short",
				});

				const earnings = {
					this_month_till_yesterday: data.data.this_month,
					last_month_till_yesterday: data.data.last_month || 0,
					last_month_total: data.data.prev_month || 0,
					asof: `${asofDate} (${dayOfWeek})`,
					user_code: data.data.user_code,
				};
				setData(earnings);
			}
		});
	}, []);

	return (
		<WidgetBase title="Earning Summary">
			<Box fontSize="14px">
				<Text fontSize="12px" color="secondary.DEFAULT" mt="-16px">
					as of {data.asof}
				</Text>
				{summary.map((item, index) =>
					item.data !== undefined ? (
						<Fragment key={item.label}>
							<Flex justify="space-between" mt="20px">
								<Flex direction="column">
									<Text>{item.label}</Text>
									<Text
										fontSize="18px"
										fontWeight="semibold"
										color="accent.DEFAULT"
									>
										{item.dataType == "amount" ? (
											<Currency amount={item.data} />
										) : null}
									</Text>
								</Flex>
								{item.comparision ? (
									<Flex gap="1">
										<Icon
											name={
												item.comparision > 0
													? "caret-up"
													: item.comparision < 0
													? "caret-down"
													: null
											}
											color={
												item.comparision > 0
													? "success"
													: item.comparision < 0
													? "error"
													: null
											}
											w="16px"
										/>
										<Flex direction="column">
											<Text fontWeight="semibold">
												{Math.round(item.comparision)}%
											</Text>
											<Text fontSize="12px">
												{item.trailLabel}
											</Text>
										</Flex>
									</Flex>
								) : null}
							</Flex>
							{index < summary.length - 1 && (
								<Divider my="20px" />
							)}
						</Fragment>
					) : null
				)}
			</Box>
		</WidgetBase>
	);
};

export default EarningSummary;
