const requireField = (fieldName) => {
	return (value) => {
		value = String(value).trim();
		if (value.length < 3) {
			return fieldName + " is required (minimum 3 characters)";
		}
		return true;
	};
};

/**
 *
 * @param plop
 */
export default function (plop) {
	/**
	 * Helper to check if a value is in an array.
	 */
	plop.setHelper("isInArray", (txt, arr) => arr?.indexOf(txt) >= 0);

	/**
	 * Helper to get typescript/javascript extension based on the options.
	 */
	plop.setHelper("ext", (options) =>
		options.includes("tsx") ? "tsx" : "jsx"
	);

	/**
	 * Helper to cleanup the subfolders path.
	 */
	plop.setHelper("subPath", (subfolders) => {
		if (!subfolders) return "";

		subfolders = subfolders.trim().replace(/^[/\\]+/g, "/");

		if (!subfolders.endsWith("/")) {
			subfolders += "/";
		}

		return subfolders;
	});

	/**
	 * Create a new React component (with unit-test & storybook) in any of the following folders:
	 * - components
	 * - page-components
	 * - tf-components
	 * - layout-components
	 *
	 * Option to use Typescript or Javascript.
	 * Option to include hooks like useEffect, useState, useReducer.
	 *
	 * This generator will:
	 * - Create a new folder for the component. Supports multiple component folders like page-components, etc.
	 * - Create a new component file with optional hooks
	 * - Create a new storybook file
	 * - Create a new index file
	 * - Create a new test file
	 * - Add the component to the components index file
	 */
	plop.setGenerator("Component", {
		description: "Create a reusable component",
		prompts: [
			{
				type: "input",
				name: "name",
				message: "Name of the component?",
				validate: requireField("name"),
			},
			{
				type: "list",
				name: "componentfolder",
				message:
					"Where do you want to create the component? (Enter to select)",
				choices: [
					{ name: "components/", value: "components" },
					{ name: "tf-components/", value: "tf-components" },
					{ name: "page-components/", value: "page-components" },
					{
						name: "page-components/Admin/",
						value: "page-components/Admin",
					},
					{ name: "layout-components/", value: "layout-components" },
				],
				default: "component",
			},
			{
				type: "input",
				name: "subfolders",
				message:
					"[OPTIONAL] Enter sub-folders (if any) separated by '/':",
			},
			{
				type: "checkbox",
				name: "options",
				message: "Select additional details:",
				choices: [
					{
						name: "Use Typescript (.tsx) for component",
						value: "tsx",
						checked: true,
					},
					{
						name: "Generate Component",
						value: "component",
						checked: true,
					},
					{
						name: "Generate Unit Test",
						value: "test",
						checked: true,
					},
					{
						name: "Generate Storybook stories",
						value: "stories",
						checked: true,
					},
				],
			},
			{
				type: "checkbox",
				name: "hooks",
				message: "[OPTIONAL] Select required hooks:",
				choices: [
					{ name: "useEffect", value: "useEffect" },
					{ name: "useState", value: "useState" },
					{ name: "useReducer", value: "useReducer" },
				],
				when: (answers) => answers.options.includes("component"),
			},
		],
		actions: (data) => {
			const { options } = data;
			const actions = [];

			if (!options) return actions;

			// Generate component
			if (options.includes("component")) {
				actions.push(
					...[
						{
							// Add component
							type: "add",
							path: "{{componentfolder}}/{{subPath subfolders}}{{pascalCase name}}/{{pascalCase name}}.{{ext options}}", // Use Typescript if selected
							templateFile:
								"plop-templates/Component/Component.{{ext options}}.hbs",
							skipIfExists: true,
						},
						{
							// Add component index file
							type: "add",
							path: "{{componentfolder}}/{{subPath subfolders}}{{pascalCase name}}/index.js",
							templateFile:
								"plop-templates/Component/index.js.hbs",
							skipIfExists: true,
						},
						{
							// Add components index file (if it does not already exist)
							type: "add",
							path: "{{componentfolder}}/{{subPath subfolders}}index.js",
							templateFile:
								"plop-templates/injectable-index.js.hbs",
							skipIfExists: true,
						},
						{
							// Append component import in the components index file
							type: "append",
							path: "{{componentfolder}}/{{subPath subfolders}}index.js",
							template: `export { {{pascalCase name}} } from "./{{pascalCase name}}";`,
						},
					]
				);
			}

			// Generate unit test
			if (options.includes("test")) {
				actions.push({
					// Add Jest test for the component
					type: "add",
					path: "__tests__/{{componentfolder}}/{{subPath subfolders}}{{pascalCase name}}/{{pascalCase name}}.test.jsx",
					templateFile:
						"plop-templates/Component/Component.test.jsx.hbs",
					skipIfExists: true,
				});
			}

			// Generate Storybook story
			if (options.includes("stories")) {
				actions.push({
					// Add Storybook stories file for the component
					type: "add",
					path: "{{componentfolder}}/{{subPath subfolders}}{{pascalCase name}}/{{pascalCase name}}.stories.jsx",
					templateFile:
						"plop-templates/Component/Component.stories.jsx.hbs",
					skipIfExists: true,
				});
			}

			return actions;
		},
	});

	/**
	 * Create a new Next.js page in any of the following folders:
	 * - pages
	 * - pages/admin
	 *
	 * Option to use Typescript or Javascript.
	 * Option to generate unit-test.
	 */
	plop.setGenerator("Page", {
		description: "Create a page",
		prompts: [
			{
				type: "input",
				name: "name",
				message: "Name of the page?",
				validate: requireField("name"),
			},
			{
				type: "list",
				name: "pagefolder",
				message:
					"Where do you want to create the component? (Enter to select)",
				choices: [
					{ name: "pages/", value: "pages" },
					{ name: "pages/admin/", value: "pages/admin" },
				],
				default: "pages",
			},
			{
				type: "checkbox",
				name: "options",
				message: "Select additional details:",
				choices: [
					{
						name: "Use Typescript (.tsx) for component",
						value: "tsx",
						checked: true,
					},
					{
						name: "Generate Page",
						value: "page",
						checked: true,
					},
					{
						name: "Generate Unit Test",
						value: "test",
						checked: true,
					},
				],
			},
		],
		actions: (data) => {
			const { options } = data;
			const actions = [];

			if (!options) return actions;

			// Generate page
			if (options.includes("page")) {
				actions.push(
					...[
						{
							// Add page
							type: "add",
							path: "{{pagefolder}}/{{lowerCase name}}/{{lowerCase name}}.{{ext options}}", // Use Typescript extension if selected
							templateFile: "plop-templates/Page/Page.jsx.hbs",
							skipIfExists: true,
						},
						{
							// Add page index file
							type: "add",
							path: "{{pagefolder}}/{{lowerCase name}}/index.js",
							templateFile: "plop-templates/Page/index.js.hbs",
							skipIfExists: true,
						},
					]
				);
			}

			// Generate unit test
			if (options.includes("test")) {
				actions.push({
					// Add Jest test for the page
					type: "add",
					path: "__tests__/{{pagefolder}}/{{lowerCase name}}/{{lowerCase name}}.test.jsx",
					templateFile: "plop-templates/Page/Page.test.jsx.hbs",
					skipIfExists: true,
				});
			}

			return actions;
		},
	});

	/**
	 * Create a new hook in the hooks folder.
	 * Option to use Typescript or Javascript.
	 * Option to generate unit-test.
	 */
	plop.setGenerator("Hook", {
		description: "Create a React hook",
		prompts: [
			{
				type: "input",
				name: "name",
				message: "Name of the hook (WITHOUT PREPENDING 'use')?",
				validate: requireField("name"),
			},
		],
		actions: [
			{
				// Add hook
				type: "add",
				path: "hooks/use{{pascalCase name}}.js",
				templateFile: "plop-templates/hooks/hook.jsx.hbs",
			},
			{
				// Add hooks index file (if it does not already exist)
				type: "add",
				path: "hooks/index.js",
				template: `/* PLOP_INJECT_EXPORT */\n`,
				skipIfExists: true,
			},
			{
				// Append hook export in the hooks index file
				type: "append",
				path: "hooks/index.js",
				pattern: `/* PLOP_INJECT_EXPORT */`,
				template: `export { default as use{{pascalCase name}} } from "./use{{pascalCase name}}";`,
			},
			{
				// Add Jest test for the hook
				type: "add",
				path: "__tests__/hooks/use{{pascalCase name}}/use{{pascalCase name}}.test.js",
				templateFile: "plop-templates/hooks/hook.test.jsx.hbs",
			},
		],
	});

	// plop.setGenerator("Component (.tsx)", {
	// 	description: "Create a reusable typescript component",
	// 	prompts: [
	// 		{
	// 			type: "input",
	// 			name: "name",
	// 			message: "Name of the component?",
	// 			validate: requireField("name"),
	// 		},
	// 		{
	// 			type: "checkbox",
	// 			name: "hooks",
	// 			message:
	// 				"Select required hooks (Space to select, Enter when done):",
	// 			choices: [
	// 				{ name: "useEffect" },
	// 				{ name: "useState" },
	// 				{ name: "useReducer" },
	// 			],
	// 		},
	// 	],
	// 	actions: [
	// 		{
	// 			// Add component
	// 			type: "add",
	// 			path: "components/{{pascalCase name}}/{{pascalCase name}}.tsx",
	// 			templateFile: "plop-templates/Component/Component.jsx.hbs",
	// 		},
	// 		{
	// 			// Add Storybook stories file for the component
	// 			type: "add",
	// 			path: "components/{{pascalCase name}}/{{pascalCase name}}.stories.jsx",
	// 			templateFile:
	// 				"plop-templates/Component/Component.stories.jsx.hbs",
	// 		},
	// 		{
	// 			// Add component index file
	// 			type: "add",
	// 			path: "components/{{pascalCase name}}/index.js",
	// 			templateFile: "plop-templates/Component/index.js.hbs",
	// 		},
	// 		{
	// 			// Add Jest test for the component
	// 			type: "add",
	// 			path: "__tests__/components/{{pascalCase name}}/{{pascalCase name}}.test.jsx",
	// 			templateFile: "plop-templates/Component/Component.test.jsx.hbs",
	// 		},
	// 		{
	// 			// Add components index file (if it does not already exist)
	// 			type: "add",
	// 			path: "components/index.js",
	// 			templateFile: "plop-templates/injectable-index.js.hbs",
	// 			skipIfExists: true,
	// 		},
	// 		{
	// 			// Append component import in the components index file
	// 			type: "append",
	// 			path: "components/index.js",
	// 			pattern: `/* PLOP_INJECT_IMPORT */`,
	// 			template: `import { {{pascalCase name}} } from "./{{pascalCase name}}";`,
	// 		},
	// 		{
	// 			// Append component export in the components index file
	// 			type: "append",
	// 			path: "components/index.js",
	// 			pattern: `export {`, //`/* PLOP_INJECT_EXPORT */`,
	// 			template: `\t{{pascalCase name}},`,
	// 		},
	// 	],
	// });

	// plop.setGenerator("Path-Component", {
	// 	description: "Create a reusable component",
	// 	prompts: [
	// 		{
	// 			type: "input",
	// 			name: "name",
	// 			message: "Name of the component?",
	// 			validate: requireField("name"),
	// 		},
	// 		{
	// 			type: "input",
	// 			name: "path",
	// 			message:
	// 				"Path for the component dont use slash before and after.",
	// 			validate: requireField("path"),
	// 		},
	// 		{
	// 			type: "checkbox",
	// 			name: "hooks",
	// 			message:
	// 				"Select required hooks (Space to select, Enter when done):",
	// 			choices: [
	// 				{ name: "useEffect" },
	// 				{ name: "useState" },
	// 				{ name: "useReducer" },
	// 			],
	// 		},
	// 	],
	// 	actions: [
	// 		{
	// 			// Add component
	// 			type: "add",
	// 			path: "components/{{path}}/{{pascalCase name}}/{{pascalCase name}}.jsx",
	// 			templateFile: "plop-templates/Component/Component.jsx.hbs",
	// 		},
	// 		{
	// 			// Add Storybook stories file for the component
	// 			type: "add",
	// 			path: "components/{{path}}/{{pascalCase name}}/{{pascalCase name}}.stories.jsx",
	// 			templateFile:
	// 				"plop-templates/Component/Component.stories.jsx.hbs",
	// 		},
	// 		{
	// 			// Add component index file
	// 			type: "add",
	// 			path: "components/{{path}}/{{pascalCase name}}/index.js",
	// 			templateFile: "plop-templates/Component/index.js.hbs",
	// 		},
	// 		{
	// 			// Add Jest test for the component
	// 			type: "add",
	// 			path: "__tests__/components/{{path}}/{{pascalCase name}}/{{pascalCase name}}.test.jsx",
	// 			templateFile: "plop-templates/Component/Component.test.jsx.hbs",
	// 		},
	// 		{
	// 			// Add components index file (if it does not already exist)
	// 			type: "add",
	// 			path: "components/{{path}}/index.js",
	// 			templateFile: "plop-templates/injectable-index.js.hbs",
	// 			skipIfExists: true,
	// 		},
	// 		{
	// 			// Append component import in the components index file
	// 			type: "append",
	// 			path: "components/{{path}}/index.js",
	// 			pattern: `/* PLOP_INJECT_IMPORT */`,
	// 			template: `import { {{pascalCase name}} } from "./{{pascalCase name}}";`,
	// 		},
	// 		{
	// 			// Append component export in the components index file
	// 			type: "append",
	// 			path: "components/{{path}}/index.js",
	// 			pattern: `export {`, //`/* PLOP_INJECT_EXPORT */`,
	// 			template: `\t{{pascalCase name}},`,
	// 		},
	// 	],
	// });

	// plop.setGenerator("Page-Component", {
	// 	description: "Create a Page-Component",
	// 	prompts: [
	// 		{
	// 			type: "input",
	// 			name: "name",
	// 			message: "Name of the Page-Component?",
	// 			validate: requireField("name"),
	// 		},
	// 		{
	// 			type: "checkbox",
	// 			name: "hooks",
	// 			message:
	// 				"Select required hooks (Space to select, Enter when done):",
	// 			choices: [
	// 				{ name: "useEffect" },
	// 				{ name: "useState" },
	// 				{ name: "useReducer" },
	// 			],
	// 		},
	// 	],
	// 	actions: [
	// 		{
	// 			// Add component
	// 			type: "add",
	// 			path: "page-components/{{pascalCase name}}/{{pascalCase name}}.jsx",
	// 			templateFile: "plop-templates/Component/Component.jsx.hbs",
	// 		},
	// 		{
	// 			// Add Storybook stories file for the component
	// 			type: "add",
	// 			path: "page-components/{{pascalCase name}}/{{pascalCase name}}.stories.jsx",
	// 			templateFile:
	// 				"plop-templates/Component/Component.stories.jsx.hbs",
	// 		},
	// 		{
	// 			// Add component index file
	// 			type: "add",
	// 			path: "page-components/{{pascalCase name}}/index.js",
	// 			templateFile: "plop-templates/Component/index.js.hbs",
	// 		},
	// 		{
	// 			// Add Jest test for the component
	// 			type: "add",
	// 			path: "__tests__/page-components/{{pascalCase name}}/{{pascalCase name}}.test.jsx",
	// 			templateFile: "plop-templates/Component/Component.test.jsx.hbs",
	// 		},
	// 		{
	// 			// Add components index file (if it does not already exist)
	// 			type: "add",
	// 			path: "page-components/index.js",
	// 			templateFile: "plop-templates/injectable-index.js.hbs",
	// 			skipIfExists: true,
	// 		},
	// 		{
	// 			// Append component import in the components index file
	// 			type: "append",
	// 			path: "page-components/index.js",
	// 			pattern: `/* PLOP_INJECT_IMPORT */`,
	// 			template: `import { {{pascalCase name}} } from "./{{pascalCase name}}";`,
	// 		},
	// 		{
	// 			// Append component export in the components index file
	// 			type: "append",
	// 			path: "page-components/index.js",
	// 			pattern: `export {`, //`/* PLOP_INJECT_EXPORT */`,
	// 			template: `\t{{pascalCase name}},`,
	// 		},
	// 	],
	// });

	// plop.setGenerator("Path-Page-Component", {
	// 	description: "Create a path Page-Component",
	// 	prompts: [
	// 		{
	// 			type: "input",
	// 			name: "name",
	// 			message: "Name of the Page-Component?",
	// 			validate: requireField("name"),
	// 		},
	// 		{
	// 			type: "input",
	// 			name: "role",
	// 			message: "Enter Role (Admin/, Merchant..)",
	// 		},
	// 		{
	// 			type: "input",
	// 			name: "path",
	// 			message: "Enter the Path with forward & backward slash",
	// 		},
	// 		{
	// 			type: "checkbox",
	// 			name: "hooks",
	// 			message:
	// 				"Select required hooks (Space to select, Enter when done):",
	// 			choices: [
	// 				{ name: "useEffect" },
	// 				{ name: "useState" },
	// 				{ name: "useReducer" },
	// 			],
	// 		},
	// 	],
	// 	actions: [
	// 		{
	// 			// Add component
	// 			type: "add",
	// 			path: "page-components/{{role}}/{{path}}/{{pascalCase name}}/{{pascalCase name}}.jsx",
	// 			templateFile: "plop-templates/Component/Component.jsx.hbs",
	// 		},
	// 		{
	// 			// Add Storybook stories file for the component
	// 			type: "add",
	// 			path: "page-components/{{role}}/{{path}}/{{pascalCase name}}/{{pascalCase name}}.stories.jsx",
	// 			templateFile:
	// 				"plop-templates/Component/Component.stories.jsx.hbs",
	// 		},
	// 		{
	// 			// Add component index file
	// 			type: "add",
	// 			path: "page-components/{{role}}/{{path}}/{{pascalCase name}}/index.js",
	// 			templateFile: "plop-templates/Component/index.js.hbs",
	// 		},
	// 		{
	// 			// Add Jest test for the component
	// 			type: "add",
	// 			path: "__tests__/page-components/{{role}}/{{path}}/{{pascalCase name}}/{{pascalCase name}}.test.jsx",
	// 			templateFile: "plop-templates/Component/Component.test.jsx.hbs",
	// 		},
	// 		{
	// 			// Append component import in the components index file
	// 			type: "append",
	// 			path: "page-components/{{role}}/{{path}}/index.js",
	// 			template: `export { {{pascalCase name}} } from "./{{pascalCase name}}";`,
	// 		},
	// 		// {
	// 		//     // Add components index file (if it does not already exist)
	// 		//     type: "add",
	// 		//     path: "page-components/{{role}}/{{path}}/index.js",
	// 		//     templateFile: "plop-templates/injectable-index.js.hbs",
	// 		//     skipIfExists: true,
	// 		// },
	// 		// {
	// 		//     // Append component import in the components index file
	// 		//     type: "append",
	// 		//     path: "page-components/{{role}}/{{path}}/index.js",
	// 		//     pattern: `/* PLOP_INJECT_IMPORT */`,
	// 		//     template: `import { {{pascalCase name}} } from "./{{pascalCase name}}";`,
	// 		// },
	// 		// {
	// 		//     // Append component export in the components index file
	// 		//     type: "append",
	// 		//     path: "page-components/{{role}}/{{path}}/index.js",
	// 		//     pattern: `export {`, //`/* PLOP_INJECT_EXPORT */`,
	// 		//     template: `\t{{pascalCase name}},`,
	// 		// },
	// 	],
	// });

	// plop.setGenerator("Role-Page-Component", {
	// 	description: "Create a role based Page-Component",
	// 	prompts: [
	// 		{
	// 			type: "input",
	// 			name: "name",
	// 			message: "Name of the Page-Component?",
	// 			validate: requireField("name"),
	// 		},
	// 		{
	// 			type: "input",
	// 			name: "role",
	// 			message: "Enter Role (Admin/, Merchant..)",
	// 		},
	// 		{
	// 			type: "checkbox",
	// 			name: "hooks",
	// 			message:
	// 				"Select required hooks (Space to select, Enter when done):",
	// 			choices: [
	// 				{ name: "useEffect" },
	// 				{ name: "useState" },
	// 				{ name: "useReducer" },
	// 			],
	// 		},
	// 	],
	// 	actions: [
	// 		{
	// 			// Add component
	// 			type: "add",
	// 			path: "page-components/{{role}}/{{pascalCase name}}/{{pascalCase name}}.jsx",
	// 			templateFile: "plop-templates/Component/Component.jsx.hbs",
	// 		},
	// 		{
	// 			// Add Storybook stories file for the component
	// 			type: "add",
	// 			path: "page-components/{{role}}/{{pascalCase name}}/{{pascalCase name}}.stories.jsx",
	// 			templateFile:
	// 				"plop-templates/Component/Component.stories.jsx.hbs",
	// 		},
	// 		{
	// 			// Add component index file
	// 			type: "add",
	// 			path: "page-components/{{role}}/{{pascalCase name}}/index.js",
	// 			templateFile: "plop-templates/Component/index.js.hbs",
	// 		},
	// 		{
	// 			// Add Jest test for the component
	// 			type: "add",
	// 			path: "__tests__/page-components/{{role}}/{{pascalCase name}}/{{pascalCase name}}.test.jsx",
	// 			templateFile: "plop-templates/Component/Component.test.jsx.hbs",
	// 		},
	// 		{
	// 			// Add components index file (if it does not already exist)
	// 			type: "add",
	// 			path: "page-components/{{role}}/index.js",
	// 			templateFile: "plop-templates/injectable-index.js.hbs",
	// 			skipIfExists: true,
	// 		},
	// 		{
	// 			// Append component import in the components index file
	// 			type: "append",
	// 			path: "page-components/{{role}}/index.js",
	// 			pattern: `/* PLOP_INJECT_IMPORT */`,
	// 			template: `import { {{pascalCase name}} } from "./{{pascalCase name}}";`,
	// 		},
	// 		{
	// 			// Append component export in the components index file
	// 			type: "append",
	// 			path: "page-components/{{role}}/index.js",
	// 			pattern: `export {`, //`/* PLOP_INJECT_EXPORT */`,
	// 			template: `\t{{pascalCase name}},`,
	// 		},
	// 	],
	// });

	// plop.setGenerator("Admin-Page", {
	// 	description: "Create a page inside admin",
	// 	prompts: [
	// 		{
	// 			type: "input",
	// 			name: "name",
	// 			message: "Name of the page?",
	// 			validate: requireField("name"),
	// 		},
	// 	],
	// 	actions: [
	// 		{
	// 			type: "add",
	// 			path: "pages/admin/{{lowerCase name}}/{{lowerCase name}}.jsx",
	// 			templateFile: "plop-templates/Page/Page.jsx.hbs",
	// 		},
	// 		{
	// 			type: "add",
	// 			path: "pages/admin/{{lowerCase name}}/index.js",
	// 			templateFile: "plop-templates/Page/index.js.hbs",
	// 		},
	// 		{
	// 			type: "add",
	// 			path: "__tests__/pages/admin/{{lowerCase name}}/{{lowerCase name}}.test.jsx",
	// 			templateFile: "plop-templates/Page/Page.test.jsx.hbs",
	// 		},
	// 	],
	// });

	// plop.setGenerator("Test for Component", {
	// 	description: "Create a Jest test file for a component",
	// 	prompts: [
	// 		{
	// 			type: "input",
	// 			name: "name",
	// 			message: "Name of the component?",
	// 			validate: requireField("name"),
	// 		},
	// 	],
	// 	actions: [
	// 		{
	// 			type: "add",
	// 			path: "__tests__/components/{{pascalCase name}}/{{pascalCase name}}.test.jsx",
	// 			templateFile: "plop-templates/Component/Component.test.jsx.hbs",
	// 		},
	// 	],
	// });

	// plop.setGenerator("StoryBook Stories for Component", {
	// 	description: "Create a Storybook Stories file for a component",
	// 	prompts: [
	// 		{
	// 			type: "input",
	// 			name: "name",
	// 			message: "Name of the component?",
	// 			validate: requireField("name"),
	// 		},
	// 	],
	// 	actions: [
	// 		{
	// 			// Add Storybook stories file for the component
	// 			type: "add",
	// 			path: "components/{{pascalCase name}}/{{pascalCase name}}.stories.jsx",
	// 			templateFile:
	// 				"plop-templates/Component/Component.stories.jsx.hbs",
	// 		},
	// 	],
	// });
}
