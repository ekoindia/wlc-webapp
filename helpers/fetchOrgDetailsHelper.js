/**
 * @description This helper is used to fetch the org detail associated with a (sub)domain on server-side only (inside getServerSideProps)
 * - It caches the org details for 24 hours
 * - It caches invalid (sub)domains for 24 hours or until the cache size is more than 1000
 */

import { Endpoints } from "constants/EndPoints";

// Cache the org details on the server...
const ORG_CACHE = {};

// Cache for invalid (sub)domains...
const INVALID_DOMAIN_CACHE = new Set();

// Last cached-bust time for invalid domains
let LAST_INVALID_DOMAIN_CACHE_BUST_TIME = Date.now();

// Cache expiry time in milliseconds
const CACHE_EXPIRY_TIME = 1000 * (process.env.ORG_CACHE_EXPIRY_SEC || 0);

// Response data, if org not found
const invalidOrg = {
	notFound: true,
};

// To strip quotes from theme color in local
const stripQuotes = (str) => (str ? str.replace(/^['"]|['"]$/g, "") : str);

/**
 * Mock org details (used in development)
 */
export const MockOrgDetails = {
	org_id: process.env.WLC_ORG_ID || 2,
	app_name: process.env.WLC_APP_NAME || "Wlc",
	org_name: process.env.WLC_ORG_NAME || "Wlc",
	logo: process.env.WLC_LOGO,
	metadata: {
		support_contacts: { email: "xyz@com", phone: "0123456789" },
		theme: {
			navstyle: process.env.THEME_NAVSTYLE || "", // light or dark (default)
			primary: stripQuotes(process.env.THEME_PRIMARY) || "",
			primary_dark: stripQuotes(process.env.THEME_PRIMARY_DARK) || "",
			primary_light: stripQuotes(process.env.THEME_PRIMARY_LIGHT) || "",
			accent: stripQuotes(process.env.THEME_ACCENT) || "",
			accent_dark: stripQuotes(process.env.THEME_ACCENT_DARK) || "",
			accent_light: stripQuotes(process.env.THEME_ACCENT_LIGHT) || "",
		},
		cms_meta: {
			type: process.env.CMS_TYPE || undefined,
		},
		cms_data: {
			img: process.env.CMS_IMG || undefined,
		},
	},
	login_types: {
		google: {
			default: process.env.USE_DEFAULT_GOOGLE_LOGIN === "true",
			client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || undefined,
		},
	},
};

/**
 * Fetch org details from API (using cache)
 * This is used on server-side only
 * @param {string} host	Hostname of the request
 * @param {boolean} force	Force fetch from API (after clearing the cache)
 * @returns {object} org details or {notFound: true} if org not found
 */
export const fetchOrgDetails = async (host, force) => {
	if (process.env.NEXT_PUBLIC_ENV === "development") {
		if (process.env.WLC_MOCK_HOST) {
			// Mock hostname to get details from server
			host = process.env.WLC_MOCK_HOST;
		} else {
			// Mock data for development
			return {
				props: {
					data: MockOrgDetails,
				},
			};
		}
	}

	if (!host) {
		return {
			...invalidOrg,
			props: {
				reason: "No host detected: " + host,
			},
		};
	}

	const subdomainRootHost = "." + (process.env.WLC_SUBDOMAIN_ROOT || "xxxx");
	let domain = "";
	let subdomain = "";

	// Extract domain or subdomain from the host
	if (host.endsWith(subdomainRootHost)) {
		// Subdomain root found. Extract subdomain from host
		subdomain = host.slice(0, -subdomainRootHost.length);
	} else {
		// Subdomain root not found. Get the whole host as domain
		domain = host;
	}

	if (!(domain || subdomain)) {
		return {
			...invalidOrg,
			props: {
				reason: "Couldn't parse (sub)domain. Host = " + host,
			},
		};
	}

	// Check cache for valid (sub)domain
	let orgDetails = ORG_CACHE[domain || subdomain];

	// Prevent DOS attack when users keep hitting invalid domains
	const DOS_ATTACK_DELAY = 3000; // Delay in milliseconds

	// Check cache for invalid (sub)domain
	if (
		force !== true &&
		!orgDetails &&
		INVALID_DOMAIN_CACHE.has(domain || subdomain)
	) {
		// Bust the cache for invalid domains every 24 hours
		// Also bust the cache if the cache size is more than 1000
		if (
			Date.now() - LAST_INVALID_DOMAIN_CACHE_BUST_TIME >
				CACHE_EXPIRY_TIME ||
			INVALID_DOMAIN_CACHE.size > 1000
		) {
			INVALID_DOMAIN_CACHE.clear();
			LAST_INVALID_DOMAIN_CACHE_BUST_TIME = Date.now();
		} else {
			// Delay the response for invalid domains to prevent DOS attack
			await new Promise((resolve) =>
				setTimeout(resolve, DOS_ATTACK_DELAY)
			);
			return {
				...invalidOrg,
				props: {
					reason: "Org not found",
					cached: true,
				},
			};
		}
	}

	// If org details not found in cache, or the cache is expired, fetch from API
	if (
		force == true ||
		!orgDetails ||
		orgDetails?.cache_expires < Date.now()
	) {
		// Fetch org details from API
		orgDetails = await fetchOrgDetailsfromApi(domain, subdomain);

		console.log("Fetched Org details::: ", orgDetails, force);

		// Process metadata: convert string to JSON
		if (
			orgDetails?.metadata?.support_contacts &&
			typeof orgDetails?.metadata?.support_contacts === "string"
		) {
			try {
				orgDetails.metadata.support_contacts = JSON.parse(
					orgDetails.metadata.support_contacts
				);
			} catch (e) {
				console.error("Error parsing support_contacts: ", e);
				orgDetails.metadata.support_contacts = {};
			}
		}

		if (
			orgDetails?.metadata?.theme &&
			typeof orgDetails?.metadata?.theme === "string"
		) {
			try {
				orgDetails.metadata.theme = JSON.parse(
					orgDetails.metadata.theme
				);
			} catch (e) {
				console.error("Error parsing theme: ", e);
				orgDetails.metadata.theme = {};
			}
		}

		if (
			orgDetails?.metadata?.cms_meta &&
			typeof orgDetails?.metadata?.cms_meta === "string"
		) {
			try {
				orgDetails.metadata.cms_meta = JSON.parse(
					orgDetails.metadata.cms_meta
				);
			} catch (e) {
				console.error("Error parsing cms_meta: ", e);
				orgDetails.metadata.cms_meta = {};
			}
		}

		if (
			typeof orgDetails?.metadata?.cms_data &&
			typeof orgDetails?.metadata?.cms_data === "string"
		) {
			try {
				orgDetails.metadata.cms_data = JSON.parse(
					orgDetails.metadata.cms_data
				);
			} catch (e) {
				console.error("Error parsing cms_data: ", e);
				orgDetails.metadata.cms_data = {};
			}
		}

		// Cache the org details
		if (orgDetails?.org_id) {
			// console.debug("Caching Org details::: ", orgDetails);
			ORG_CACHE[domain || subdomain] = {
				...orgDetails,
				cache_expires: Date.now() + CACHE_EXPIRY_TIME,
			};
		} else if (orgDetails?.not_found === true) {
			// Domain details not available. Cache the invalid domain.
			INVALID_DOMAIN_CACHE.add(domain || subdomain);

			// Delay the response for invalid domains to prevent DOS attack
			await new Promise((resolve) =>
				setTimeout(resolve, DOS_ATTACK_DELAY)
			);
		}
	}

	return orgDetails
		? {
				props: {
					data: orgDetails,
				},
			}
		: {
				...invalidOrg,
				props: {
					reason: "Org not found",
				},
			};
};

/**
 * Fetch org details from the API (server-side only)
 * @param domain
 * @param subdomain
 */
const fetchOrgDetailsfromApi = async (domain, subdomain) => {
	// Validate domain and subdomain
	if (domain) {
		// Test for valid domain name using URL object
		try {
			const cleanDomain = domain.replace(/^https?:\/\//, ""); // Strip protocol if present
			const parsedHostname = new URL("https://" + cleanDomain)?.hostname; // Add protocol for validation
			if (!parsedHostname?.includes(".")) {
				domain = "";
			}
		} catch (_e) {
			domain = "";
			console.error("Error validating domain: ", domain, _e);
		}
	} else if (subdomain) {
		// Test for valid subdomain: only alphanumeric characters with hyphen, dot or underscore allowed.
		if (!/^[-a-z0-9\._]+$/i.test(subdomain)) {
			subdomain = "";
		}
	}

	if (!domain && !subdomain) {
		console.error("Invalid (sub)domain: ", { domain, subdomain });
		return null;
	}

	try {
		const res = await fetch(
			process.env.NEXT_PUBLIC_API_BASE_URL +
				Endpoints.GET_ORG_FROM_DOMAIN,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(
					domain
						? { domain: encodeURIComponent(domain) }
						: { sub_domain: encodeURIComponent(subdomain) }
				),
			}
		);

		if (!res.ok) {
			console.debug(
				"Org details not found on server: ",
				JSON.stringify(
					{
						url:
							process.env.NEXT_PUBLIC_API_BASE_URL +
							Endpoints.GET_ORG_FROM_DOMAIN,
						status: res.status,
						domain: domain,
						sub_domain: subdomain,
						data: await res.text(),
					},
					null,
					2
				)
			);

			return null;
		}

		const data = await res.json();

		if (data?.data?.org_id) {
			// Org details found
			return data.data;
		} else if (data?.response_type_id == 1829) {
			// Org details not found
			console.debug(
				"Org details not found on server: ",
				JSON.stringify(
					{
						url:
							process.env.NEXT_PUBLIC_API_BASE_URL +
							Endpoints.GET_ORG_FROM_DOMAIN,
						status: res.status,
						domain: domain,
						sub_domain: subdomain,
						data: data,
					},
					null,
					2
				)
			);

			return {
				not_found: true,
			};
		} else {
			// Some other server error
			console.error(
				"Org detail fetch ERROR: ",
				data?.data?.message || data?.message || "Unknown error"
			);
			return null;
		}
	} catch (e) {
		console.error("Error getting org details: ", e);
		return null;
	}
};
