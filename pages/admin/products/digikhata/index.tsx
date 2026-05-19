import { PaddingBox, PageTitle } from "components";
import { DigiKhataPage } from "features/digikhata";

/**
 * DigiKhata Wallet & Fund Transfer page route.
 */
const DigiKhataRoute = (): JSX.Element => {
	return (
		<PaddingBox>
			<PageTitle title="My Digi Khata Wallet" isBeta hideBackIcon />
			<DigiKhataPage mode="self" />
		</PaddingBox>
	);
};

DigiKhataRoute.pageMeta = {
	title: "My Digi Khata Wallet",
	isBeta: true,
	isSubPage: false,
};

export default DigiKhataRoute;
