// pages/commissions/[id].js
import { PaddingBox } from "components";
import { useRouter } from "next/router";
import { Commissions } from "page-components";

const CommissionsPage = () => {
	const router = useRouter();
	const { id } = router.query;

	return (
		<PaddingBox>
			<Commissions prod_id={id} />
		</PaddingBox>
	);
};

// if subPage property is set, then this page will hide the top app header in mobile view.
// Pages can show their own header bar with back button.
CommissionsPage.pageMeta = {
	title: "Know Your Commissions",
	isSubPage: true,
};

export default CommissionsPage;
