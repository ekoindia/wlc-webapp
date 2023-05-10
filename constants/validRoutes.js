// If you want to use any route without login just add it in the publiclink array.
const publicLinks = ["/", "/icons_demo"];

const baseRoute = {
	admin: "/admin",
};

const initialRoute = {
	admin: "/admin",
	"non-admin": "/home",
};

export { publicLinks, baseRoute, initialRoute };
