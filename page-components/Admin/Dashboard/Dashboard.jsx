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
	const [pageId, setPageId] = useState(0);
	const { accessToken } = useSession();

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
			body: {
				record_count: 10,
			},
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
				setData(_data);
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
	}, [pageId]);

	const handleHeadingClick = (item) => setPageId(item);

	return (
		<div className={`${className}`} {...props}>
			<Flex
				bg={{ base: "white", md: "none" }}
				mb={{ base: "20px", md: "0px" }}
			>
				<DashboardHeading
					{...{ headingList, pageId, handleHeadingClick }}
				/>
			</Flex>
			{pageId === 0 ? (
				<BusinessDashboard data={data} />
			) : pageId === 1 ? (
				<OnboardingDashboard data={data} />
			) : null}
		</div>
	);
};

export default Dashboard;
