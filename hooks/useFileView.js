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

	/**
	 * Show an image in the FileViewer dialog.
	 * @param {string} url - The URL of the image to show.
	 * @param {object} [options] - Options to pass to the dialog.
	 */
	const showImage = (url, options) => publishTopic("image", url, options);

	/**
	 * Show any audio/video media like YouTube, Vimeo, SoundCloud, local files, etc.
	 * @param {string} url - The URL of the media to show.
	 * @param {object} [options] - Options to pass to the dialog.
	 */
	const showMedia = (url, options) => publishTopic("media", url, options);

	/**
	 * Show an external webpage in an iframe.
	 * @param {string} url - The URL of the webpage to show.
	 * @param {object} [options] - Options to pass to the dialog.
	 */
	const showWebpage = (url, options) => publishTopic("url", url, options);

	return { showImage, showMedia, showWebpage };
};

export default useFileView;
