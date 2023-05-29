import { Endpoints } from "constants/EndPoints";
import { useSession } from "contexts/UserContext";
import { fetcher } from "helpers/apiHelper";
import { useEffect, useState } from "react";
import { BusinessDashboard, DashboardHeading, OnboardingDashboard } from ".";

/* heading list for DashboardHeading component */
const headingList = ["Business Dashboard", "Onboarding Dashboard"];

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
	const [heading, setHeading] = useState(0);
	const { accessToken } = useSession();

	const hitQuery = (abortController, key) => {
		console.log(
			`[Dashboard] - ${headingList[heading]} fetch started...`,
			key
		);

		fetcher(process.env.NEXT_PUBLIC_API_BASE_URL + Endpoints.TRANSACTION, {
			headers: {
				"tf-req-uri-root-path": "/ekoicici/v1",
				"tf-req-uri": `/network/agents/${apiUri[heading]}`,
				"tf-req-method": "GET",
			},
			controller: abortController,
			token: accessToken,
		})
			.then((data) => {
				console.log(
					`[Dashboard] - ${headingList[heading]} fetch result...`,
					key,
					data
				);
				const _data =
					heading === 0
						? data?.data?.dashboard_details[0]
						: heading === 1
						? data?.data?.onboarding_dashboard_details[0]
						: [];
				setData(_data);
			})
			.catch((err) => {
				console.error(
					`[Dashboard]  - ${headingList[heading]} error: `,
					err
				);
			});
	};

	useEffect(() => {
		console.log("[Dashboard] fetch init...", heading, headingList[heading]);

		const controller = new AbortController();
		hitQuery(controller, `${heading}-${headingList[heading]}`);

		return () => {
			console.log(
				"[Dashboard] fetch aborted...",
				heading,
				headingList[heading],
				controller
			);
			controller.abort();
		};
	}, [heading]);

	const handleHeadingClick = (item) => setHeading(item);

	return (
		<div className={`${className}`} {...props}>
			<DashboardHeading
				{...{ headingList, heading, handleHeadingClick }}
			/>
			{heading === 0 ? (
				<BusinessDashboard data={data} />
			) : heading === 1 ? (
				<OnboardingDashboard data={data} />
			) : null}
		</div>
	);
};

export default Dashboard;
