import { Flex, FormControl, FormLabel } from "@chakra-ui/react";
import { Button, Select } from "components";
import { Endpoints } from "constants";
import { useSession } from "contexts";
import { fetcher } from "helpers";
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
const PromoteSellerToDistributor = ({ agentData, setResDetails }) => {
	const [sellerList, setSellerList] = useState();
	const { accessToken } = useSession();
	const [disabled, setDisabled] = useState(false);

	const {
		handleSubmit,
		// formState: { errors /* isSubmitting */ },
		control,
		reset,
	} = useForm();

	useEffect(() => {
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
	}, []);

	useEffect(() => {
		if (agentData !== undefined) {
			let defaultValues = {};
			defaultValues.mobile = agentData?.agent_mobile;
			reset({ ...defaultValues });
			setDisabled(true);
		}
	}, [agentData]);

	const onSubmit = (data) => {
		const { mobile } = data;
		fetcher(process.env.NEXT_PUBLIC_API_BASE_URL + Endpoints.TRANSACTION, {
			headers: {
				"tf-req-uri-root-path": "/ekoicici/v1",
				"tf-req-uri": "/network/agents/profile/changeRole/promotecsps",
				"tf-req-method": "PUT",
			},
			body: {
				operation_type: 1,
				agent_mobile: mobile,
			},
			token: accessToken,
		}).then((res) => {
			console.log("res", res);
			setResDetails({ status: res.status, message: res.message });
		});
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<Flex direction="column" gap="8">
				<FormControl w={{ base: "100%", md: "500px" }}>
					<FormLabel>Select Retailer</FormLabel>

					<Controller
						name="mobile"
						control={control}
						render={({ field: { onChange, value } }) => {
							return (
								<Select
									options={sellerList}
									renderer={renderer}
									onChange={onChange}
									value={value}
									disabled={disabled}
								/>
							);
						}}
					/>
				</FormControl>
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
					>
						Cancel
					</Button>
				</Flex>
			</Flex>
		</form>
	);
};

export default PromoteSellerToDistributor;
