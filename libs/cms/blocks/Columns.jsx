import { Grid, GridItem } from "@chakra-ui/react";
import { bgColors } from "../options";
import { Section } from "../Section";

export const Columns = {
	fields: {
		dist: {
			label: "Distribution",
			type: "radio",
			options: [
				{
					value: "auto",
					label: "Auto",
				},
				{
					value: "manual",
					label: "Manual",
				},
			],
		},
		cols: {
			label: "Columns",
			type: "array",
			getItemSummary: (col, id) =>
				`Column ${id + 1}, span ${
					col.span ? Math.max(Math.min(col.span, 12), 1) : "auto"
				}`,
			arrayFields: {
				content: {
					type: "slot",
				},
				span: {
					label: "Span (1-12)",
					type: "number",
					min: 1,
					max: 12,
				},
			},
		},
		bg: {
			type: "select",
			label: "Background Color",
			options: bgColors,
		},
	},
	defaultProps: {
		dist: "auto",
		cols: [{ content: [] }, { content: [] }],
	},
	render: ({ cols, dist, bg }) => {
		return (
			<Section bg={bg}>
				<Grid
					w="100%"
					templateColumns={{
						base: "1fr",
						md:
							dist === "manual"
								? "repeat(12, 1fr)"
								: `repeat(${cols.length}, 1fr)`,
					}}
					gap="24px"
					// minH="0"
					// minW="0"
				>
					{cols.map(({ content: Content, span }, idx) => (
						<GridItem
							// minH="50px"
							// minW="100px"
							w="100%"
							key={idx}
							colSpan={
								span && dist === "manual"
									? Math.max(Math.min(span, 12), 1)
									: 1
							}
						>
							<Content minEmptyHeight={256} />
							{/* <DropZone
								zone={`column-${idx}`}
								minEmptyHeight={128}
							/> */}
						</GridItem>
					))}
				</Grid>
			</Section>
		);
	},
};
