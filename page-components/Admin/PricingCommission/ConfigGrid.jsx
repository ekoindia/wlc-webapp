import { InfoTileGrid } from "components";
import { business_config_slug_map } from "constants";
import { useFeatureFlag } from "hooks";
import { useEffect, useState } from "react";

/**
 * Grid component to display the list of configuration items.
 * For example, display a grid of products to set pricing/commissions for.
 * @param {object} props
 * @param {Array} props.product_list List of product-slugs or other configuration-slugs to display.
 * @param {string} [props.basePath] Base path for the current page. Used to define links for the sub-pages.
 * @param {boolean} [props.sub_page] Flag to identify if the grid is being used in a sub-page.
 */
const ConfigGrid = ({ product_list, basePath, sub_page = false }) => {
	const [_isFeatureEnabled, checkFeatureFlag] = useFeatureFlag();
	const [productGridList, setProductGridList] = useState([]);

	useEffect(() => {
		const updatedProductGridList = product_list
			?.map((product) => {
				// const { label, hide, featureFlag } =
				// 	business_config_slug_map[product] ?? {};
				const { label, desc, icon, hide, featureFlag } =
					business_config_slug_map[product] ?? {};

				if (hide) return null;
				if (!label) return null;

				// Check featureFlag:  if provided and not enabled, return null
				if (featureFlag && checkFeatureFlag(featureFlag) !== true) {
					return null;
				}

				return {
					label,
					desc,
					icon,
					url: (sub_page ? "" : `${basePath}/`) + product,
				};
			})
			.filter(Boolean);

		setProductGridList(updatedProductGridList);
	}, [
		product_list,
		sub_page,
		basePath,
		business_config_slug_map,
		checkFeatureFlag,
	]);

	if (!productGridList?.length) return null;

	return <InfoTileGrid list={productGridList} />;
};

export { ConfigGrid };
