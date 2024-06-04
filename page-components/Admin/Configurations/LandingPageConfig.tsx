import { Box } from "@chakra-ui/react";
import { Puck } from "@measured/puck";
import "@measured/puck/puck.css";
import { cmsConfig } from "libs/cms";
import { useEffect, useState } from "react";

// Save the data to your database
const save = (data) => {
	console.log("SAVING LANDING PAGE CONFIG: ", data);
	localStorage.setItem("inf-landing-page-cms", JSON.stringify(data));
};

console.log("cmsConfig: ", cmsConfig);

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
				onPublish={save}
			/>
		</Box>
	);
};

export default LandingPageConfig;
