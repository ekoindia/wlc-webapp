// TODO: add the routes in [constants/Routes.ts](constants/Routes.ts) with `isPrivate: false`.

// If you want to use any route without login just add it in the publiclink array.
const publicLinks = ["/", "/privacy", "/icons_demo", "/delete_my_account"];

const baseRoute = {
	admin: "/admin",
};

const initialRoute = {
	admin: "/admin",
	"non-admin": "/home",
};

export { publicLinks, baseRoute, initialRoute };
