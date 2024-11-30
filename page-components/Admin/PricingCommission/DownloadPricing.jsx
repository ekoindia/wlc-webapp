import { Button } from "components";
import { useSession } from "contexts";
import { Endpoints, TransactionTypes } from "constants";
import { fetcher } from "helpers";
import { saveDataToFile } from "utils";

/**
 * A button component that downloads the current pricing data.
 */
export const DownloadPricing = () => {
	const { accessToken } = useSession();
	const handleClick = () => {
		fetcher(process.env.NEXT_PUBLIC_API_BASE_URL + Endpoints.TRANSACTION, {
			headers: {
				"tf-is-file-download": "1",
			},
			body: {
				interaction_type_id: TransactionTypes.DOWNLOAD_EXISTING_PRICING,
			},
			token: accessToken,
		})
			.then((data) => {
				const _blob = data?.file?.blob;
				const _filename = data?.file?.name || "file";
				const _type = data?.file["content-type"];
				const _b64 = true;
				saveDataToFile(_blob, _filename, _type, _b64);
			})
			.catch((err) => {
				console.error("Error: ", err);
			});
	};
	return (
		<Button
			size={{ base: "sm", md: "md" }}
			icon="file-download"
			iconStyle={{ size: { base: "xs", md: "sm" } }}
			iconSpacing="2"
			onClick={handleClick}
		>
			Existing Pricing
		</Button>
	);
};
