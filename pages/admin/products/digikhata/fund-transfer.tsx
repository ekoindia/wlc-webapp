import { PaddingBox, PageTitle } from "components";
import { DigiKhataPage } from "features/digikhata";

/**
 * Digi Khata Fund Transfer — assisted mode page route.
 */
const DigiKhataFundTransferRoute = (): JSX.Element => {
	return (
		<PaddingBox>
			<PageTitle title="Digi Khata Fund Transfer" isBeta hideBackIcon />
			<DigiKhataPage mode="assisted" />
		</PaddingBox>
	);
};

DigiKhataFundTransferRoute.pageMeta = {
	title: "Digi Khata Fund Transfer",
	isBeta: true,
	isSubPage: false,
};

export default DigiKhataFundTransferRoute;
