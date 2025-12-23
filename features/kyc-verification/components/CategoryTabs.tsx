/**
 * CategoryTabs component for filtering KYC services by category.
 * Uses SegmentedControl internally for consistent styling.
 */

import { Box } from "@chakra-ui/react";
import { SegmentedControl } from "components";
import type { CategoryOption } from "../types";

interface CategoryTabsProps {
	/** Available categories */
	categories: CategoryOption[];
	/** Currently selected category value */
	selectedCategory: string;
	/** Callback when category changes */
	onCategoryChange: (_category: string) => void;
}

/**
 * Category tabs for filtering services.
 * Selection persists across tabs - changing category only filters the view.
 * @param root0
 * @param root0.categories
 * @param root0.selectedCategory
 * @param root0.onCategoryChange
 */
export const CategoryTabs = ({
	categories,
	selectedCategory,
	onCategoryChange,
}: CategoryTabsProps): JSX.Element => {
	// Convert categories to SegmentedControl segments format
	const segments = categories.map((cat) => ({
		value: cat.value,
		label: cat.count ? `${cat.label} (${cat.count})` : cat.label,
	}));

	return (
		<Box overflowX="auto" pb="2">
			<SegmentedControl
				name="kyc-category-tabs"
				segments={segments}
				value={selectedCategory}
				onChange={(value) => onCategoryChange(value)}
				size="sm"
				minSegmentWidth="80px"
				equalWidth={false}
				bg="gray.50"
				color="primary.DEFAULT"
			/>
		</Box>
	);
};

export default CategoryTabs;
