// TODO: add the routes in [constants/Routes.ts](constants/Routes.ts) with `isPrivate: false`.
// NOTE: The `components/RouteProtecter` component is used to protect the private routes and give access to route according to user role.

// These pages can be visited by both logged-in and logged-out (public) users
const publicLinks = [
	"/privacy",
	"/delete_my_account",
	"/icons_demo",
	"/test",
	"/gateway",
];

// These links can be visited only by logged-out (public) users
const publicOnlyLinks = ["/"];

// Public sections, i.e., any sub-route of these starting-routes can be visited by both logged-in and logged-out (public) users
const publicSections = ["gateway"];

const baseRoute = {
	admin: "/admin",
};

const initialRoute = {
	admin: "/admin",
	"non-admin": "/home",
};

export {
	baseRoute,
	initialRoute,
	publicLinks,
	publicOnlyLinks,
	publicSections,
};
