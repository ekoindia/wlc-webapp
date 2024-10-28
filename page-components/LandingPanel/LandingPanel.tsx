import { useFeatureFlag } from "hooks";
import { cmsConfig } from "libs/cms";
import { useOrgDetailContext } from "contexts";
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
	const { orgDetail } = useOrgDetailContext();
	const [pageReady, setPageReady] = useState(false);
	const [cmsData, setCmsData] = useState(null);
	const [cmsMeta, setCmsMeta] = useState({} as any);
	const [isCmsEnabled] = useFeatureFlag("CMS_LANDING_PAGE");
	const [isImageThemeEnabled] = useFeatureFlag("CMS_IMAGE_THEME");

	/*
		org_details: {
			metadata: {
				cms_meta: {
					type: "default" | "card" | "page" | "image",
				},
				cms_data: {
					// For "image" type
					img: "https://example.com/image.jpg",
					img_small: "https://example.com/image-small.jpg",
					features: [
						"This is feature 1",
						"This is feature 2",
					],
				},
			}
		}
	*/

	// Load landing page custom config (for Puck)
	useEffect(() => {
		if (!(isCmsEnabled || isImageThemeEnabled)) {
			setPageReady(true);
			return;
		}

		if (orgDetail?.metadata?.cms_meta) {
			setCmsMeta(orgDetail.metadata.cms_meta);

			if (
				orgDetail?.metadata?.cms_data &&
				Object.keys(orgDetail.metadata.cms_data).length > 0
			) {
				setCmsData(orgDetail.metadata.cms_data);
			} else {
				// TODO: ONLY FOR TESTING...REMOVE THIS
				try {
					const cachedCmsData = JSON.parse(
						localStorage.getItem("inf-landing-page-cms")
					);
					if (cachedCmsData) {
						setCmsData(cachedCmsData);
					}
					// const cachedCmsMeta = JSON.parse(
					// 	localStorage.getItem("inf-landing-page-cms-conf")
					// );
					// if (cachedCmsMeta) {
					// 	setCmsMeta(cachedCmsMeta);
					// }
				} catch (e) {
					console.error(e);
				} finally {
					setPageReady(true);
				}
			}

			setPageReady(true);
			return;
		}
	}, [
		isCmsEnabled,
		isImageThemeEnabled,
		orgDetail?.metadata?.cms_meta,
		orgDetail?.metadata?.cms_data,
	]);

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
		return <LoginPanel cmsType={cmsMeta?.type} cmsData={cmsData} />;
	}
};

export default LandingPanel;
