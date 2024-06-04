/**
 * Puck CMS Configuration
 * @see https://puckeditor.com/docs/integrating-puck/component-configuration
 */

import { Center as ChCenter, Text as ChText } from "@chakra-ui/react";
import { DropZone, type Config } from "@measured/puck";
import { OrgLogo } from "components";
import { spacingOptions } from "./options";
// import dynamic from "next/dynamic";

// const OrgLogo = dynamic(
// 	() => import("components/OrgLogo").then((pkg) => pkg.OrgLogo),
// 	{
// 		ssr: false,
// 	}
// );

/**
 * Define the Types: components, categories, etc
 * MARK: Types
 */
type CmsComponentType = {
	Heading: {
		title: string;
		type: string;
	};
	Center: {
		w: string;
		h: string;
		// children: React.ReactNode;
	};
	Logo: {};
	VerticalSpace: {
		h: string;
	};
};
type categoryType = "layout" | "typography";

/**
 * Define the Categories
 * MARK: Categories
 */
const categories: any = {
	layout: {
		components: ["Center", "VerticalSpace"],
	},
	typography: {
		components: ["Heading"],
	},
};

/**
 * Define the Components
 * MARK: Components
 */
const components: any = {
	Heading: {
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
		},
		defaultProps: {
			title: "Title goes here",
			type: "h1",
		},
		render: ({ title, type }) => {
			return (
				<ChText
					as={type || "h1"}
					fontSize={
						type == "h1" ? "3xl" : type == "h2" ? "2xl" : "xl"
					}
					fontWeight={type == "h1" ? "semibold" : "bold"}
				>
					{title}
				</ChText>
			);
		},
	},
	VerticalSpace: {
		fields: {
			h: {
				type: "select",
				options: spacingOptions,
			},
		},
		defaultProps: {
			h: "20px",
		},
		render: ({ h }) => {
			return <div style={{ height: h }} />;
		},
	},
	Center: {
		fields: {
			w: { type: "text", label: "Width" },
			h: { type: "text", label: "Height" },
		},
		defaultProps: {
			w: "100%",
			h: "100%",
		},
		render: ({ w, h }) => {
			return (
				<ChCenter w={w} h={h}>
					<DropZone zone="content" />
				</ChCenter>
			);
		},
	},
	Logo: {
		fields: {},
		defaultProps: {},
		render: () => {
			return <OrgLogo />;
		},
	},
};

/**
 * Define the root component for the Puck Editor
 * MARK: Editor Root
 */
const editorRoot: any = {
	fields: {},
	render: ({ children }) => {
		return (
			<div
				className="puckRoot"
				style={{
					position: "relative",
					display: "flex",
					flexDirection: "column",
					alignItems: "initial",
				}}
			>
				{children}
			</div>
		);
	},
};

/**
 * Define the configuration for the Puck Editor
 */
const cmsConfig: Config<CmsComponentType, {}, categoryType> = {
	categories: categories,

	components: components,

	root: editorRoot,
};

export { cmsConfig, type CmsComponentType };
