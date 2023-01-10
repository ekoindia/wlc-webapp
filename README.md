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

### jest

- npm install --save-dev jest jest-environment-jsdom @testing-library/react @testing-library/jest-dom

- create two file 1.jest.config.js
                  2.jest.setup.js

-create folder test
-make similar folder & file like comoponent and pages

-package:-"@testing-library/dom": "^8.19.0",
		  "@testing-library/jest-dom": "^5.16.5",
		  "@testing-library/react": "^13.4.0",
		  "@testing-library/user-event": "^14.4.3",

-rule added in jest.setup.js ('^@/pages/(.*)$' : '<rootDir>/pages/$1',)


