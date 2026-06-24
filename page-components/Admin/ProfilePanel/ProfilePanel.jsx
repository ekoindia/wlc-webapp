import {
	Flex,
	Grid,
	Spinner,
	Text,
	useBreakpointValue,
} from "@chakra-ui/react";
import { Button, Icon, PageTitle } from "components";
import { Endpoints } from "constants";
import { usePubSub, useSession } from "contexts"; // MARK: useSession is used for accessToken and user info
import { fetcher } from "helpers";
import { useRouter } from "next/router";
import { useAgentDetails } from "page-components/Admin/Network/hooks";
import { NetworkMenu } from "page-components/Admin/Network/NetworkMenu/NetworkMenu";
import { lazy, Suspense, useEffect, useState } from "react";

// Utility: Check if all values in an object are null/blank/empty
const areAllFieldsEmpty = (obj, fields) => {
	if (!obj) return true;
	return fields.every((key) => {
		const val = obj[key];
		if (key === "ownership_type") {
			return (
				val === undefined ||
				val === null ||
				(typeof val === "string" &&
					(val.trim() === "" || val.trim().toLowerCase() === "na"))
			);
		}
		return (
			val === undefined ||
			val === null ||
			(typeof val === "string" && val.trim() === "")
		);
	});
};

// Lazy load pane components for better initial bundle size
const AddressPane = lazy(() =>
	import(".").then((module) => ({ default: module.AddressPane }))
);
const CompanyPane = lazy(() =>
	import(".").then((module) => ({ default: module.CompanyPane }))
);
const ContactPane = lazy(() =>
	import(".").then((module) => ({ default: module.ContactPane }))
);
const DocPane = lazy(() =>
	import(".").then((module) => ({ default: module.DocPane }))
);
const PersonalPane = lazy(() =>
	import(".").then((module) => ({ default: module.PersonalPane }))
);

// BankPane is a bit more complex due to the update functionality, so we will handle it separately with its own loading state
const BankPane = lazy(() =>
	import(".").then((module) => ({ default: module.BankPane }))
);

/**
 * Loading fallback component for lazy-loaded panes
 * @returns {JSX.Element} Loading spinner
 */
const PaneLoadingFallback = () => (
	<Flex justify="center" align="center" p="8">
		<Spinner size="sm" color="primary.DEFAULT" />
	</Flex>
);

/**
 * Display user/agent profile panel (page) with multiple data panes.
 * This is intended for Admins or any sub-network owner such as distributor to view the profile of their sub-network users/agents.
 * MARK: ProfilePanel
 * @returns {JSX.Element} - The ProfilePanel component
 */
const ProfilePanel = () => {
	const menuVariant =
		useBreakpointValue({ base: "link", md: "accent" }) || "link";
	const router = useRouter();
	const [agentDocuments, setAgentDocuments] = useState({});

	const { accessToken } = useSession();
	const { mobile } = router.query;
	const { subscribe, TOPICS } = usePubSub(); // MARK: usePubSub for subscribing to bank update events

	// Use the agent details hook with session caching
	const {
		agent: agentData,
		loading: fetchingData,
		error: agentError,
		refetch: refetchAgentData,
	} = useAgentDetails(mobile);

	// console.log("[ProfilePanel] agentData:", agentData);

	/**
	 * Helper function to fetch agent documents from server
	 */
	const fetchAgentDocuments = () => {
		fetcher(process.env.NEXT_PUBLIC_API_BASE_URL + Endpoints.TRANSACTION, {
			headers: {
				"tf-req-uri-root-path": "/ekoicici/v1",
				"tf-req-uri": `/network/agents?record_count=1&search_value=${mobile}&document=1`,
				"tf-req-method": "GET",
			},
			token: accessToken,
		})
			.then((data) => {
				setAgentDocuments(data?.data?.cspDetails);
			})
			.catch((error) => {
				// Handle any errors that occurred during the fetch
				console.error("[ProfilePanel] Get Agent Detail Error:", error);
			});
	};

	/**
	 * Fetch agent documents when mobile changes or when agentDocuments is empty
	 * MARK: Fetch Data
	 */
	useEffect(() => {
		if (
			mobile &&
			agentDocuments &&
			Object.keys(agentDocuments).length === 0
		) {
			fetchAgentDocuments();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [mobile]);

	// PersonalPane: fields to check
	const personalFields = [
		"date_of_birth",
		"gender",
		"marital_status",
		"shop_name",
		"shop_type",
	];
	// AddressPane: fields to check
	const addressFields = [
		"address",
		"ownership_type",
		"lattitude",
		"longitude",
	];

	const personalData = {
		...agentData?.profile,
		...agentData?.personal_information,
	};
	const addressData = {
		...agentData?.address_details,
		address: [
			agentData?.line_1,
			agentData?.line_2,
			agentData?.location,
			agentData?.status,
			agentData?.zip,
		]
			.filter((value) => value)
			.join(", "),
	};

	const panes = [];
	// CompanyPane always shown
	panes.push({
		id: 1,
		comp: (
			<CompanyPane
				data={{
					...agentData?.profile,
					agent_name: agentData?.agent_name,
					agent_type: agentData?.agent_type,
					user_id: agentData?.user_id,
					user_type_id: agentData?.user_type_id,
					account_status: agentData?.account_status,
					demo_account_expiry_date:
						agentData?.demo_account_expiry_date,
					docs: agentDocuments,
				}}
			/>
		),
	});
	// AddressPane: only if any field present
	if (!areAllFieldsEmpty(addressData, addressFields)) {
		panes.push({
			id: 2,
			comp: <AddressPane data={addressData} />,
		});
	}
	// DocPane
	panes.push({ id: 3, comp: <DocPane documentData={agentDocuments} /> });
	// PersonalPane: only if any field present
	if (!areAllFieldsEmpty(personalData, personalFields)) {
		panes.push({
			id: 4,
			comp: <PersonalPane data={personalData} />,
		});
	}
	// ContactPane
	panes.push({
		id: 6,
		comp: (
			<ContactPane
				data={{
					...agentData?.contact_information,
					agent_mobile: agentData?.agent_mobile,
				}}
			/>
		),
	});

	// The API returns bank info as an array under profile.bank_details.
	// Usually one entry — take the first.
	const firstBank = agentData?.profile?.bank_details?.[0];

	const bankData = {
		bank_name:
			agentData?.bank_name ||
			agentData?.profile?.bank_name ||
			firstBank?.bank_name || // not in current API, but harmless
			undefined,
		account:
			firstBank?.account_number || // ← the real API field
			agentData?.account ||
			agentData?.bank_account ||
			agentDocuments?.bank_account ||
			undefined,
		ifsc:
			firstBank?.ifsc || // ← the real API field
			agentData?.ifsc ||
			agentDocuments?.ifsc ||
			undefined,
	};

	if (+agentData?.account_status_id === 16) {
		// 16 = ACTIVE
		panes.push({
			id: 1.5,
			comp: (
				<BankPane
					data={bankData}
					eko_code={
						(Array.isArray(agentData?.profile?.eko_code)
							? agentData?.profile?.eko_code[0]
							: agentData?.profile?.eko_code) ?? agentData?.eko_code
					}
					mobile={mobile}
					onUpdate={refetchAgentData}
				/>
			),
		});
	}
	console.log("Agent data fields:", {
		eko_code: agentData?.eko_code,
		profile_eko_code: agentData?.profile?.eko_code,
		user_id: agentData?.user_id,
		user_type_id: agentData?.user_type_id,
		agent_mobile: agentData?.agent_mobile,
	});

	// MARK: JSX

	// Subscribe to bank-request updates so we refresh agent data when approvals happen elsewhere
	useEffect(() => {
		const unsubscribe = subscribe?.(
			TOPICS.PENDING_BANK_REQUEST_UPDATED,
			() => {
				refetchAgentData?.();
			}
		);
		return () => {
			if (typeof unsubscribe === "function") unsubscribe();
		};
	}, [refetchAgentData, subscribe, TOPICS]);
	return (
		<>
			<PageTitle
				title="Details"
				toolComponent={
					<Flex gap="2" align="center">
						{agentData ? (
							<NetworkMenu
								label="Options"
								variant={menuVariant}
								mobile_number={mobile}
								eko_code={
									agentData?.profile?.eko_code?.[0] ??
									agentData?.profile?.eko_code ??
									agentData?.eko_code
								}
								account_status_id={agentData?.account_status_id}
								user_type_id={agentData?.user_type_id}
								onStatusUpdate={refetchAgentData}
							/>
						) : null}
					</Flex>
				}
			/>

			{fetchingData ? (
				<Flex
					direction="column"
					align="center"
					justify="center"
					gap="4"
					mt="20"
					minH="400px"
				>
					<Spinner
						size="xl"
						color="primary.DEFAULT"
						thickness="4px"
					/>
					<Text color="light" fontSize="md">
						Fetching Details...
					</Text>
				</Flex>
			) : agentError ? (
				<Flex
					direction="column"
					align="center"
					justify="center"
					gap="4"
					mt="20"
					minH="400px"
				>
					<Icon name="error" size="xl" color="light" />
					<Text color="dark" fontSize="lg" fontWeight="semibold">
						Agent Not Found
					</Text>
					<Text color="light" fontSize="sm">
						The requested agent could not be found.
					</Text>
					<Button size="sm" onClick={() => router.back()}>
						Go Back
					</Button>
				</Flex>
			) : agentData ? (
				<Suspense fallback={<PaneLoadingFallback />}>
					<Grid
						templateColumns={{
							base: "repeat(auto-fit,minmax(300px,0.90fr))",
							// sm: "repeat(auto-fit,minmax(380px,0.90fr))",
							md: "repeat(auto-fit,minmax(360px,1fr))",
							"2xl": "repeat(auto-fit,minmax(450px,1fr))",
						}}
						justifyContent="center"
						py={{ base: "4", md: "0px" }}
						gap={{ base: (2, 4), md: (4, 2), lg: (4, 6) }}
					>
						{panes.map(({ id, comp }) => {
							const GridComponent = () => comp;
							return <GridComponent key={id} />;
						})}
					</Grid>
				</Suspense>
			) : null}
		</>
	);
};

export default ProfilePanel;
