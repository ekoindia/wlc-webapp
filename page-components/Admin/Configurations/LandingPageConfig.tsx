import { Box } from "@chakra-ui/react";
import { Puck } from "@measured/puck";
import "@measured/puck/puck.css";
import { cmsConfig } from "libs/cms";
import { useEffect, useState } from "react";
import { FiMonitor, FiSmartphone } from "react-icons/fi";

// Save the data to your database
const save = (data) => {
	console.log("SAVING LANDING PAGE CONFIG: ", data);
	localStorage.setItem("inf-landing-page-cms", JSON.stringify(data));
};

const LandingPageConfig = () => {
	const [initialData, setInitialData] = useState(null);

	// Load the initial configuration data...
	useEffect(() => {
		try {
			const data = JSON.parse(
				localStorage.getItem("inf-landing-page-cms")
			);
			setInitialData(data || {});
		} catch (error) {
			console.error("Error loading landing page CMS config: ", error);
			setInitialData({});
		}
	}, []);

	if (initialData === null) return <p>Loading...</p>;

	return (
		<Box
			sx={{
				".Puck > div": {
					position: "relative",
					borderRadius: "6px",
					overflow: "hidden",
				},
			}}
		>
			<Puck
				config={cmsConfig}
				data={initialData || {}}
				viewports={[
					{
						width: 360,
						height: "auto", // Optional height. Can be numeric or "auto". Defaults to "auto".
						label: "Mobile", // Optional. Shown in tooltip.
						icon: <FiSmartphone />,
					},
					{
						width: 1100,
						height: "auto",
						label: "Desktop",
						icon: <FiMonitor />,
					},
				]}
				onPublish={save}
			/>
		</Box>
	);
};

export default LandingPageConfig;
