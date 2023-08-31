import { ANDROID_ACTION, doAndroidAction } from "utils";

/**
 * Function to initiate printing of page / receipt / etc.
 */
export const printPage = (
	page_title,
	isAndroid = false
	// analytics_action,
	// analytics_label
) => {
	page_title = page_title || "";
	const title_original = document.title;
	const _dt = new Date();
	const title_print =
		page_title +
		" " +
		_dt.getFullYear() +
		"-" +
		(_dt.getMonth() + 1) +
		"-" +
		_dt.getDate() +
		" " +
		_dt.getHours() +
		":" +
		_dt.getMinutes() +
		":" +
		_dt.getSeconds();

	if (isAndroid) {
		doAndroidAction(ANDROID_ACTION.PRINT_PAGE, title_print);
	} else {
		document.title = title_print;

		window.print();

		document.title = title_original;
	}

	// Google Analytics
	// this.fire("iron-signal", {
	// 	name: "track-event",
	// 	data: {
	// 		category: "print",
	// 		action: analytics_action || "",
	// 		label: analytics_label || "",
	// 	},
	// });
};
