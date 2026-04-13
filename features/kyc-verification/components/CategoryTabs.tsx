/**
 * CategoryTabs component for filtering KYC services by category.
 * Uses SegmentedControl internally for consistent styling.
 */

import { Box } from "@chakra-ui/react";
import { Icon, SegmentedControl } from "components";
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
 * Category tabs for filtering KYC verification services.
 * Selection persists across tabs - changing category only filters the view.
 * @param {CategoryTabsProps} props - Component props
 * @param {CategoryOption[]} props.categories - Available category options for filtering
 * @param {string} props.selectedCategory - Currently selected category value
 * @param {Function} props.onCategoryChange - Callback invoked when category selection changes
 * @returns {JSX.Element} Rendered category tabs using SegmentedControl
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
		icon: cat.icon ? <Icon name={cat.icon} size="14px" /> : undefined,
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
				showDividers
			/>
		</Box>
	);
};

export default CategoryTabs;
