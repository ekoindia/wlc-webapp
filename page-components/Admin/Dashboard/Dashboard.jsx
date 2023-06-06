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

	const [dateRange, setDateRange] = useState(7); // date range for business dashboard
	const [prevDate, setPrevDate] = useState("");
	const [currDate, setCurrDate] = useState("");

	const [filterStatus, setFilterStatus] = useState([]); //filters for onboarding dashboard
	const [pageNumber, setPageNumber] = useState(1); //page number for onboarding table
	const [totalRecords, setTotalRecords] = useState();
	const { accessToken } = useSession();

	useEffect(() => {
		let currentDate = new Date();
		let previousDate = new Date(
			currentDate.getTime() - dateRange * 24 * 60 * 60 * 1000
		);
		setCurrDate(currentDate.toISOString());
		setPrevDate(previousDate.toISOString());
	}, [dateRange]);

	const onboardingBody = {
		record_count: 10,
		filterStage: filterStatus,
		page_number: pageNumber,
	};

	const businessBody = {
		dateFrom: prevDate.slice(0, 10),
		dateTo: currDate.slice(0, 10),
		dateRange: dateRange,
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
			body:
				pageId === 0
					? businessBody
					: pageId === 1
					? onboardingBody
					: {},
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
	}, [pageId, filterStatus, pageNumber, currDate, prevDate]);

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
				<BusinessDashboard
					{...{
						data,
						currDate,
						setCurrDate,
						prevDate,
						setPrevDate,
						dateRange,
						setDateRange,
					}}
				/>
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
