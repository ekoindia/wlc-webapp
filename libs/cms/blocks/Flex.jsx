import { bgColors, extendedSizeOptions, paddingSizeMap } from "../options";
import { Section } from "../Section";

export const Flex = {
	fields: {
		items: {
			type: "slot",
			// arrayFields: {
			// 	minW: {
			// 		label: "Minimum Item Width",
			// 		type: "number",
			// 	},
			// },
			// getItemSummary: (_, id) => `Item ${id + 1}`,
		},
		// minW: {
		// 	label: "Minimum Item Width",
		// 	type: "number",
		// },
		bg: {
			type: "select",
			label: "Background Color",
			options: bgColors,
		},
		g: {
			type: "select",
			label: "Gap Size",
			options: extendedSizeOptions,
		},
		wr: {
			type: "select",
			label: "Wrap Items?",
			options: [
				{ label: "Wrap", value: "wrap" },
				{ label: "No Wrap", value: "nowrap" },
			],
		},
	},

	defaultProps: {
		items: [],
		// minW: 356,
		g: "md",
		wr: "wrap",
	},

	render: ({
		items: Items,
		// minW,
		bg,
		g,
		wr,
	}) => {
		return (
			<Section sectionBg={bg}>
				{/* <ChFlex
					gap={g && g in paddingSizeMap ? paddingSizeMap[g] : g}
					wrap={wr}
					minHeight="0"
					minWidth="0"
					width="100%"
					sx={{
						".Flex-item": {
							flex: "1",
						},
					}}
				> */}
				{/* {items.map((item, idx) => (
						<div
							key={idx}
							style={{
								flex: 1,
								minWidth: item.minW || minW,
							}}
						> */}
				<Items
					minEmptyHeight={256}
					style={{
						display: "flex",
						// minHeight: 0,
						// minWidth: 0,
						width: "100%",
						wrap: wr,
						gap: g && g in paddingSizeMap ? paddingSizeMap[g] : g,
					}}
				/>
				{/* </div>
					))} */}
				{/* </ChFlex> */}
			</Section>
		);
	},
};
