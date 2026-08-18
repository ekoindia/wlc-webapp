# Feature: Notifications

Notifications are messages delivered to the logged-in user (announcements, feedback polls, ads, commands). They are surfaced in three places:

1. A **bell icon** with an unread-count bubble in the top NavBar.
2. A **toast** popup for the latest unread notification.
3. A **NotificationWidget** list on the Home page (and an overlay panel showing all notifications).

All state is managed centrally by `NotificationContext`, which any component can read via the `useNotification()` hook.

## 1. How Pull Notifications Work

There is **no push/websocket**. Notifications are **pulled** from the server on an interval.

### Fetch loop
- Managed in the `useNotifications()` hook inside [contexts/NotificationContext.js](contexts/NotificationContext.js).
- On login, `fetchNotifications()` runs once immediately, then a `setInterval` re-fetches **every 10 minutes** (`600000` ms).
- On logout, the interval is cleared and the notification list is emptied.

	```javascript
	// contexts/NotificationContext.js
	useEffect(() => {
		let _interval;
		if (isLoggedIn) {
			fetchNotifications(); // fetch immediately on login
			if (!intervalId) {
				_interval = setInterval(() => {
					fetchNotifications();
				}, 600000); // 10 minutes
				setIntervalId(_interval);
			}
		} else {
			if (intervalId) {
				clearInterval(intervalId);
				setIntervalId(null);
			}
			setNotifications([]);
		}
		return () => clearInterval(_interval);
	}, [isLoggedIn, userId]);
	```

### The fetch request
- `fetchNotifications()` POSTs to `${NEXT_PUBLIC_API_BASE_URL}/transactions/do` via the `fetcher` helper.
- Body: `{ interaction_type_id: TransactionTypes.GET_NOTIFICATIONS }`, authenticated with the session `accessToken`.
- Response is handled by `handleNotificationsResponse()`.

### Processing the response
`handleNotificationsResponse()` walks the returned list and, per item:
- Runs `processNotification()` — sets a default `notification_type` and parses any `poll` string into an options array.
- Buckets each item by type:
	- `NOTIF_TYPE.NORMAL (0)` → `notifications` state (drives the widget + bell).
	- `NOTIF_TYPE.AD (2)` → `ads` state.
	- (`COMMAND` and `CUSTOMER_AD` types exist but are not surfaced in the widget.)
- Counts totals and unread count (`notificationCount`, `adCount`, `unreadNotificationCount`).
- Marks freshly-delivered items as **delivered via pull**: if `delivery_status == 0`, calls `updateEMS({ interaction_type_id: 10023, notification_id, delivery_status: 2 })`.
- `sanitizeList()` de-duplicates identical entries and trims to per-type limits (`NORMAL` = 50, `AD` = 15).

### Type constants
Defined at the top of [contexts/NotificationContext.js](contexts/NotificationContext.js):
- `NOTIF_TYPE` — `NORMAL(0)`, `COMMAND(1)`, `AD(2)`, `CUSTOMER_AD(3)`.
- `NOTIF_STATUS_UPDATE` — `READ(1)`, `DISMISSED(2)`.
- `NOTIF_TYPE_META` — per-type `label` and `limit`.

### Read / status updates
- `openNotification(id)` sets the opened notification and, if unread, calls `markAsRead(id)`.
- `markAsRead()` optimistically flips `read: 1` in local state, then persists via `updateNotifStatus(id, READ)` → `updateEMS({ interaction_type_id: 10012, ... })`.

### Provider wiring
- `NotificationProvider` wraps the app and exposes state through `useNotification()`.
- `useNotification()` throws if used outside the provider.
- Notifications are also registered as **CommandBar (KBar) actions** via `setupKbarNotificationActions()`, so they are searchable from global search.

## 2. How the UI is Rendered

Three consumers read the same context.

### a) NavBar bell icon
- [components/NavBar/NavBar.jsx](components/NavBar/NavBar.jsx) (lines 66–70 and 166–178).
- Reads `notificationCount`, `unreadNotificationCount`, `openNotificationPanel` from `useNotification()`.
- The bell only renders when `notificationCount` is truthy:
	- Icon is `notifications` (filled) when there are unread items, else `notifications-none` (outline).
	- The `bubble` prop shows the unread count; `onClick` opens the notification panel via `openNotificationPanel()`.

	```jsx
	// components/NavBar/NavBar.jsx (166-178)
	{notificationCount ? (
		<Ico
			iconName={
				unreadNotificationCount ? "notifications" : "notifications-none"
			}
			bubble={unreadNotificationCount || ""}
			navstyle={orgDetail?.metadata?.theme?.navstyle}
			onClick={openNotificationPanel}
		/>
	) : null}
	```

### b) Toast for the latest notification
- Handled inside the context by `processLatestNotification()`, triggered by a `useEffect` on the `notifications` array.
- Shows a Chakra `toast` for the newest unread item, unless it was already shown (tracked in `wlcNotifSettings` localStorage via `notifSettings.last_notif_id` + `userId`).
- Duration: **1 hour** for high-priority (`priority >= 3`), otherwise **8 seconds**.
- Clicking the toast body calls `openNotification(id)` (which opens the detail modal and marks it read).

### c) NotificationWidget (Home page + overlay panel)
- [page-components/Home/NotificationWidget/NotificationWidget.jsx](page-components/Home/NotificationWidget/NotificationWidget.jsx).
- Reads `notifications`, `openedNotification`, `openNotification`, `closeNotification`, `openNotificationPanel` from context.
- Props: `title`, `compactMode`, `unreadOnly`. When `unreadOnly` is set, only unread items are listed and a **"Show All"** link opens the full panel via `openNotificationPanel()`.
- Renders `null` when there are no (matching) notifications.
- **List item** — each row shows a `NotificationThumbnail` (image / YouTube thumbnail / fallback icon, with a blue dot when unread), the title, and up to 3 non-empty lines of `desc`. Read items are dimmed; high-priority items get a colored left border. Clicking a row calls `openNotification(notif.id)`.
- **Detail modal** — when `openedNotification` is set, a Chakra `Modal` renders the full title, description (line-split), an optional link button (`openUrl`), an optional image (`showImage`), an optional `YoutubePlayer`, and the formatted `notify_time` in the footer. Closed via `closeNotification()`.

### Data flow summary

```
server ──(pull every 10 min)──▶ fetchNotifications()
                                      │
                                      ▼
                        handleNotificationsResponse()
                         (process, bucket, count, dedupe)
                                      │
                                      ▼
                          NotificationContext state
                    ┌─────────────────┼─────────────────┐
                    ▼                 ▼                 ▼
              NavBar bell        Toast (latest)   NotificationWidget
             (unread count)                        (list + modal)
```
