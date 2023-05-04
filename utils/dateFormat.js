const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const WEEKDAYS_FULL = [
	"Sunday",
	"Monday",
	"Tuesday",
	"Wednesday",
	"Thursday",
	"Friday",
	"Saturday",
];
const MONTHS = [
	"",
	"Jan",
	"Feb",
	"Mar",
	"Apr",
	"May",
	"Jun",
	"Jul",
	"Aug",
	"Sep",
	"Oct",
	"Nov",
	"Dec",
];
const MONTHS_FULL = [
	"",
	"January",
	"February",
	"March",
	"April",
	"May",
	"June",
	"July",
	"August",
	"September",
	"October",
	"November",
	"December",
];

/**
 * Utility function to pad a number with leading zeros
 * @param {number} value - The number to pad
 * @param {number} pad_length - The length of the final string
 * @returns {string} - The padded string
 * @example
 * pad(1); // "01"
 * pad(1, 3); // "001"
 * pad(12345, 3); // "12345"
 */
const pad = (value, pad_length = 2) => {
	return value.toString().padStart(pad_length, "0");
};

/**
 * Get the "when" string for the given Date object. Eg: "Today", "Yesterday", "Tomorrow".
 * @param {Date} date - The Date object
 * @param {boolean} brackets - If true, the "when" string is enclosed in brackets. Defaults to false.
 * @returns {string} - The "when" string
 * @example
 * getWhenString(new Date()); // "Today"
 * getWhenString(new Date(Date.now() - 24 * 60 * 60 * 1000)); // "Yesterday"
 * getWhenString(new Date(Date.now() + 24 * 60 * 60 * 1000)); // "Tomorrow"
 */
export const getWhenString = (date, brackets) => {
	if (!date) return "";
	const today = new Date();
	const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
	const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);

	let when = "";

	if (date.toDateString() === today.toDateString()) {
		when = "Today";
	} else if (date.toDateString() === yesterday.toDateString()) {
		when = "Yesterday";
	} else if (date.toDateString() === tomorrow.toDateString()) {
		when = "Tomorrow";
	}

	return brackets && when ? `(${when})` : when;
};

/**
 * Formats a date string.
 * @param {string} dateString - The date-time string
 * @param {string} format - The date-time format (specified as Java SimpleDateFormat specifiers). Defaults to `dd/MM/yyyy`.
 * @returns {string} - Formatted date string. Returns empty string if the input string is empty. Returns the input string if it is not a valid date-time string.
 * @example
 * formatDateTime("2017-01-13"); // "13/01/2017"
 * formatDateTime("2017-01-13", "dd MMM yyyy"); // "13 Jan 2017"
 * formatDateTime("a/b/c"); // "a/b/c"
 */
export const formatDate = (dateString, format = "dd/MM/yyyy") =>
	formatDateTime(dateString, format);

/**
 * Formats a date-time string.
 * @param {string} dateString - The date-time string
 * @param {string} format - The date-time format (specified as Java SimpleDateFormat specifiers). Defaults to `dd/MM/yyyy hh:mm a`.
 * @returns {string} - Formatted date-time string. Returns empty string if the input string is empty. Returns the input string if it is not a valid date-time string.
 * @example
 * formatDateTime("2017-01-13T16:14:24+05:30"); // "13/01/2017 04:14 PM"
 * formatDateTime("2017-01-13T16:14:24+05:30", "dd MMM yyyy"); // "13 Jan 2017"
 * formatDateTime("2017-01-13"); // "13/01/2017"
 * formatDateTime("a/b/c"); // "a/b/c"
 */
export const formatDateTime = (dateString, format = "dd/MM/yyyy hh:mm AA") => {
	if (!dateString) return "";

	const dateObj = new Date(dateString);
	if (isNaN(dateObj)) {
		return dateString;
	}

	const year = dateObj.getFullYear();
	const month = dateObj.getMonth() + 1;
	const date = dateObj.getDate();
	const hours = dateObj.getHours();
	const minutes = dateObj.getMinutes();
	const seconds = dateObj.getSeconds();
	const weekDay = dateObj.getDay();
	let a, am, A, AM;
	if (hours >= 12) {
		a = "p";
		am = "pm";
		A = "P";
		AM = "PM";
	} else {
		a = "a";
		am = "am";
		A = "A";
		AM = "AM";
	}
	const formattedDate = format
		.replace(/yyyy/g, year)
		.replace(/yy/g, year.toString().slice(-2))
		.replace(/y/g, year)
		.replace(/MMMM/g, MONTHS_FULL[month])
		.replace(/MMM/g, MONTHS[month])
		.replace(/MM/g, pad(month))
		.replace(/M/g, month)
		.replace(/dddd/g, WEEKDAYS_FULL[weekDay])
		.replace(/ddd/g, WEEKDAYS[weekDay])
		.replace(/dd/gi, pad(date))
		.replace(/d/gi, date)
		.replace(/HH/g, pad(hours))
		.replace(/H/g, hours)
		.replace(/hh/g, pad(hours % 12 || 12))
		.replace(/h/g, hours % 12 || 12)
		.replace(/mm/g, pad(minutes))
		.replace(/m/g, minutes)
		.replace(/ss/g, pad(seconds))
		.replace(/s/g, seconds)
		// .replace(/SSS/g, pad(dateObj.getMilliseconds(), 3))
		.replace(/aa/g, am)
		.replace(/a/g, a)
		.replace(/AA/g, AM)
		.replace(/A/g, A)
		.replace(/EEEE/g, WEEKDAYS_FULL[weekDay])
		.replace(/EEE/g, WEEKDAYS[weekDay])
		.replace(/EE/g, pad(weekDay))
		.replace(/E/g, weekDay)
		.replace(/(WHEN)/g, getWhenString(dateObj, true).toUpperCase())
		.replace(/WHEN/g, getWhenString(dateObj).toUpperCase())
		.replace(/(when)/g, getWhenString(dateObj, true))
		.replace(/when/g, getWhenString(dateObj))
		.replace(
			/S/g,
			["th", "st", "nd", "rd"][
				date % 10 > 3
					? 0
					: (((date % 100) - (date % 10) != 10) * date) % 10
			]
		);
	return formattedDate;
};
