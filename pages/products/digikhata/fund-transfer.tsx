import { PaddingBox, PageTitle } from "components";
import { DigiKhataPage } from "features/digikhata";
import { useFeatureFlag } from "hooks";

/**
 * DigiKhata Fund Transfer — assisted mode page route.
 * Protected by the DIGIKHATA_WALLET feature flag.
 */
const DigiKhataFundTransferRoute = (): JSX.Element => {
	const [isEnabled] = useFeatureFlag("DIGIKHATA_WALLET");

	if (!isEnabled) return null;

	return (
		<PaddingBox>
			<PageTitle title="DigiKhata Fund Transfer" isBeta hideBackIcon />
			<DigiKhataPage mode="assisted" />
		</PaddingBox>
	);
};

DigiKhataFundTransferRoute.pageMeta = {
	title: "DigiKhata Fund Transfer",
	isBeta: true,
	isSubPage: false,
};

export default DigiKhataFundTransferRoute;
