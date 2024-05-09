import { PaddingBox } from "components";
import { RaiseIssueCard } from "page-components";

const IssuePage = () => {
	return (
		<PaddingBox>
			<RaiseIssueCard heading="Raise Query" origin="Global-Help" />
		</PaddingBox>
	);
};

// If the "subPage" property is set, then this page will hide the top app header in mobile view.
// Pages can show their own header bar with back button.
IssuePage.pageMeta = {
	title: "Raise Query",
	isSubPage: false,
};

// Use a diferent layout, if needed...
// Issue.getLayout = (page) => <LayoutLogin>{page}</LayoutLogin>;

export default IssuePage;
