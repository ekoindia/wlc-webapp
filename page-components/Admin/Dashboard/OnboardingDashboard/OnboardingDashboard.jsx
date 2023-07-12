import { Flex } from "@chakra-ui/react";
import { Endpoints } from "constants/EndPoints";
import { useSession } from "contexts";
import { fetcher } from "helpers";
import { useEffect, useMemo, useState } from "react";
import { OnboardedMerchants, OnboardingDashboardFilters } from ".";
/**
 * A OnboardingDashboard page-component
 * TODO: Write more description here
 * @arg 	{Object}	prop	Properties passed to the component
 * @param	{string}	[prop.className]	Optional classes to pass to this component.
 * @example	`<OnboardingDashboard></OnboardingDashboard>`
 */
const OnboardingDashboard = () => {
	const [data, setData] = useState();
	const [isLoading, setIsLoading] = useState(true);
	const [filterLoading, setFilterLoading] = useState(true); //to handle filter skeleton
	const [filterStatus, setFilterStatus] = useState([]);
	const [pageNumber, setPageNumber] = useState(1);
	const [totalRecords, setTotalRecords] = useState();
	const { accessToken } = useSession();

	useEffect(() => {
		// console.log("[OnboardingDashboard] fetch init...");
		const controller = new AbortController();

		fetcher(process.env.NEXT_PUBLIC_API_BASE_URL + Endpoints.TRANSACTION, {
			headers: {
				"tf-req-uri-root-path": "/ekoicici/v1",
				"tf-req-uri": "/network/agents/onboardingDashboard",
				"tf-req-method": "GET",
			},
			body: {
				record_count: 10,
				filterStage: `${filterStatus}`,
				page_number: pageNumber,
			},
			controller: controller,
			token: accessToken,
		})
			.then((data) => {
				// console.log("[OnboardingDashboard] - fetch result...", data);
				const _data = data?.data?.onboarding_dashboard_details || [];
				const _totalRecords = data?.data?.totalRecords;
				setData(_data);
				setTotalRecords(_totalRecords);
				setIsLoading(false);
				if (filterLoading) setFilterLoading(false);
			})
			.catch((err) => {
				console.error(`[OnboardingDashboard] error: `, err);
			});

		return () => {
			// console.log("[OnboardingDashboard] fetch aborted...", controller);
			setIsLoading(true);
			controller.abort();
		};
	}, [filterStatus, pageNumber]);

	console.log("[OnboardingDashboard] data", data);
	let _filterData = data?.[0]?.topPanel ?? {};

	const filterData = useMemo(() => {
		return _filterData;
	}, [
		_filterData.partialAccount,
		_filterData.businessDetailsCaptured,
		_filterData.aadhaarCaptured,
		_filterData.panCaptured,
		_filterData.agreementSigned,
		_filterData.onboarded,
		_filterData.nonTransactiingLive,
	]);
	const onboardingMerchantData = data?.[1]?.onboardedMerchants || [];

	return (
		<Flex direction="column">
			<Flex px={{ base: "0px", md: "20px" }}>
				<OnboardingDashboardFilters
					{...{
						filterLoading,
						filterData,
						filterStatus,
						setFilterStatus,
					}}
				/>
			</Flex>
			<Flex p="20px">
				<OnboardedMerchants
					{...{
						onboardingMerchantData,
						totalRecords,
						pageNumber,
						setPageNumber,
						isLoading,
					}}
				/>
			</Flex>
		</Flex>
	);
};

export default OnboardingDashboard;
