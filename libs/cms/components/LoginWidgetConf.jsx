import { LoginWidget } from "page-components/LoginPanel";

export const LoginWidgetConf = {
	label: "Login Widget",
	fields: {},
	defaultProps: {},
	render: ({ puck, ...rest }) => {
		const { isEditing } = puck;
		return (
			<LoginWidget previewMode={isEditing} borderRadius="8px" {...rest} />
		);
	},
};
