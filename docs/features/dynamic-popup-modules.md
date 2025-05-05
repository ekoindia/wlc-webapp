# DynamicPopupModuleLoader Documentation

## Overview

The `DynamicPopupModuleLoader` is a crucial layout component responsible for dynamically loading and displaying other components (referred to as "modules") within modal popups or drawers. It centralizes the logic for handling popup states, dynamic imports, and communication between the triggering component and the loaded module.

This component listens for specific events published via the application's pub/sub system (`usePubSub`) and renders the requested module accordingly. It supports stacking multiple popups, although only the topmost one is interactive.

These popups can be displayed on any page within the application, allowing for a flexible and modular approach to UI interactions. The component is designed to be reusable and extensible, making it easy to add new modules in the future.

## Example Use-Cases
- **Feedback Module**:
  - A feedback form that users can fill out, which can be triggered from various parts of the application.
  - Hook: `useRaiseIssue`
- **File Viewer Module**:
  - A component that allows users to view files (e.g., PDFs, images) directly within the application.
  - Hook: `useFileView`
- **Image Editor Module**:
  - A module for editing images, which can be triggered from different contexts.
  - Hook: `useImageEditor`
- **Camera Module**:
  - A component that allows users to take pictures or scan documents using their device's camera.
  - Hook: `useCamera`
- **Notifications Module**: A module for displaying notifications or alerts to users, which can be triggered from various parts of the application.
  - Hook: `useNotifications`


## Key Features

- **Dynamic Loading**: Uses Next.js's `next/dynamic` for lazy loading of components, improving performance by only loading the necessary code when required.
- **Pub/Sub Communication**: Integrates with the application's pub/sub system to decouple the triggering of popups from their implementation, allowing for a more modular architecture.
- **Customizable**: Supports passing options to the loaded module, allowing for tailored behavior and appearance.
- **Result Handling**: Can publish results back to the triggering component via a unique pub/sub topic, enabling two-way communication.
- **Styling Options**: Uses Chakra UI's `Modal` and `Drawer` components for consistent styling and behavior, with options for customization.
- **Default Options**: Provides default configurations for each module, including styling, title, and props, making it easy to standardize the appearance and behavior of popups across the application.
- **Error Handling**: Includes basic error handling for module loading failures, ensuring a graceful fallback in case of issues.
- **Stacking Support**: Allows multiple popups to be displayed, with the ability to close them in the reverse order of opening.


## How it Works

1.  **Initialization**: The `DynamicPopupModuleLoader` component is typically included once in the main application layout (e.g., within `Layout.tsx`). It initializes and subscribes to the `TOPICS.SHOW_DIALOG_FEATURE` pub/sub topic upon mounting.
2.  **Subscription**: It listens for messages published on the `TOPICS.SHOW_DIALOG_FEATURE` topic.
3.  **Triggering a Popup**: Any component in the application can trigger a popup by publishing a message to `TOPICS.SHOW_DIALOG_FEATURE`. The message payload must include:
    *   `feature`: The name of the module to load (must be one of the keys in `ModuleNameType` and configured in `moduleList` and `DefaultOptions`).
    *   `options` (optional): An object containing props to pass directly to the dynamically loaded module component.
    *   `resultTopic` (optional): A unique pub/sub topic name (string). If provided, the `DynamicPopupModuleLoader` will publish the result/response from the closed module to this topic.
4.  **Dynamic Loading**: Upon receiving a valid message, the component:
    *   Adds the module details to its internal state (`moduleData`).
    *   Uses `next/dynamic` to lazy-load the specified module component (defined in `moduleList`). A loading spinner (`Loading` component) is displayed while the module loads.
    *   Retrieves default configurations (like `popupStyle`, `title`, `props`, styling) for the module from `DefaultOptions`.
5.  **Rendering**: It renders the loaded module inside a Chakra UI `Modal` or `Drawer` component based on the `popupStyle` configuration. Default styles and behaviors (like overlay, close button) are applied but can be customized via `DefaultOptions`.
6.  **Interaction & Closing**: The user interacts with the loaded module. The module itself should provide a way to close (e.g., a close button or completing an action). It calls the `onClose` prop passed down by `DynamicPopupModuleLoader`, optionally passing a result payload.
7.  **Result Publishing**: When a popup is closed:
    *   The `onPopupClose` handler in `DynamicPopupModuleLoader` is triggered.
    *   If a `resultTopic` was provided when triggering the popup, the `DynamicPopupModuleLoader` publishes the result received from the module to that specific topic.
    *   The module is removed from the `moduleData` state, effectively closing the popup.


## How to Use It (Directly via Pub/Sub)

```typescript
import { usePubSub } from "contexts";
import { Button } from "components/Button"; // Assuming a custom Button component
import { TOPICS } from "constants/PubSubTopics"; // Assuming TOPICS are defined here
import { ModuleNameType } from "layout-components/DynamicPopupModuleLoader"; // Import the type

// Example component triggering the Feedback popup
const MyComponent = (): JSX.Element => {
	const { publish, subscribe } = usePubSub();

	const handleOpenFeedback = (): void => {
		const resultTopic = `FEEDBACK_RESULT_${Date.now()}`; // Unique topic for this instance

		// Subscribe to the result topic *before* publishing the show dialog event
		const unsubscribe = subscribe(resultTopic, (result: any) => {
			console.log("Feedback popup closed with result:", result);
			// Handle the result (e.g., show a success message)
			unsubscribe(); // Clean up the subscription
		});

		publish(TOPICS.SHOW_DIALOG_FEATURE, {
			feature: "Feedback" as ModuleNameType, // Cast to ensure type safety if needed
			options: { /* Optional props for Feedback component */ },
			resultTopic: resultTopic,
		});
	};

	return <Button onClick={handleOpenFeedback}>Open Feedback</Button>;
};

export default MyComponent;
```

## Creating Custom Hooks for Easier Usage

Managing the pub/sub logic directly (creating unique result topics, subscribing, unsubscribing) in every component that needs a popup can be repetitive and error-prone. Creating custom hooks abstracts this logic away.

**1. Generic Hook (`useDynamicPopup`)**

This hook encapsulates the core logic of triggering a popup and waiting for its result using Promises.

```typescript
// helpers/useDynamicPopup.ts
import { usePubSub } from "contexts";
import { TOPICS } from "constants/PubSubTopics";
import { ModuleNameType } from "layout-components/DynamicPopupModuleLoader";
import { useCallback } from "react";

interface TriggerPopupOptions {
	options?: object; // Props for the module
}

/**
 * Generic hook to trigger any dynamic popup and receive its result via a Promise.
 * @template TResult - The expected type of the result from the popup module.
 * @returns A function to trigger a popup.
 */
export const useDynamicPopup = <TResult = any>(): ((
	feature: ModuleNameType,
	triggerOptions?: TriggerPopupOptions
) => Promise<TResult>) => {
	const { publish, subscribe } = usePubSub();

	const triggerPopup = useCallback(
		(
			feature: ModuleNameType,
			triggerOptions?: TriggerPopupOptions
		): Promise<TResult> => {
			return new Promise((resolve) => {
				const resultTopic = `${feature}_RESULT_${Date.now()}_${Math.random()}`; // Unique topic

				const unsubscribe = subscribe(resultTopic, (result: TResult) => {
					console.log(
						`Received result for ${feature} on topic ${resultTopic}:`,
						result
					);
					resolve(result ?? ({} as TResult)); // Resolve with result or empty object
					unsubscribe(); // Clean up subscription
				});

				console.log(
					`Publishing SHOW_DIALOG_FEATURE for ${feature}, resultTopic: ${resultTopic}`
				);
				publish(TOPICS.SHOW_DIALOG_FEATURE, {
					feature: feature,
					options: triggerOptions?.options ?? {},
					resultTopic: resultTopic,
				});
			});
		},
		[publish, subscribe]
	);

	return triggerPopup;
};
```

**2. Specific Hooks (Example: `useFeedbackPopup`)**

Create specific hooks for each module type for better type safety and developer experience.

```typescript
// hooks/useFeedbackPopup.ts
import { useDynamicPopup } from "helpers/useDynamicPopup"; // Adjust path if needed
import { useCallback } from "react";

// Define expected props for the Feedback component if known
interface FeedbackOptions {
	initialMessage?: string;
	// ... other specific options for Feedback
}

// Define expected result type from the Feedback component if known
interface FeedbackResult {
	success: boolean;
	messageId?: string;
	// ... other result properties
}

/**
 * Hook to specifically trigger the Feedback popup.
 * @returns A function to open the Feedback popup, optionally passing options.
 */
export const useFeedbackPopup = (): ((
	options?: FeedbackOptions
) => Promise<FeedbackResult>) => {
	const triggerPopup = useDynamicPopup<FeedbackResult>();

	const openFeedbackPopup = useCallback(
		(options?: FeedbackOptions): Promise<FeedbackResult> => {
			return triggerPopup("Feedback", { options });
		},
		[triggerPopup]
	);

	return openFeedbackPopup;
};

// hooks/useFileViewerPopup.ts
import { useDynamicPopup } from "helpers/useDynamicPopup";
import { useCallback } from "react";

interface FileViewerOptions {
	fileUrl: string;
	fileName?: string;
	// ... other specific options for FileViewer
}

// FileViewer might not return a specific result, or just a confirmation
interface FileViewerResult {
	viewed?: boolean;
}

/**
 * Hook to specifically trigger the FileViewer popup.
 * @returns A function to open the FileViewer popup, passing required options.
 */
export const useFileViewerPopup = (): ((
	options: FileViewerOptions
) => Promise<FileViewerResult>) => {
	const triggerPopup = useDynamicPopup<FileViewerResult>();

	const openFileViewerPopup = useCallback(
		(options: FileViewerOptions): Promise<FileViewerResult> => {
			// Add validation if needed: if (!options?.fileUrl) throw new Error("fileUrl is required");
			return triggerPopup("FileViewer", { options });
		},
		[triggerPopup]
	);

	return openFileViewerPopup;
};

// --- Add similar hooks for ImageEditor, Camera, Notifications ---
```

**3. Using the Specific Hooks**

```typescript
import { Button } from "components/Button";
import { useFeedbackPopup } from "hooks/useFeedbackPopup"; // Adjust path
import { useFileViewerPopup } from "hooks/useFileViewerPopup"; // Adjust path

const MyComponentWithHooks = (): JSX.Element => {
	const openFeedback = useFeedbackPopup();
	const openFileViewer = useFileViewerPopup();

	const handleOpenFeedback = async (): Promise<void> => {
		try {
			const result = await openFeedback({ initialMessage: "Hello!" });
			console.log("Feedback Result:", result);
			if (result?.success) {
				// Show success toast
			}
		} catch (error) {
			console.error("Error opening feedback popup:", error);
		}
	};

	const handleOpenFile = async (): Promise<void> => {
		try {
			const result = await openFileViewer({ fileUrl: "/path/to/file.pdf", fileName: "My Document" });
			console.log("File Viewer Result:", result);
		} catch (error) {
			console.error("Error opening file viewer popup:", error);
		}
	};

	return (
		<>
			<Button onClick={handleOpenFeedback}>Open Feedback (Hook)</Button>
			<Button onClick={handleOpenFile}>Open File (Hook)</Button>
		</>
	);
};

export default MyComponentWithHooks;
```

## How to Add a New Module

1.  **Create the Module Component**: Create a new component for the module you want to add. Ensure it follows the expected structure and props. Example: [RaiseIssueCard.tsx](page-components/RaiseIssueCard/RaiseIssueCard.tsx).
2.  **Update `moduleList`**: Add the new module to the `moduleList` in `DynamicPopupModuleLoader.tsx`. Ensure the key matches the `feature` string used when triggering the popup.
3.  **Update `DefaultOptions`**: Add default options for the new module in `DefaultOptions` to ensure consistent styling and behavior.
4.  **Create a Custom Hook (Optional)**: If the module is complex or requires specific props, consider creating a custom hook (like [useRaiseIssue](hooks/useRaiseIssue.js)) to simplify its usage.
