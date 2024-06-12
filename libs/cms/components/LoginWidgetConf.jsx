import { LoginWidget } from "page-components/LoginPanel";

export const LoginWidgetConf = {
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
	render: ({ hideLogo, puck, ...rest }) => {
		const { isEditing } = puck;
		return (
			<LoginWidget
				hideLogo={hideLogo}
				previewMode={isEditing}
				borderRadius="8px"
				{...rest}
			/>
		);
	},
};
