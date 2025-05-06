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
	}[];
}

/**
 * A grid of InfoTile components where each tile has a label, description, and an icon. It can be used to display a collection of related information in a visually appealing way. Each tile can be clicked to navigate to a different page or perform an action.
 * @param root0
 * @param root0.list
 */
const InfoTileGrid = ({ list }: InfoTileGridProps) => {
	// MARK: JSX
	return (
		<Grid
			templateColumns={{
				base: "repeat(auto-fill,minmax(250px,1fr))",
				md: "repeat(auto-fill,minmax(300px,1fr))",
			}}
			justifyContent="center"
			py={{ base: "4", md: "0px" }}
			gap={{
				base: 2,
				md: 4,
				lg: 6,
			}}
		>
			{list?.map((item) => {
				const { label, desc, icon, url, onClick } = item || {};
				if (!label) return null;

				return (
					<InfoTile
						key={label + url}
						{...{
							label,
							desc,
							icon,
							url,
							onClick,
						}}
					/>
				);
			})}
		</Grid>
	);
};

export default InfoTileGrid;
