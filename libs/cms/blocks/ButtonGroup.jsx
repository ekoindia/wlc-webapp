// import { ComponentConfig } from "@measured/puck/types/Config";
import { Button } from "components";
import { pixelSizeOptions, quickSizeOptions } from "../options";
import { Section } from "../Section";

export const ButtonGroup = {
	label: "Button Group",
	fields: {
		buttons: {
			type: "array",
			getItemSummary: (item) => item.label || "Button",
			arrayFields: {
				label: { type: "text" },
				// href: { type: "text" },
				variant: {
					type: "select",
					options: [
						{ label: "Primary", value: "primary" },
						{ label: "Accent", value: "accent" },
						{
							label: "Outline (Primary)",
							value: "primary_outline",
						},
						{ label: "Outline (Accent)", value: "accent_outline" },
						{ label: "Outline (Gray)", value: "outline" },
						{ label: "Link", value: "link" },
					],
				},
			},
		},
		padding: {
			type: "select",
			// label: "Padding",
			options: pixelSizeOptions,
		},
		align: {
			type: "radio",
			options: [
				{ label: "left", value: "left" },
				{ label: "center", value: "center" },
				{ label: "right", value: "right" },
			],
		},
		size: {
			type: "radio",
			options: quickSizeOptions,
		},
	},
	defaultProps: {
		buttons: [{ label: "Learn more", href: "#", variant: "accent" }],
		padding: "8px",
		align: "left",
		size: "md",
	},
	render: ({ buttons, padding, align, size }) => {
		return (
			<Section padding={padding}>
				<div
					style={{
						width: "100%",
						display: "inline-flex",
						flexDirection: "row",
						alignItems: "center",
						justifyContent: `${align || "left"}`,
						gap: "1rem",
					}}
				>
					{buttons.map((button, i) => (
						<Button
							size={size || "md"}
							key={i}
							// href={button.href}
							variant={button.variant}
						>
							{button.label}
						</Button>
					))}
				</div>
			</Section>
		);
	},
};
