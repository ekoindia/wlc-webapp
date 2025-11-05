import { LoginWidget } from "page-components/LoginPanel";

/**
 * Login Widget component configuration for page builder
 */
const LoginWidgetConf = {
	label: "Login Widget",
	fields: {
		hideLogo: {
			type: "radio",
			label: "Hide Logo",
			options: [
				{ label: "Yes", value: true },
				{ label: "No", value: false },
			],
		},
	},
	defaultProps: { hideLogo: false },
	// inline: true,
	render: ({ hideLogo, puck, ...rest }) => {
		const { isEditing, metadata } = puck;
		return (
			<div
			// style={{
			// 	display: "flex",
			// 	justifyContent: "center",
			// 	width: "100%",
			// }}
			>
				<LoginWidget
					// ref={puck.dragRef} // Let Puck know this element is draggable
					// opacity="1 !important" // Fix bug with `inline: true`
					hideLogo={hideLogo}
					previewMode={isEditing || metadata?.previewMode}
					borderRadius="8px"
					margin="0 auto"
					width="auto"
					{...rest}
				/>
			</div>
		);
	},
};

export { LoginWidgetConf };
