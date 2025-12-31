import { Grid } from "@chakra-ui/react";
import { InfoTile } from "components";

// Declare the props interface
interface InfoTileGridProps {
	/**
	 * List of InfoTile items to be displayed in the grid
	 */
	list?: {
		/** Label for the tile */
		label: string;
		/** Description for the tile */
		desc?: string;
		/** Icon for the tile */
		icon?: string;
		/** URL to navigate to when the tile is clicked. It is used only when `onClick` is not provided */
		url?: string;
		/** Function to call when the tile is clicked. When both `url` and `onClick` are provided, `onClick` will take precedence. */
		onClick?: () => void;
		/** Unique name identifier for the tile. When provided, enables event delegation via data-card-name attribute */
		name?: string;
		/** Current selection state (only used when selectable=true on grid) */
		selected?: boolean;
		/** Callback when selection is toggled */
		onSelect?: () => void;
		/** Category tags to display */
		tags?: string[];
		/** Whether the item is enabled (only used when toggleMode=true on grid) */
		isEnabled?: boolean;
		/** Callback when toggle is switched (only used when toggleMode=true on grid) */
		onToggle?: () => void;
		/** Whether toggle is in loading state (only used when toggleMode=true on grid) */
		isToggling?: boolean;
	}[];

	/** Style of the icon - avatar (default) or square */
	iconStyle?: "avatar" | "square";

	/** Enable selection mode for all tiles */
	selectable?: boolean;

	/** Whether to show tags on tiles */
	showTags?: boolean;

	/** Enable toggle mode for all tiles - shows a switch to toggle enabled/disabled state */
	toggleMode?: boolean;

	/** Enable double-click/tap to toggle (only used when toggleMode=true) */
	enableDoubleClickToggle?: boolean;
}

/**
 * A grid of InfoTile components where each tile has a label, description, and an icon.
 * It can be used to display a collection of related information in a visually appealing way.
 * Each tile can be clicked to navigate to a different page or perform an action.
 * Supports selection mode for multi-select scenarios.
 * Supports toggle mode for admin enable/disable scenarios.
 * @param props Component props
 * @param props.list
 * @param props.iconStyle
 * @param props.selectable
 * @param props.showTags
 * @param props.toggleMode
 * @param props.enableDoubleClickToggle
 */
const InfoTileGrid = ({
	list,
	iconStyle = "avatar",
	selectable = false,
	showTags = true,
	toggleMode = false,
	enableDoubleClickToggle = true,
}: InfoTileGridProps) => {
	// MARK: JSX
	return (
		<Grid
			templateColumns={{
				base: "repeat(auto-fill,minmax(250px,1fr))",
				md: "repeat(auto-fill,minmax(300px,1fr))",
			}}
			justifyContent="center"
			alignItems="stretch"
			py={{ base: "4", md: "0px" }}
			gap={{
				base: 2,
				md: 4,
				lg: 6,
			}}
		>
			{list?.map((item) => {
				const {
					label,
					desc,
					icon,
					url,
					onClick,
					name,
					selected,
					onSelect,
					tags,
					isEnabled,
					onToggle,
					isToggling,
				} = item || {};
				if (!label) return null;

				return (
					<InfoTile
						key={name || label + url}
						iconStyle={iconStyle}
						selectable={selectable}
						showTags={showTags}
						toggleMode={toggleMode}
						enableDoubleClickToggle={enableDoubleClickToggle}
						{...{
							label,
							desc,
							icon,
							url,
							onClick,
							name,
							selected,
							onSelect,
							tags,
							isEnabled,
							onToggle,
							isToggling,
						}}
					/>
				);
			})}
		</Grid>
	);
};

export default InfoTileGrid;
