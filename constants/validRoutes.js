// If you want to use any route without login just add it in the publiclink array.
const publicLinks = ["/", "/oldicons", "/newicons", "/test"];

const baseRoute = {
	admin: "/admin",
};

const initialRoute = {
	admin: "/admin",
	"non-admin": "/home",
};

export { publicLinks, baseRoute, initialRoute };
