/**
 * Chakra theme.styles.global definitions.
 * These CSS styles are applied globally.
 */
export const globalStyles = {
	"[hidden], [hideempty]:empty": {
		display: "none !important",
	},
	"*": {
		boxSizing: "border-box",
	},
	".customScrollbars::-webkit-scrollbar-track": {
		WebkitBoxShadow: "inset 0 0 1px rgba(0,0,0,0)",
	},
	".customScrollbars::-webkit-scrollbar-track:hover": {
		WebkitBoxShadow: "inset 0 0 1px rgba(0,0,0,0.2)",
	},
	".customScrollbars::-webkit-scrollbar": {
		width: "10px",
		background: "rgba(0,0,0,0)",
	},
	".customScrollbars::-webkit-scrollbar:hover": {
		backgroundColor: "rgba(100,100,100,0.1)",
	},
	".customScrollbars::-webkit-scrollbar-thumb": {
		backgroundColor: "#AAA",
		borderLeft: "6px solid transparent",
		borderRight: "1px solid transparent",
		backgroundClip: "content-box",
	},
	".customScrollbars::-webkit-scrollbar-thumb:hover": {
		backgroundColor: "#999",
		border: "1px solid #777",
	},
};
