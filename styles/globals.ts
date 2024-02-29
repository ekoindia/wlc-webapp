/**
 * Chakra theme.styles.global definitions.
 * These CSS styles are applied globally.
 */
export const globalStyles = {
	body: {
		// margin: 0,
		// padding: 0,
		// width: "100vw",
		// height: "100vh",
		overscrollBehaviorY: "none",
	},
	"[hidden], [hideempty]:empty": {
		display: "none !important",
	},
	"*": {
		boxSizing: "border-box",
	},
	"img, svg, video, canvas, audio, iframe, embed, object": {
		maxWidth: "100%",
		display: "block",
	},
	"[no-select]": {
		PointerEvents: "none",
		userSelect: "none",
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

	// Auto Dark Theme...
	// "@media (prefers-color-scheme: dark)": {
	// 	body: {
	// 		filter: "invert(100%) hue-rotate(180deg)",
	// 	},
	// 	// Fix for Firefox
	// 	html: {
	// 		backgroundColor: "#111",
	// 	},
	// 	// Do not invert media (revert the invert)
	// 	"img, video, canvas, iframe": {
	// 		filter: "invert(100%) hue-rotate(180deg)",
	// 	},
	// },

	// "div[tooltip]:not([tooltip='']):not([notooltip])": {
	// 	position: "relative !important",
	// },
	// "div[tooltip]:not([tooltip='']):not([notooltip]):before": {
	// 	content: "attr(tooltip)",
	// 	display: "inline-block",
	// 	position: "absolute !important",
	// 	outline: "none",
	// 	top: 0,
	// 	left: "auto",
	// 	right: "auto",
	// 	opacity: 0,
	// 	lineHeight: "1.3",
	// 	zIndex: "99999999",
	// 	pointerEvents: "none",
	// 	backfaceVisibility: "hidden",
	// 	transition: "none",
	// 	padding: "8px",
	// 	color: "white",
	// 	fontSize: "10px",
	// 	fontWeight: 400,
	// 	borderRadius: "2px",
	// 	minHeight: "1.5em",
	// 	marginTop: "5em",
	// 	background: "#616161",
	// },
	// "[tooltip]:not([tooltip='']):not([notooltip])[tooltip-config~='right']:before":
	// 	{
	// 		// marginTop: "-40px",
	// 		top: "auto",
	// 		left: "50% !important",
	// 		right: "-50%",
	// 	},
	// "[tooltip]:not([tooltip='']):not([notooltip]):hover:before": {
	// 	transition: "opacity 0.3s ease-out 0.9s",
	// 	opacity: 0.9,
	// 	width: "auto",
	// 	height: "auto",
	// },
};
