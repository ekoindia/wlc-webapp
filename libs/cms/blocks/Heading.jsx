import { Text as ChText } from "@chakra-ui/react";
import { pixelSizeOptions } from "../options";
import { Section } from "../Section";

export const Heading = {
	fields: {
		title: {
			type: "text",
		},
		type: {
			type: "select",
			options: [
				{
					label: "Heading 1",
					value: "h1",
				},
				{
					label: "Heading 2",
					value: "h2",
				},
				{
					label: "Heading 3",
					value: "h3",
				},
			],
		},
		padding: {
			type: "select",
			// label: "Padding",
			options: pixelSizeOptions,
		},
	},
	defaultProps: {
		title: "Title goes here",
		type: "h1",
	},
	render: ({ title, type, padding }) => {
		return (
			<Section padding={padding}>
				<ChText
					as={type || "h1"}
					fontSize={
						type == "h1" ? "3xl" : type == "h2" ? "2xl" : "xl"
					}
					fontWeight={type == "h1" ? "semibold" : "bold"}
				>
					{title}
				</ChText>
			</Section>
		);
	},
};
