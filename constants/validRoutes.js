// TODO: add the routes in [constants/Routes.ts](constants/Routes.ts) with `isPrivate: false`.

// These pages can be visited by both logged-in and logged-out (public) users
const publicLinks = ["/privacy", "/delete_my_account", "/icons_demo"];

// These links can be visited only by logged-out (public) users
const publicOnlyLinks = ["/"];

const baseRoute = {
	admin: "/admin",
};

const initialRoute = {
	admin: "/admin",
	"non-admin": "/home",
};

export { baseRoute, initialRoute, publicLinks, publicOnlyLinks };
