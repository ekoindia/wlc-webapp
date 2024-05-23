/**
 * List of topics for PubSub. Add more as needed.
 * To use PubSub, use the `usePubSub` hook.
 */
export const PubSubTopics = {
	/**
	 * Trigger global dialog-based features:
	 * - Show "Raise Issue" dialog
	 * - Show "Camera" dialog for image capture
	 * - Show "File Viewer" dialog for viewing images, videos, or embedded web-pages
	 */
	SHOW_DIALOG_FEATURE: "show.dialog.feature",

	/**
	 * Android-action response listener.
	 * Any response coming from the Android app will be pushed to this topic.
	 */
	ANDROID_RESPONSE: "android.response",

	/**
	 * Show "Raise Issue" dialog.
	 */
	SHOW_RAISE_ISSUE: "show.raise.issue",
};
