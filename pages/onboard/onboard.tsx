import { PaddingBox } from "components";
// import { OnboardComponent } from "page-components";

const OnboardPage = () => {
	return (
		<PaddingBox>
			<h1>Add Page Content Here</h1>
			{/* <OnboardComponent /> */}
		</PaddingBox>
	);
};

// If the "subPage" property is set, then this page will hide the top app header in mobile view.
// Pages can show their own header bar with back button.
OnboardPage.pageMeta = {
	title: "Onboard",
	isSubPage: false,
};

// Use a diferent layout, if needed...
// First, import the alternate layout: import { LayoutLogin } from "layout-components";
// Onboard.getLayout = LayoutLogin;

export default OnboardPage;
