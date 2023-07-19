import { Flex, FormControl, FormLabel } from "@chakra-ui/react";
import { Button, Select } from "components";
import { Endpoints } from "constants";
import { useSession } from "contexts";
import { fetcher } from "helpers";
import { useEffect, useState } from "react";

/**
 * UpgradeSellerToIseller page-component
 * @returns
 */
const UpgradeSellerToIseller = () => {
	const [sellerList, setSellerList] = useState();
	const [selectedSeller, setSelectedSeller] = useState();
	console.log("selectedSeller", selectedSeller);
	const { accessToken } = useSession();

	const renderer = {
		label: "name",
		value: "mobile",
	};

	useEffect(() => {
		fetcher(process.env.NEXT_PUBLIC_API_BASE_URL + Endpoints.TRANSACTION, {
			headers: {
				"tf-req-uri-root-path": "/ekoicici/v1",
				"tf-req-uri": "/network/agent-list?usertype=2",
				// "tf-req-uri": `/network/agent-list?usertype=2&user_id=${agentCode}`,
				"tf-req-method": "GET",
			},
			token: accessToken,
		}).then((res) => {
			const _seller = res?.data?.csp_list ?? [];
			setSellerList(_seller);
		});
	}, []);

	const handleUpgradeButtonClick = () => {
		fetcher(process.env.NEXT_PUBLIC_API_BASE_URL + Endpoints.TRANSACTION, {
			headers: {
				"tf-req-uri-root-path": "/ekoicici/v1",
				"tf-req-uri":
					"/network/agents/profile/changeRole/upgrademerchant",
				"tf-req-method": "PUT",
			},
			body: {
				agent_mobile: selectedSeller,
			},
			token: accessToken,
		}).then((res) => {
			console.log("res", res);
			//TODO show toast
		});
	};

	return (
		<Flex direction="column" gap="8">
			<FormControl w={{ base: "100%", md: "500px" }}>
				<FormLabel>Select Seller</FormLabel>
				<Select
					value={selectedSeller}
					onChange={(event) => setSelectedSeller(event.target.value)}
					options={sellerList}
					renderer={renderer}
				/>
			</FormControl>
			<Flex
				direction={{ base: "column", md: "row" }}
				gap={{ base: "6", md: "12" }}
			>
				<Button onClick={handleUpgradeButtonClick}>Upgrade</Button>
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
	);
};

export default UpgradeSellerToIseller;
