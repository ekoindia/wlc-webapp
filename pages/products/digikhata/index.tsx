import { PaddingBox, PageTitle } from "components";
import { DigiKhataPage } from "features/digikhata";
import { useFeatureFlag } from "hooks";

/**
 * DigiKhata Wallet & Fund Transfer page route.
 * Protected by the DIGIKHATA_WALLET feature flag.
 */
const DigiKhataRoute = (): JSX.Element => {
	const [isEnabled] = useFeatureFlag("DIGIKHATA_WALLET");

	if (!isEnabled) return null;

	return (
		<PaddingBox>
			<PageTitle title="My DigiKhata Wallet" isBeta hideBackIcon />
			<DigiKhataPage />
		</PaddingBox>
	);
};

DigiKhataRoute.pageMeta = {
	title: "DigiKhata Wallet",
	isBeta: true,
	isSubPage: false,
};

export default DigiKhataRoute;
