const NOTIF_TYPE = {
	NORMAL: 0,	// Normal notification message
	COMMAND: 1,	// Command. Eg: Clear Cache or Reload App (Show "App Updated" Notification?)
	AD: 2,		// Advertisement
};

// const DEFAULT_ICON = '/images/touch/icon-128x128.png';
// const DEFAULT_BADGE_ICON = '/images/touch/badge-96x96.png';
const DEFAULT_TAG = ['eloka-notif-low', 'eloka-notif-low', 'eloka-notif', 'eloka-notif-high'];
const AD_TAG = 'eloka-ad';


/**
 * Push important text to first line by removing the first line-breaks.
 * Eg: "Dear Partner,\n\nOffer for you..."  -->  "Dear Partner, Offer..."
 * @param d
 */
function _processDesc(d)
{
	return d ? d.replace(/([^\r\n\t]{2,20})[\r\n\t]+/, "$1 ") : "";
}


/**
 *
 * @param registration
 * @param data
 */
function showNotification(registration, data)
{
	var priority = +(data.priority || 0);
	const type = +(data.notification_type || 0);
	var title = data.title;
	var desc = data.desc;

	var _img = data.image ? data.image :
		data.youtube ? "https://img.youtube.com/vi/" + data.youtube + "/0.jpg" :
		null;

	var timestamp = null;
	if (data.notify_time) {
		timestamp = (new Date(data.notify_time)).getTime();
	}

	if (data.is_updated) {
		priority = 0;
		title = "App updated";
		desc = "";
		_img = null;
		timestamp = null;
	}

	var tag = DEFAULT_TAG[priority];
	var requireInteraction = priority >= 3 ? true : false;
	var silent = priority >= 3 ? false : true;
	var _actions = [];

	if (type == NOTIF_TYPE.AD) {
		tag = AD_TAG;
		requireInteraction = false;
		silent = true;
		desc = "";
	}

	// Notification actions...
	if (!data.is_updated) {
		if (data.poll) {
			_actions.push({ action: "open", title: "Reply" });
		}
		if (data.link && data.link_label) {
			_actions.push({
				action: "link",
				title: (data.link_label ? data.link_label : data.link)
			});
		}
		if (data.youtube) {
			_actions.push({ action: "video", title: "Watch Video" });
		}
		if (_actions.length === 0) {
			_actions.push({ action: "open", title: "Open" });
		}
	}

	return registration.showNotification(title, {			// "Connect: " + data.title
		body: _processDesc(desc),
		icon: DEFAULT_ICON,
		badge: DEFAULT_BADGE_ICON,
		image: (_img ? _img : undefined),
		tag: tag,
		renotify: (priority >= 2 ? true : false),
		requireInteraction: requireInteraction,
		silent: silent,
		data: {id:data.id, link:data.link},
		actions: _actions,
		timestamp: timestamp
	});
}

/**
 * Register push notification listener
 */
self.addEventListener('push', function(event) {
	event.waitUntil(
		// This block must resolve into a promise, or, you get error notification: "This page was updated in the background" (https://developers.google.com/web/updates/2015/03/push-notifications-on-the-open-web?hl=en)
		new Promise(function(resolve) {
			let data = {};
			if (event.data) {
				try {
					data = event.data.json();
				} catch (_e) {
					data = {};
				}
			}

			self.clients.matchAll({type:'window'}).then(function(clientList) {
				// Show system notification if web app is not already open
				const ln_clients = clientList.length;
				let focused = false;

				for (let i = 0 ; i < ln_clients ; i++) {
					clientList[i].postMessage({
						type: "push",
						client: {
							visibilityState: clientList[i].visibilityState,
							focused: clientList[i].focused
						},
						data: data
					});
					if (clientList[i].focused) {
						focused = true;
					}
				}

				if (focused === false || ln_clients == 0) {
					// Show system notification...
					showNotification(self.registration, data).then(function() {
						resolve();
					}, function() {
						resolve();
					});
				} else {
					resolve();
				}
			}, function(error_reason) {
				// Show system notification...
				console.error("[sw.js] Error getting clients: ", error_reason);
				showNotification(self.registration, data).then(function() {
					resolve();
				}, function() {
					resolve();
				});
			});
		})
	);
});