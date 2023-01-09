# Nextjs Setup Project

Guide - [https://dev.to/alexeagleson/how-to-build-scalable-architecture-for-your-nextjs-project-2pb7](https://dev.to/alexeagleson/how-to-build-scalable-architecture-for-your-nextjs-project-2pb7)

### Typescript app

### prettier

-   npm i prettier --save-dev

### link

-   npm i lint

### husky -

Ref : https://www.coffeeclass.io/articles/commit-better-code-with-husky-prettier-eslint-lint-staged

-   npm i husky --save-dev
-   add "prepare": "husky install” in script
-   npx husky install
-   npx husky add .husky/pre-commit "npm lint”
-   npm add -D @commitlint/config-conventional @commitlint/cli
-   put rules -pending

-

### .vscode folder

-   make two file setting.json and launch.json

### Folders to add

-   mkdir components, libs, hooks, contexts, constants, configs, utils

### StoryBook

-   npx sb init --builder webpack5

```jsx
"resolutions": {
		"webpack": "^5",
		"@storybook/react/webpack": "^5"
	},
```

-   npm i
-   Added .storybook/main.js `staticDirs: ['../public'],`
-   Added some info in .storybook/preview.js
-   To run - npm run storybook

### Plop

-   npm i Plop --save-dev

### Autoprefixer

-   npm i autoprefixer --save-dev

### Chromatic

### postcss
