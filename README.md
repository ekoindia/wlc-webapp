# Eloka Web App by Eko
Project "Infinity": A white-labelled SaaS platform to run your business like agent-banking, micro-finance, etc.


## 🧑‍💻 Setup Development Envoirnment:

- One-time Setup:
  - Run `npm i`
  - Run `npm run prepare`
  - Make sure the _.husky/pre-commit_ file is executable by running: `chmod +x pre-commit`
- Run project on your local device:
  - Run: `npm run dev`
  - Open webpage: [http://localhost:3002](http://localhost:3002)


## 📜 Available Scripts

### Development
- `npm run dev` - Run development server on port 3002
- `npm run dev.https` - Run development server with HTTPS on port 3004
- `npm run scan` - Run development server on port 3006 with react-scan to detects rerenders and other performance issues
- `npm run inspect` - Run development server with Node inspector
- `npm start` - Start production server
- `npm run build` - Build production bundle
- `npm run analyze` - Build with bundle-analyzer for size analysis

### Code Quality
- `npm run lint` - Run Next.js linting
- `npm run lint-error` - Run linting with fewer warnings
- `npm run lint-fix` - Fix linting issues automatically
- `npm run eslint` - Run ESLint with project config
- `npm run eslint-fix` - Fix ESLint issues automatically
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting without changes

### Testing
- `npm test` - Run all tests
- `npm run test-file` - Run tests for a single file
- `npm run test-watch` - Run tests in watch mode
- `npm run test-coverage` - Run tests with coverage report
- `npm run test-update-snapshots` - Update test snapshots

### Development Tools
- `npm run g` or `npm run generate` - Run plop generator for new components
- `npm run sb` or `npm run storybook` - Run Storybook on port 6006
- `npm run build-storybook` - Build static Storybook
- `npm run check-updates` - Check for outdated dependencies
- `npm run check-deps` - Run custom dependency checks

### Docker Commands
- `npm run docker:dev` - Run development container
- `npm run docker:prod` - Run production container
- `npm run docker:dev:build` - Build and run development container
- `npm run docker:prod:build` - Build and run production container
- `npm run docker:stop` - Stop all containers
- `npm run docker:clean` - Remove containers, images, and volumes

## ✅ Toggle Feature Flags:

- Feature flags are used to enable/disable a specific feature.
  - Features can also be allowed for specific environments, user-types, user-ids, etc. Especially helpful for experimental features.
  - TODO: Provide for A-B testing, gradual roll-out, etc.
- To add a new feature-flag, add a new entry in the [constants/featureFlags.ts](constants/featureFlags.ts) file.
- To test for a feature-flag, use the `useFeatureFlag` hook from [hooks/useFeatureFlag.tsx](hooks/useFeatureFlag.tsx).
  - Eg: `const [isFeatureEnabled] = useFeatureFlag('MY_FEATURE');`
  - to dynamically check for feature flags, use the `checkFeatureFlag` function:
    ```jsx
	import { useFeatureFlag } from 'hooks/useFeatureFlag';
	const [_isFeatureEnabled, checkFeatureFlag] = useFeatureFlag();

	const isAnotherFeatureEnabled = checkFeatureFlag('ANOTHER_FEATURE');
	```


## 🎨 UI Features:

- **Global Styles**:
  - Global CSS styles are defined in [styles/globals.ts](styles/globals.ts).
- **Theme**:
  - Default color theme configuration (CHakraUI): [styles/themes.tsx](styles/themes.tsx)
  - A list of predefined color-themes for the organizations to choose from: [constants/colorThemes.js](constants/colorThemes.js)
  - Component to show theme colors to users to choose from: [components/ColorPair/ColorPair.jsx](components/ColorPair/ColorPair.jsx)
  -Organization's custom theme is loaded in [pages/_app.tsx](pages/_app.tsx).
- **Icon Library**:
  - To view available icons, open the webpage: http://localhost:3002/icons_demo
  - To add new icons, see the file: [constants/IconLibrary.ts](constants/IconLibrary.ts)
  - There are duplicate icon-names as well, same icons with different names (for backward compatibility). Such icons are shown in red background with the pointer to the actual icon name.
  - For optimizing individual SVG icons, use: [SVGOMG - SVGO's Missing GUI](https://jakearchibald.github.io/svgomg/)
- **Top Navbar** - [components/NavBar/NavBar.jsx](components/NavBar/NavBar.jsx)
  - Profile-menu (drop-down menu in top-right corner):
    - Rendered in the `MyAccountCard` component in NavBar.jsx.
    - Items configuration (for internal links, such as, Settings page): [constants/profileCardMenus.js](constants/profileCardMenus.js)
- **Left Sidebar** - [components/SideBar/SideBar.jsx](components/SideBar/SideBar.jsx)
  - Menu items configuration: [constants/SidebarMenu.ts](constants/SidebarMenu.ts)
  - Menu Context (data fetch after login): [contexts/MenuContext.tsx](contexts/MenuContext.tsx)
  - MenuContext filtered into transaction & other lists for the sidebar: [hooks/useNavigationLists.js](hooks/useNavigationLists.js)
  - Menu data filtering & transformation using: [helpers/processTransactionData.js](helpers/processTransactionData.js)
- **Bottom App Bar** - The `BottomAppBar` is a flexible component that serves as the primary navigation bar at the bottom of the small screen. It adapts to various use cases, allowing for the inclusion of navigation links, actions, and custom components. [components/BottomAppBar/BottomAppBar.tsx](components/BottomAppBar/BottomAppBar.tsx)
  - _Bottom App Bar Items_ - The items in the Bottom App Bar are configured using the `useBottomAppBarItems` hook. This hook returns an array of objects, each representing an item in the bottom app bar. [components/BottomAppBar/useBottomAppBar.ts](components/BottomAppBar/useBottomAppBar.ts)
    - Each item can include the following properties:
        - `name`: A unique identifier for the item.
        - `label`: The text label displayed beneath the icon.
        - `icon`: The name of the icon displayed in the item.
        - `path`: The navigation path for the item. For admin users, paths can be prefixed with `/admin`.
        - `action`: A function that is executed when the item is clicked, such as toggling a search bar.
        - `component`: A custom JSX component that can be rendered within the item.
        - `visible`: A boolean indicating whether the item should be visible in the Bottom App Bar.


## 💼 Business Features:

### 📈 Business/Pricing Configuration for Admins:
To add pricing configuration page for a new product in the Admin portal under "Pricing & Commission" left-menu section, use the following steps:

#### For Pricing Configuration using File Upload:
1. Create a configuration for the product in [`constants/ProductBusinessConfigurations.ts`](constants/ProductBusinessConfigurations.ts) file under the `business_config_slug_map` object.
   1. Set a unique slug (for the page URL) and the name of the page-component to display.
   2. Set template="fileupload"
   3. Add set URL & parameters for file-upload and sample-file-download in the `meta` object.
   4. Add the slug to `product_pricing_categories` object in the order that you want to display on the product listing page. If not added here, the product will not be displayed on the product listing page.

#### For creating a custom Pricing (or, Business) Configuration page:
1. Create a page-component for the pricing configuration running the command `npm run g`
   1. Select "Component"
   2. Enter the name of the page-component (eg: `TrainTravel`)
   3. Select Path: `page-components/Admin`
   4. Enter sub-folder: `PricingCommission`
2. Copy sub-components from other existing pricing page-component such as: `TrainTravelDistributor` and `TrainTravelRetailer`
3. Create a configuration for the product in [`constants/ProductBusinessConfigurations.ts`](constants/ProductBusinessConfigurations.ts) file under the `business_config_slug_map` object.
   1. Set a unique slug (for the page URL) and the name of the page-component to display (created in step #1).
   2. Add the slug to `product_pricing_categories` object in the order that you want to display on the product listing page. If not added here, the product will not be displayed on the product listing page.
4. Create a configuration for the product in [`constants/ProductDetails.js`](constants/ProductDetails.js) page. Set slabs, validations, etc for the pricing configuration.


## ✨ Other Features:

### 🚦 Routing (Public vs Private Pages):
- To add a public page/route (that can be accesseed by anyone, without logging in), add the route in [constants/validRoutes.js](constants/validRoutes.js) within the array: `publicLinks`.

### Pub/Sub

To use pub/sub, follow the following steps:
- Add your new topic/purpose in the [constants/PubSubTopics.ts](constants/PubSubTopics.ts) file.
- For publishing events to this topic:
  ```jsx
  import { usePubSub } from "contexts";

  const { publish, TOPICS } = usePubSub();
  publish(TOPIC.MY_TOPIC, data);	// data = additional data to pass to the subscribers
  ```
  Where, _data_ is the additional data you want to pass to the subscribers.
- For subscribing (listening) to the published events:
  ```jsx
  import { usePubSub } from "contexts";

  const { subscribe, TOPICS } = usePubSub();

  useEffect(() => {
	const unsubscribe = subscribe(TOPICS.MY_TOPIC, (data) => {
			// Subscriber logic here...
		});

	return unsubscribe;	// Unsubscribe on component unmount
  }, []);
  ```


### 📱 Android Communication

How does communication with the Android wrapper app work?
- On Android side:
	- Android app has a `WebView` which loads this web-app.
	- Android app has a `JavascriptInterface` which exposes a `postMessage` method to the web-app.
	- Web-app can call this `postMessage` method to send messages to the Android app.
	- Android app can listen to these messages and take appropriate actions.
- On this web-app side:
	- In the [Layout component](layout-components/Layout/Layout.tsx), the following 1-time setup is done:
		- Call postMessage method to send a `connect_ready` message to the Android app to let it know that the web-app is ready to receive messages.
		- Setup a callback function `callFromAndroid` to listen to messages from the Android app.
	- We have a `postMessage` method in [utils/AndroidUtils.ts](utils/AndroidUtils.ts) which can be used to send messages to the Android app.

## 🛠️ Common Utilities

### 🪝 Custom [**hooks/**](hooks/):
- `useAppLink`: For handling app links (deep-links) and redirecting to the appropriate page. Supports old `connect.eko.in` links as well as the `ekoconnect://` links.
- `useClipboard`: Copy text to clipboard.
- `useDailyCacheState`: Cache the state in the browser's localStorage. The cache state has a `valid` flag which is set to `false` when the cache is stale (older than 1 day).
- `useDebouncedState`: Debounce the state update to avoid unnecessary re-renders.
- `useDelayToggle`: A simple hook to toggle a boolean value after a delay. For example, it can be used to load/show a component after an initial delay.
- `useExternalResource`: Load an external resource (JS/CSS) dynamically. It returns a state variable (idle, loading, ready, error) and a reload function. The resource is loaded only once.
- `useFeatureFlag`: Check if a feature is enabled or not. Set the feature-flags with conditions in the [constants/featureFlags.ts](constants/featureFlags.ts) file.
- `useHotkey`: Register a hotkey (keyboard shortcut) and execute a callback function when the hotkey is pressed. Uses the tinykeys library.
- `useHslColor`: Get a dynamic color in HSL format based on the input value. Useful for creating a color scale or colored tags.
- `useLocalStorage`: Read/Write data to the browser's localStorage.
- `useSessionStorage`: Read/Write data to the browser's sessionStorage.
- `usePubSub`: Publish/Subscribe to events. Add new topics in the [contexts/PubSubContext.js](contexts/PubSubContext.js) file.

### 📦 Custom [**libs**](libs/):
These are wrappers around 3rd-party libraries or associated utility functions.
- [GoogleMap](libs/GoogleMap.jsx) - Google Maps API wrapper
- [Map View](libs/MapView.js) - View static maps using iFrame
- [dateFormat](libs/dateFormat.js) - Date formatting utility (wrapper around `date-fns`)
- [faceDetector](libs/faceDetector.js) - Dynamically loads MediaPipe Face Detector model (uses wasm)
- [chakraKeyFrames](libs/chakraKeyFrames.js) - Common keyframes for ChakraUI animations


## 💽 Global [Contexts](contexts/) (Data Providers)
1.



## 💾 Browser Storage
The following data is stored in the browser (localStorage & sessionStorage):
### LocalStorage
1.

### SessionStorage
1. `org_detail`: Organization details
1. `user_detail`: User details
1. `access_token`: Access token
1. `access_token_lite`
1. `access_token_crm`
1. `token_timeout`: Token timeout
1. `refresh_token`: Refresh token


## 🧪 Experimental Features
### LLM Chatbot
- Component: [GptChatBetaWidget.jsx](page-components/Home/GptChatBetaWidget.jsx)
- TODO: use [`react-chatbot-kit`](https://fredrikoseberg.github.io/react-chatbot-kit-docs/) library.
- The chatbot configuration is done in [components/ChatBot/ChatBot.jsx](components/ChatBot/ChatBot.jsx).


## 📄 [Pages](pages)

### [Admin](pages/admin) Pages:
- Dashboard
  - _Business Dashboard_: Divided into 4 part i.e. TopPanel, EarningOverview, SuccessRate & TopMerchants with there config in there respective file - [page-components/Admin/Dashboard/BusinessDashboard](page-components/Admin/Dashboard/BusinessDashboard)

### Other Pages
- Home
  - [_Know Your Commissions_](page-components/Home/KnowYourCommissionWidget/KnowYourCommissionWidget.jsx):
	- Commission Data is fetched via [CommissionContext](contexts/CommissionContext.js) when the user signs-in.

