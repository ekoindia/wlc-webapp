const requireField = (fieldName) => {
	return (value) => {
		value = String(value).trim();
		if (value.length < 3) {
			return fieldName + " is required (minimum 3 characters)";
		}
		return true;
	};
};

module.exports = (plop) => {
	plop.setHelper("isInArray", (txt, arr) => arr?.indexOf(txt) >= 0);

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
				type: "checkbox",
				name: "hooks",
				message:
					"Select required hooks (Space to select, Enter when done):",
				choices: [
					{ name: "useEffect" },
					{ name: "useState" },
					{ name: "useReducer" },
				],
			},
		],
		actions: [
			{
				// Add component
				type: "add",
				path: "components/{{pascalCase name}}/{{pascalCase name}}.jsx",
				templateFile: "plop-templates/Component/Component.jsx.hbs",
			},
			{
				// Add Storybook stories file for the component
				type: "add",
				path: "components/{{pascalCase name}}/{{pascalCase name}}.stories.jsx",
				templateFile:
					"plop-templates/Component/Component.stories.jsx.hbs",
			},
			{
				// Add component index file
				type: "add",
				path: "components/{{pascalCase name}}/index.js",
				templateFile: "plop-templates/Component/index.js.hbs",
			},
			{
				// Add Jest test for the component
				type: "add",
				path: "__tests__/components/{{pascalCase name}}/{{pascalCase name}}.test.jsx",
				templateFile: "plop-templates/Component/Component.test.jsx.hbs",
			},
			{
				// Add components index file (if it does not already exist)
				type: "add",
				path: "components/index.js",
				templateFile: "plop-templates/injectable-index.js.hbs",
				skipIfExists: true,
			},
			{
				// Append component import in the components index file
				type: "append",
				path: "components/index.js",
				pattern: `/* PLOP_INJECT_IMPORT */`,
				template: `import { {{pascalCase name}} } from "./{{pascalCase name}}";`,
			},
			{
				// Append component export in the components index file
				type: "append",
				path: "components/index.js",
				pattern: `export {`, //`/* PLOP_INJECT_EXPORT */`,
				template: `\t{{pascalCase name}},`,
			},
		],
	});

	plop.setGenerator("Component (.tsx)", {
		description: "Create a reusable typescript component",
		prompts: [
			{
				type: "input",
				name: "name",
				message: "Name of the component?",
				validate: requireField("name"),
			},
			{
				type: "checkbox",
				name: "hooks",
				message:
					"Select required hooks (Space to select, Enter when done):",
				choices: [
					{ name: "useEffect" },
					{ name: "useState" },
					{ name: "useReducer" },
				],
			},
		],
		actions: [
			{
				// Add component
				type: "add",
				path: "components/{{pascalCase name}}/{{pascalCase name}}.tsx",
				templateFile: "plop-templates/Component/Component.jsx.hbs",
			},
			{
				// Add Storybook stories file for the component
				type: "add",
				path: "components/{{pascalCase name}}/{{pascalCase name}}.stories.jsx",
				templateFile:
					"plop-templates/Component/Component.stories.jsx.hbs",
			},
			{
				// Add component index file
				type: "add",
				path: "components/{{pascalCase name}}/index.js",
				templateFile: "plop-templates/Component/index.js.hbs",
			},
			{
				// Add Jest test for the component
				type: "add",
				path: "__tests__/components/{{pascalCase name}}/{{pascalCase name}}.test.jsx",
				templateFile: "plop-templates/Component/Component.test.jsx.hbs",
			},
			{
				// Add components index file (if it does not already exist)
				type: "add",
				path: "components/index.js",
				templateFile: "plop-templates/injectable-index.js.hbs",
				skipIfExists: true,
			},
			{
				// Append component import in the components index file
				type: "append",
				path: "components/index.js",
				pattern: `/* PLOP_INJECT_IMPORT */`,
				template: `import { {{pascalCase name}} } from "./{{pascalCase name}}";`,
			},
			{
				// Append component export in the components index file
				type: "append",
				path: "components/index.js",
				pattern: `export {`, //`/* PLOP_INJECT_EXPORT */`,
				template: `\t{{pascalCase name}},`,
			},
		],
	});

	plop.setGenerator("Path-Component", {
		description: "Create a reusable component",
		prompts: [
			{
				type: "input",
				name: "name",
				message: "Name of the component?",
				validate: requireField("name"),
			},
			{
				type: "input",
				name: "path",
				message:
					"Path for the component dont use slash before and after.",
				validate: requireField("path"),
			},
			{
				type: "checkbox",
				name: "hooks",
				message:
					"Select required hooks (Space to select, Enter when done):",
				choices: [
					{ name: "useEffect" },
					{ name: "useState" },
					{ name: "useReducer" },
				],
			},
		],
		actions: [
			{
				// Add component
				type: "add",
				path: "components/{{path}}/{{pascalCase name}}/{{pascalCase name}}.jsx",
				templateFile: "plop-templates/Component/Component.jsx.hbs",
			},
			{
				// Add Storybook stories file for the component
				type: "add",
				path: "components/{{path}}/{{pascalCase name}}/{{pascalCase name}}.stories.jsx",
				templateFile:
					"plop-templates/Component/Component.stories.jsx.hbs",
			},
			{
				// Add component index file
				type: "add",
				path: "components/{{path}}/{{pascalCase name}}/index.js",
				templateFile: "plop-templates/Component/index.js.hbs",
			},
			{
				// Add Jest test for the component
				type: "add",
				path: "__tests__/components/{{path}}/{{pascalCase name}}/{{pascalCase name}}.test.jsx",
				templateFile: "plop-templates/Component/Component.test.jsx.hbs",
			},
			{
				// Add components index file (if it does not already exist)
				type: "add",
				path: "components/{{path}}/index.js",
				templateFile: "plop-templates/injectable-index.js.hbs",
				skipIfExists: true,
			},
			{
				// Append component import in the components index file
				type: "append",
				path: "components/{{path}}/index.js",
				pattern: `/* PLOP_INJECT_IMPORT */`,
				template: `import { {{pascalCase name}} } from "./{{pascalCase name}}";`,
			},
			{
				// Append component export in the components index file
				type: "append",
				path: "components/{{path}}/index.js",
				pattern: `export {`, //`/* PLOP_INJECT_EXPORT */`,
				template: `\t{{pascalCase name}},`,
			},
		],
	});

	plop.setGenerator("Page-Component", {
		description: "Create a Page-Component",
		prompts: [
			{
				type: "input",
				name: "name",
				message: "Name of the Page-Component?",
				validate: requireField("name"),
			},
			{
				type: "checkbox",
				name: "hooks",
				message:
					"Select required hooks (Space to select, Enter when done):",
				choices: [
					{ name: "useEffect" },
					{ name: "useState" },
					{ name: "useReducer" },
				],
			},
		],
		actions: [
			{
				// Add component
				type: "add",
				path: "page-components/{{pascalCase name}}/{{pascalCase name}}.jsx",
				templateFile: "plop-templates/Component/Component.jsx.hbs",
			},
			{
				// Add Storybook stories file for the component
				type: "add",
				path: "page-components/{{pascalCase name}}/{{pascalCase name}}.stories.jsx",
				templateFile:
					"plop-templates/Component/Component.stories.jsx.hbs",
			},
			{
				// Add component index file
				type: "add",
				path: "page-components/{{pascalCase name}}/index.js",
				templateFile: "plop-templates/Component/index.js.hbs",
			},
			{
				// Add Jest test for the component
				type: "add",
				path: "__tests__/page-components/{{pascalCase name}}/{{pascalCase name}}.test.jsx",
				templateFile: "plop-templates/Component/Component.test.jsx.hbs",
			},
			{
				// Add components index file (if it does not already exist)
				type: "add",
				path: "page-components/index.js",
				templateFile: "plop-templates/injectable-index.js.hbs",
				skipIfExists: true,
			},
			{
				// Append component import in the components index file
				type: "append",
				path: "page-components/index.js",
				pattern: `/* PLOP_INJECT_IMPORT */`,
				template: `import { {{pascalCase name}} } from "./{{pascalCase name}}";`,
			},
			{
				// Append component export in the components index file
				type: "append",
				path: "page-components/index.js",
				pattern: `export {`, //`/* PLOP_INJECT_EXPORT */`,
				template: `\t{{pascalCase name}},`,
			},
		],
	});

	plop.setGenerator("Path-Page-Component", {
		description: "Create a path Page-Component",
		prompts: [
			{
				type: "input",
				name: "name",
				message: "Name of the Page-Component?",
				validate: requireField("name"),
			},
			{
				type: "input",
				name: "role",
				message: "Enter Role (Admin/, Merchant..)",
			},
			{
				type: "input",
				name: "path",
				message: "Enter the Path with forward & backward slash",
			},
			{
				type: "checkbox",
				name: "hooks",
				message:
					"Select required hooks (Space to select, Enter when done):",
				choices: [
					{ name: "useEffect" },
					{ name: "useState" },
					{ name: "useReducer" },
				],
			},
		],
		actions: [
			{
				// Add component
				type: "add",
				path: "page-components/{{role}}/{{path}}/{{pascalCase name}}/{{pascalCase name}}.jsx",
				templateFile: "plop-templates/Component/Component.jsx.hbs",
			},
			{
				// Add Storybook stories file for the component
				type: "add",
				path: "page-components/{{role}}/{{path}}/{{pascalCase name}}/{{pascalCase name}}.stories.jsx",
				templateFile:
					"plop-templates/Component/Component.stories.jsx.hbs",
			},
			{
				// Add component index file
				type: "add",
				path: "page-components/{{role}}/{{path}}/{{pascalCase name}}/index.js",
				templateFile: "plop-templates/Component/index.js.hbs",
			},
			{
				// Add Jest test for the component
				type: "add",
				path: "__tests__/page-components/{{role}}/{{path}}/{{pascalCase name}}/{{pascalCase name}}.test.jsx",
				templateFile: "plop-templates/Component/Component.test.jsx.hbs",
			},
			{
				// Append component import in the components index file
				type: "append",
				path: "page-components/{{role}}/{{path}}/index.js",
				template: `export { {{pascalCase name}} } from "./{{pascalCase name}}";`,
			},
			// {
			//     // Add components index file (if it does not already exist)
			//     type: "add",
			//     path: "page-components/{{role}}/{{path}}/index.js",
			//     templateFile: "plop-templates/injectable-index.js.hbs",
			//     skipIfExists: true,
			// },
			// {
			//     // Append component import in the components index file
			//     type: "append",
			//     path: "page-components/{{role}}/{{path}}/index.js",
			//     pattern: `/* PLOP_INJECT_IMPORT */`,
			//     template: `import { {{pascalCase name}} } from "./{{pascalCase name}}";`,
			// },
			// {
			//     // Append component export in the components index file
			//     type: "append",
			//     path: "page-components/{{role}}/{{path}}/index.js",
			//     pattern: `export {`, //`/* PLOP_INJECT_EXPORT */`,
			//     template: `\t{{pascalCase name}},`,
			// },
		],
	});

	plop.setGenerator("Role-Page-Component", {
		description: "Create a role based Page-Component",
		prompts: [
			{
				type: "input",
				name: "name",
				message: "Name of the Page-Component?",
				validate: requireField("name"),
			},
			{
				type: "input",
				name: "role",
				message: "Enter Role (Admin/, Merchant..)",
			},
			{
				type: "checkbox",
				name: "hooks",
				message:
					"Select required hooks (Space to select, Enter when done):",
				choices: [
					{ name: "useEffect" },
					{ name: "useState" },
					{ name: "useReducer" },
				],
			},
		],
		actions: [
			{
				// Add component
				type: "add",
				path: "page-components/{{role}}/{{pascalCase name}}/{{pascalCase name}}.jsx",
				templateFile: "plop-templates/Component/Component.jsx.hbs",
			},
			{
				// Add Storybook stories file for the component
				type: "add",
				path: "page-components/{{role}}/{{pascalCase name}}/{{pascalCase name}}.stories.jsx",
				templateFile:
					"plop-templates/Component/Component.stories.jsx.hbs",
			},
			{
				// Add component index file
				type: "add",
				path: "page-components/{{role}}/{{pascalCase name}}/index.js",
				templateFile: "plop-templates/Component/index.js.hbs",
			},
			{
				// Add Jest test for the component
				type: "add",
				path: "__tests__/page-components/{{role}}/{{pascalCase name}}/{{pascalCase name}}.test.jsx",
				templateFile: "plop-templates/Component/Component.test.jsx.hbs",
			},
			{
				// Add components index file (if it does not already exist)
				type: "add",
				path: "page-components/{{role}}/index.js",
				templateFile: "plop-templates/injectable-index.js.hbs",
				skipIfExists: true,
			},
			{
				// Append component import in the components index file
				type: "append",
				path: "page-components/{{role}}/index.js",
				pattern: `/* PLOP_INJECT_IMPORT */`,
				template: `import { {{pascalCase name}} } from "./{{pascalCase name}}";`,
			},
			{
				// Append component export in the components index file
				type: "append",
				path: "page-components/{{role}}/index.js",
				pattern: `export {`, //`/* PLOP_INJECT_EXPORT */`,
				template: `\t{{pascalCase name}},`,
			},
		],
	});

	plop.setGenerator("Page", {
		description: "Create a page",
		prompts: [
			{
				type: "input",
				name: "name",
				message: "Name of the page?",
				validate: requireField("name"),
			},
		],
		actions: [
			{
				type: "add",
				path: "pages/{{lowerCase name}}/{{lowerCase name}}.jsx",
				templateFile: "plop-templates/Page/Page.jsx.hbs",
			},
			{
				type: "add",
				path: "pages/{{lowerCase name}}/index.js",
				templateFile: "plop-templates/Page/index.js.hbs",
			},
			{
				type: "add",
				path: "__tests__/pages/{{lowerCase name}}/{{lowerCase name}}.test.jsx",
				templateFile: "plop-templates/Page/Page.test.jsx.hbs",
			},
		],
	});

	plop.setGenerator("Admin-Page", {
		description: "Create a page inside admin",
		prompts: [
			{
				type: "input",
				name: "name",
				message: "Name of the page?",
				validate: requireField("name"),
			},
		],
		actions: [
			{
				type: "add",
				path: "pages/admin/{{lowerCase name}}/{{lowerCase name}}.jsx",
				templateFile: "plop-templates/Page/Page.jsx.hbs",
			},
			{
				type: "add",
				path: "pages/admin/{{lowerCase name}}/index.js",
				templateFile: "plop-templates/Page/index.js.hbs",
			},
			{
				type: "add",
				path: "__tests__/pages/admin/{{lowerCase name}}/{{lowerCase name}}.test.jsx",
				templateFile: "plop-templates/Page/Page.test.jsx.hbs",
			},
		],
	});

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

	plop.setGenerator("Test for Component", {
		description: "Create a Jest test file for a component",
		prompts: [
			{
				type: "input",
				name: "name",
				message: "Name of the component?",
				validate: requireField("name"),
			},
		],
		actions: [
			{
				type: "add",
				path: "__tests__/components/{{pascalCase name}}/{{pascalCase name}}.test.jsx",
				templateFile: "plop-templates/Component/Component.test.jsx.hbs",
			},
		],
	});

	plop.setGenerator("StoryBook Stories for Component", {
		description: "Create a Storybook Stories file for a component",
		prompts: [
			{
				type: "input",
				name: "name",
				message: "Name of the component?",
				validate: requireField("name"),
			},
		],
		actions: [
			{
				// Add Storybook stories file for the component
				type: "add",
				path: "components/{{pascalCase name}}/{{pascalCase name}}.stories.jsx",
				templateFile:
					"plop-templates/Component/Component.stories.jsx.hbs",
			},
		],
	});
};
