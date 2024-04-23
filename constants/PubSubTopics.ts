/**
 * List of topics for PubSub. Add more as needed.
 * To use PubSub, use the `usePubSub` hook.
 */
export const PubSubTopics = {
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
