# Eko Infinity Web App
A white-labelled SaaS platform to run your business like agent-banking, micro-finance, etc.

## Setup Development Envoirnment:
- One-time Setup:
  - Run `npm i`
  - Run `npm run prepare`
  - Make sure the _.husky/pre-commit_ file is executable by running: `chmod +x pre-commit`
- Run project on your local device:
  - Run: `npm run dev`
  - Open webpage: [http://localhost:3002](http://localhost:3002)

## Icon Library:
- View available icons (open in incognito window where user is not logged-in): `localhost:3000/icons_demo`
- To add new icons, see the file: `constants/IconLibrary.ts`
- There are duplicate icon-names as well, same icons with different names (for backward compatibility). Such icons are shown in red background with the pointer to the actual icon name.
- For optimizing individual SVG icons, use: [SVGOMG - SVGO's Missing GUI](https://jakearchibald.github.io/svgomg/)

## UI Features:
- **Top Navbar** - [components/NavBar/NavBar.jsx](components/NavBar/NavBar.jsx)
  - Menu items configuration: [constants/profileCardMenus.js](constants/profileCardMenus.js)
- **Left Sidebar** - [components/SideBar/SideBar.jsx](components/SideBar/SideBar.jsx)
  - Menu items configuration: [constants/SidebarMenu.ts](constants/SidebarMenu.ts)
  - Menu Context (data fetch after login): [contexts/MenuContext.tsx](contexts/MenuContext.tsx)
  - Menu data filtering & transformation using: [helpers/processTransactionData.js](helpers/processTransactionData.js)
- **Transaction History** (for sellers & distributors) - [page-components/History/History.jsx](page-components/History/History.jsx)
  - History Table metadata: [page-components/History/HistoryTable/historyParametersMetadata.js](page-components/History/HistoryTable/historyParametersMetadata.js)
	- To add a new data-point in the history table, add a new entry in the `historyParametersMetadata` array.
  - History API response is parsed into the required format in [page-components/History/HistoryTable/processHistoryTableData.js](page-components/History/HistoryTable/processHistoryTableData.js)
  - History Table component: [page-components/History/HistoryTable/HistoryTable.jsx](page-components/History/HistoryTable/HistoryTable.jsx)

## Public vs Private Routes:
- To add a public page/route (that can be accesseed by anyone, without logging in), add the route in [constants/validRoutes.js](constants/validRoutes.js) within the array: `publicLinks`.

## Admin
- Dashboard
  - _Business Dashboard_: Divided into 4 part i.e. TopPanel, EarningOverview, SuccessRate & TopMerchants with there config in there respective file - [page-components/Admin/Dashboard/BusinessDashboard](page-components/Admin/Dashboard/BusinessDashboard)

## Pub/Sub
To use pub/sub, follow the following steps:
- Open [PubSubContext.js](contexts/PubSubContext.js) and add your new topic/purpose under the `TOPIC` array.
- For publishing events to this topic:
  ```jsx
  import { usePubSub } from "contexts";

  const { publish, TOPICS } = usePubSub();
  ...
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


## Android Communication
How does communication with the Android wrapper app work?
- On Android side:
	- Android app has a `WebView` which loads this web-app.
	- Android app has a `JavascriptInterface` which exposes a `postMessage` method to the web-app.
	- Web-app can call this `postMessage` method to send messages to the Android app.
	- Android app can listen to these messages and take appropriate actions.
- On this web-app side:
	- In the [Layout component](components/Layout/Layout.tsx), the following 1-time setup is done:
		- Call postMessage method to send a `connect_ready` message to the Android app to let it know that the web-app is ready to receive messages.
		- Setup a callback function `callFromAndroid` to listen to messages from the Android app.
	- We have a `postMessage` method in [utils/AndroidUtils.ts](utils/AndroidUtils.ts) which can be used to send messages to the Android app.
