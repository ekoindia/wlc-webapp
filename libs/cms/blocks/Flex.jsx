import { Flex as ChFlex } from "@chakra-ui/react";
import { DropZone } from "@measured/puck";
import { bgColors } from "../options";
import { Section } from "../Section";

export const Flex = {
	fields: {
		items: {
			type: "array",
			arrayFields: {
				minItemWidth: {
					label: "Minimum Item Width",
					type: "number",
				},
			},
			getItemSummary: (_, id) => `Item ${id + 1}`,
		},
		minItemWidth: {
			label: "Minimum Item Width",
			type: "number",
		},
		bg: {
			type: "select",
			label: "Background Color",
			options: bgColors,
		},
	},

	defaultProps: {
		items: [{}, {}],
		minItemWidth: 356,
	},

	render: ({ items, minItemWidth, bg }) => {
		return (
			<Section sectionBg={bg}>
				<ChFlex gap="24px" wrap="wrap" minHeight="0" minWidth="0">
					{items.map((item, idx) => (
						<div
							key={idx}
							style={{
								flex: 1,
								minWidth: item.minItemWidth || minItemWidth,
							}}
						>
							<DropZone zone={`item-${idx}`} />
						</div>
					))}
				</ChFlex>
			</Section>
		);
	},
};
