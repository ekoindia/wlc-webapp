/**
 * Puck CMS Configuration
 * @see https://puckeditor.com/docs/integrating-puck/component-configuration
 */

import { Center as ChCenter, Flex as ChFlex } from "@chakra-ui/react";
import { DropZone, type Config } from "@measured/puck";
import { OrgLogo } from "components";
// import dynamic from "next/dynamic";
import { createContext, useEffect, useState } from "react";
import {
	ButtonGroup,
	Columns,
	FeatureList,
	Flex,
	Heading,
	Hero,
	Stats,
	Text,
} from "./blocks";
import { LoginWidgetConf } from "./components";
import {
	bgColors,
	extendedSizeOptions,
	paddingSizeMap,
	pixelSizeOptions,
} from "./options";
import { Section } from "./Section";

/**
 * Context for managing common values across components
 */
export const context = createContext({
	paddingX: "" as string,
	setPaddingX: (_value: string) => {},
	commonSectionBg: "" as string,
	setCommonSectionBg: (_value: string) => {},
});

// const OrgLogo2 = dynamic(
// 	() => import("components/OrgLogo").then((pkg) => pkg.OrgLogo),
// 	{
// 		ssr: false,
// 	}
// );

/**
 * Define the Types: components, categories, etc
 * MARK: Types
 */
// type CmsComponentType = {
// 	Heading: {
// 		title: string;
// 		type: string;
// 	};
// 	Center: {
// 		w: string;
// 		h: string;
// 		// children: React.ReactNode;
// 	};
// 	Logo: {};
// 	VerticalSpace: {
// 		h: string;
// 	};
// };
// type categoryType = "layout" | "typography";

/**
 * Define the Categories
 * MARK: Categories
 */
const categories: any = {
	layout: {
		components: ["Columns", "Flex", "Center", "VerticalSpace"],
	},
	sections: {
		components: ["Hero", "FeatureList", "ButtonGroup"],
	},
	typography: {
		components: ["Stats", "Heading", "Text"],
	},
};

/**
 * Define the Components
 * MARK: Components
 */
const components: any = {
	Columns,
	Flex,
	Hero,
	Heading,
	Text,
	Stats,
	VerticalSpace: {
		label: "Vertical Space",
		fields: {
			h: {
				type: "select",
				options: pixelSizeOptions,
			},
		},
		defaultProps: {
			h: "16px",
		},
		render: ({ h }) => {
			return (
				<Section>
					<div style={{ height: h }} />
				</Section>
			);
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
		fields: {
			size: {
				type: "select",
				label: "Size",
				options: [
					{ label: "Normal", value: "md" },
					{ label: "Large", value: "lg" },
				],
			},
			dark: {
				type: "radio",
				label: "Dark Logo",
				options: [
					{ label: "Yes", value: true },
					{ label: "No", value: false },
				],
			},
		},
		defaultProps: { size: "md", dark: false },
		render: ({ dark, size }) => {
			return <OrgLogo size={size} dark={dark} />;
		},
	},
	ButtonGroup,
	FeatureList,
	LoginWidgetConf,
};

/**
 * Define the root component for the Puck Editor
 * MARK: Editor Root
 */
const editorRoot: any = {
	fields: {
		pad: {
			type: "select",
			label: "Padding",
			options: extendedSizeOptions,
		},
		bg: {
			type: "select",
			label: "Background Color",
			options: bgColors,
		},
		clr: {
			type: "select",
			label: "Text Color",
			options: bgColors,
		},
	},
	defaultProps: {
		bg: "bg",
		clr: "black",
		pad: "md",
	},
	render: ({ bg = "bg", clr = "black", pad = "md", children }) => {
		// const padding =
		// 	pad && pad in paddingSizeMap ? paddingSizeMap[pad] : pad;
		// console.log("padding", padding);

		/* eslint-disable react-hooks/rules-of-hooks */

		const [paddingX, setPaddingX] = useState("" as string);
		const [commonSectionBg, setCommonSectionBg] = useState("" as string);

		useEffect(() => {
			const padding =
				pad && pad in paddingSizeMap ? paddingSizeMap[pad] : pad;
			setPaddingX(padding);
		}, [pad]);

		return (
			<context.Provider
				value={{
					paddingX,
					setPaddingX,
					commonSectionBg,
					setCommonSectionBg,
				}}
			>
				<ChFlex
					className="puckRoot"
					position="relative"
					direction="column"
					align="flex-start"
					w="100%"
					h="100%"
					bg={bg}
					color={clr}
					// padding={padding}
				>
					{children}
				</ChFlex>
			</context.Provider>
		);
	},
};

/**
 * Define the configuration for the Puck Editor
 */
const cmsConfig: Config<{}> = {
	categories: categories,

	components: components,

	root: editorRoot,
};

export { cmsConfig };
