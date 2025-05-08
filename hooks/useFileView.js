import { useDynamicPopup } from "hooks";

/**
 * Hook to open FileViewer dialog to view: images, audio, video, HTML, embedded webpage, etc.
 */
const useFileView = () => {
	const { showDialog } = useDynamicPopup("FileViewer");

	const show = (type, url, options) =>
		showDialog({
			file: url,
			type: type || undefined,
			options: options,
		});

	/**
	 * Show an image in the FileViewer dialog.
	 * @param {string} url - The URL of the image to show.
	 * @param {object} [options] - Options to pass to the dialog.
	 */
	const showImage = (url, options) => show("image", url, options);

	/**
	 * Show any audio/video media like YouTube, Vimeo, SoundCloud, local files, etc.
	 * @param {string} url - The URL of the media to show.
	 * @param {object} [options] - Options to pass to the dialog.
	 */
	const showMedia = (url, options) => show("media", url, options);

	/**
	 * Show an external webpage in an iframe.
	 * @param {string} url - The URL of the webpage to show.
	 * @param {object} [options] - Options to pass to the dialog.
	 */
	const showWebpage = (url, options) => show("url", url, options);

	/**
	 * Show any file in the FileViewer dialog, based on the file extension.
	 * @param {string} url - The URL of the file to show.
	 * @param {object} [options] - Options to pass to the dialog.
	 */
	const showFile = (url, options) => {
		const type = options?.type;
		show(type, url, options);
	};

	return { showImage, showMedia, showWebpage, showFile };
};

export default useFileView;
