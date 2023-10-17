import { Flex, FormControl, Text } from "@chakra-ui/react";
import { Button, Icon, Select } from "components";
import { Endpoints } from "constants";
import { useSession } from "contexts";
import { fetcher } from "helpers";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

const renderer = {
	label: "name",
	value: "mobile",
};

/**
 * PromoteSellerToDistributor page-component
 * @returns
 */
const PromoteSellerToDistributor = ({ agentData, setResponseDetails }) => {
	const [sellerList, setSellerList] = useState();
	const { accessToken } = useSession();
	// const [disabled, setDisabled] = useState(false);

	const router = useRouter();

	const default_agent_mobile = agentData?.agent_mobile;

	const {
		handleSubmit,
		// formState: { errors /* isSubmitting */ },
		control,
		// reset,
	} = useForm();

	useEffect(() => {
		if (default_agent_mobile) {
			return;
		}

		fetcher(process.env.NEXT_PUBLIC_API_BASE_URL + Endpoints.TRANSACTION, {
			headers: {
				"tf-req-uri-root-path": "/ekoicici/v1",
				"tf-req-uri": "/network/agent-list?usertype=2",
				"tf-req-method": "GET",
			},
			token: accessToken,
		}).then((res) => {
			const _seller = res?.data?.csp_list ?? [];
			setSellerList(_seller);
		});
	}, [default_agent_mobile]);

	// useEffect(() => {
	// 	if (agentData !== undefined) {
	// 		let defaultValues = {};
	// 		defaultValues.mobile = agentData?.agent_mobile;
	// 		reset({ ...defaultValues });
	// 		setDisabled(true);
	// 	}
	// }, [agentData]);

	// Handled API according to updated Select component
	const onSubmit = (data) => {
		const { retailer } = data;
		fetcher(process.env.NEXT_PUBLIC_API_BASE_URL + Endpoints.TRANSACTION, {
			headers: {
				"tf-req-uri-root-path": "/ekoicici/v1",
				"tf-req-uri": "/network/agents/profile/changeRole/promotecsps",
				"tf-req-method": "PUT",
			},
			body: {
				operation_type: 1,
				agent_mobile: default_agent_mobile ?? retailer[renderer.value],
			},
			token: accessToken,
		}).then((res) => {
			setResponseDetails({ status: res.status, message: res.message });
		});
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<Flex direction="column" gap="8">
				{default_agent_mobile ? null : (
					<FormControl w={{ base: "100%", md: "500px" }}>
						<Controller
							name="retailer"
							control={control}
							render={({ field: { onChange, value } }) => {
								return (
									<Select
										label="Select Retailer"
										options={sellerList}
										renderer={renderer}
										onChange={onChange}
										value={value}
										required={true}
										getOptionLabel={(option) => {
											return (
												<Flex
													as="span"
													align="center"
													gap="2"
												>
													<Text noOfLines="1">
														{option.name}
													</Text>
													<Flex
														color="light"
														fontSize="xs"
														align="center"
														gap="1"
													>
														<Icon
															name="phone"
															size="xs"
														/>
														{option.mobile}
													</Flex>
												</Flex>
											);
										}}
										// disabled={disabled}
									/>
								);
							}}
						/>
					</FormControl>
				)}
				<Flex
					direction={{ base: "column", md: "row" }}
					gap={{ base: "6", md: "12" }}
				>
					<Button
						size="lg"
						h="54px"
						w={{ base: "100%", md: "164px" }}
						fontWeight="bold"
						type="submit"
					>
						Promote
					</Button>
					<Button
						bg="none"
						variant="link"
						fontWeight="bold"
						color="primary.DEFAULT"
						_hover={{ textDecoration: "none" }}
						onClick={() => router.back()}
					>
						Cancel
					</Button>
				</Flex>
			</Flex>
		</form>
	);
};

export default PromoteSellerToDistributor;
