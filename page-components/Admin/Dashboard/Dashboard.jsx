import { Flex } from "@chakra-ui/react";
import { Endpoints } from "constants/EndPoints";
import { useSession } from "contexts/UserContext";
import { fetcher } from "helpers/apiHelper";
import { useEffect, useState } from "react";
import { BusinessDashboard, DashboardHeading, OnboardingDashboard } from ".";

/* pageId list for DashboardHeading component */
const headingList = ["Business", "Onboarding"];

/* api uri */
const apiUri = ["businessdashboard", "onboardingDashboard"];

/**
 * A Dashboard page component
 * TODO: Write more description here
 * @arg 	{Object}	prop	Properties passed to the component
 * @param	{string}	[prop.className]	Optional classes to pass to this component.
 * @example	`<Dashboard></Dashboard>`
 */
const Dashboard = ({ className = "", ...props }) => {
	const [data, setData] = useState([]);
	const [pageId, setPageId] = useState(0); //to find whether user is on business or onboarding dashboard
	const [filterStatus, setFilterStatus] = useState([51]); //filters for onboarding dashboard with default value 51
	const [pageNumber, setPageNumber] = useState(1); //page number for onboarding table
	const [totalRecords, setTotalRecords] = useState();
	const { accessToken } = useSession();

	const onboardingBody = {
		record_count: 10,
		filterStage: filterStatus,
		page_number: pageNumber,
	};

	const hitQuery = (abortController, key) => {
		console.log(
			`[Dashboard] - ${headingList[pageId]} fetch started...`,
			key
		);

		fetcher(process.env.NEXT_PUBLIC_API_BASE_URL + Endpoints.TRANSACTION, {
			headers: {
				"tf-req-uri-root-path": "/ekoicici/v1",
				"tf-req-uri": `/network/agents/${apiUri[pageId]}`,
				"tf-req-method": "GET",
			},
			body: pageId === 1 ? { ...onboardingBody } : {},
			controller: abortController,
			token: accessToken,
		})
			.then((data) => {
				console.log(
					`[Dashboard] - ${headingList[pageId]} fetch result...`,
					key,
					data
				);
				const _data =
					pageId === 0
						? data?.data?.dashboard_details[0]
						: pageId === 1
						? data?.data?.onboarding_dashboard_details
						: [];
				const _totalRecords =
					pageId === 1 ? data?.data?.totalRecords : null;
				setData(_data);
				setTotalRecords(_totalRecords);
			})
			.catch((err) => {
				console.error(
					`[Dashboard]  - ${headingList[pageId]} error: `,
					err
				);
			});
	};

	useEffect(() => {
		console.log("[Dashboard] fetch init...", pageId, headingList[pageId]);

		const controller = new AbortController();
		hitQuery(controller, `${pageId}-${headingList[pageId]}`);

		return () => {
			console.log(
				"[Dashboard] fetch aborted...",
				pageId,
				headingList[pageId],
				controller
			);
			controller.abort();
		};
	}, [pageId, filterStatus, pageNumber]);

	const handleHeadingClick = (item) => setPageId(item);

	return (
		<div className={`${className}`} {...props}>
			<Flex
				bg={{ base: "white", md: "none" }}
				pb={{ base: pageId === 0 ? "0px" : "10px", md: "0px" }}
				borderRadius={pageId === 0 ? "0px" : "0px 0px 20px 20px"}
			>
				<DashboardHeading
					{...{ headingList, pageId, handleHeadingClick }}
				/>
			</Flex>
			{pageId === 0 ? (
				<BusinessDashboard {...{ data }} />
			) : pageId === 1 ? (
				<OnboardingDashboard
					{...{
						data,
						setFilterStatus,
						filterStatus,
						totalRecords,
						pageNumber,
						setPageNumber,
					}}
				/>
			) : null}
		</div>
	);
};

export default Dashboard;
