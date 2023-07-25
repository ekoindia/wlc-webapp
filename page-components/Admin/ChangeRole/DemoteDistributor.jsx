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
 * DemoteDistributor page-component
 * @returns
 */
const DemoteDistributor = ({ agentData }) => {
	const {
		handleSubmit,
		// formState: { errors /* isSubmitting */ },
		control,
		reset,
	} = useForm();

	// TODO 👇
	// const _selectedSeller =
	// 	agentData?.agent_type == "Distributor"
	// 		? { label: agentData?.agent_name, value: agentData.agent_mobile }
	// 		: { label: "", value: "" };
	const [sellerList, setSellerList] = useState();
	const { accessToken } = useSession();
	const [disabled, setDisabled] = useState(false);

	useEffect(() => {
		fetcher(process.env.NEXT_PUBLIC_API_BASE_URL + Endpoints.TRANSACTION, {
			headers: {
				"tf-req-uri-root-path": "/ekoicici/v1",
				"tf-req-uri": "/network/agent-list?usertype=1",
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
				agent_mobile: mobile,
			},
			token: accessToken,
		}).then((res) => {
			console.log("res", res);
			//TODO show toast
		});
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<Flex direction="column" gap="8">
				<FormControl w={{ base: "100%", md: "500px" }}>
					<FormLabel>Select Distributor</FormLabel>
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
						color="accent.DEFAULT"
						_hover={{ textDecoration: "none" }}
					>
						Cancel
					</Button>
				</Flex>
			</Flex>
		</form>
	);
};

export default DemoteDistributor;
