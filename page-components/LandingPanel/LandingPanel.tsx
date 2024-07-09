import { useFeatureFlag } from "hooks";
import { cmsConfig } from "libs/cms";
import dynamic from "next/dynamic";
import { LoginPanel } from "page-components";
import { useEffect, useState } from "react";

// For CMS custom screen
// TODO: Move to static import, and, enable SSR
const Render = dynamic(
	() => import("@measured/puck").then((pkg) => pkg.Render),
	{
		ssr: false,
	}
);

/**
 * A <LandingPanel> component for the Landing Page (index).
 * It loads the standard Login Panel or the custom CMS page as per the user config.
 * @component
 */
const LandingPanel = () => {
	const [pageReady, setPageReady] = useState(false);
	const [cmsData, setCmsData] = useState(null);
	const [cmsMeta, setCmsMeta] = useState({} as any);
	const [isCmsEnabled] = useFeatureFlag("CMS_LANDING_PAGE");

	// Load landing page custom config (for Puck)
	useEffect(() => {
		if (!isCmsEnabled) {
			setPageReady(true);
			return;
		}

		try {
			const cachedCmsData = JSON.parse(
				localStorage.getItem("inf-landing-page-cms")
			);
			if (cachedCmsData) {
				setCmsData(cachedCmsData);
			}
			const cachedCmsMeta = JSON.parse(
				localStorage.getItem("inf-landing-page-cms-conf")
			);
			if (cachedCmsMeta) {
				setCmsMeta(cachedCmsMeta);
			}
		} catch (e) {
			console.error(e);
		} finally {
			setPageReady(true);
		}
	}, [isCmsEnabled]);

	if (!pageReady) {
		return null;
	}

	console.log("cmsData: ", { cmsData, cmsMeta });

	// MARK: JSX
	if (isCmsEnabled && cmsData && cmsMeta?.type === "page") {
		// Render full page landing page (configured via CMS)
		return <Render config={cmsConfig} data={cmsData} />;
	} else {
		// Render the in-built login panel
		return <LoginPanel />;
	}
};

export default LandingPanel;
