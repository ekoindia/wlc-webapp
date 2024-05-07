import { usePubSub } from "contexts";

/**
 * Hook to open FileViewer dialog to view: images, audio, video, HTML, embedded webpage, etc.
 */
const useFileView = () => {
	const { publish, /* subscribe, */ TOPICS } = usePubSub();

	const publishTopic = (type, url, options) => {
		publish(TOPICS.SHOW_DIALOG_FEATURE, {
			feature: "FileViewer",
			options: {
				file: url,
				type: type || undefined,
				options: options,
			},
		});
	};

	const showImage = (url, options) => publishTopic("image", url, options);

	/**
	 * Show any audio/video media like YouTube, Vimeo, SoundCloud, local files, etc.
	 * @param {string} url - The URL of the media to show.
	 * @param {object} [options] - Options to pass to the dialog.
	 * @returns
	 */
	const showMedia = (url, options) => publishTopic("media", url, options);

	return { showImage, showMedia };
};

export default useFileView;
