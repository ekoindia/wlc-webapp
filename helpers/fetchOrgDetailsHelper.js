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
const CACHE_EXPIRY_TIME = 1000 * 60 * 60 * 24; // 24 hours

// Response data, if org not found
const invalidOrg = {
	notFound: true,
};

/**
 * Mock org details (used in development)
 */
export const MockOrgDetails = {
	org_id: process.env.WLC_ORG_ID || 2,
	app_name: process.env.WLC_APP_NAME || "Wlc",
	org_name: process.env.WLC_ORG_NAME || "Wlc",
	logo: process.env.WLC_LOGO,
	support_contacts: {
		phone: process.env.WLC_SUPPORT_CONTACTS_PHONE || 1234567890,
		email: process.env.WLC_SUPPORT_CONTACTS_EMAIL || "xyz@gmail.com",
	},
	login_types: {
		google: {
			client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
		},
	},
};

/**
 * Fetch org details from API (using cache)
 * This is used on server-side only
 * @param {*} host	Hostname of the request
 * @returns {object} org details or {notFound: true} if org not found
 */
export const fetchOrgDetails = async (host) => {
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

	// Check cache for invalid (sub)domain
	if (!orgDetails && INVALID_DOMAIN_CACHE.has(domain || subdomain)) {
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
			return {
				...invalidOrg,
				props: {
					cached: true,
				},
			};
		}
	}

	// If org details not found in cache, or the cache is expired, fetch from API
	if (!orgDetails || orgDetails?.cache_expires < Date.now()) {
		// Fetch org details from API
		orgDetails = await fetchOrgDetailsfromApi(domain, subdomain);

		console.log("Fetched Org details::: ", orgDetails);

		// Cache the org details
		if (orgDetails?.org_id) {
			// console.debug("Caching Org details::: ", orgDetails);
			ORG_CACHE[domain || subdomain] = {
				...orgDetails,
				cache_expires: Date.now() + CACHE_EXPIRY_TIME,
			};
		} else {
			// Cache the invalid domain
			INVALID_DOMAIN_CACHE.add(domain || subdomain);
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
					reason: "Org details null",
				},
		  };
};

/**
 * Fetch org details from the API (server-side only)
 * @param domain
 * @param subdomain
 */
const fetchOrgDetailsfromApi = async (domain, subdomain) => {
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
			return null;
		}

		const data = await res.json();

		if (data && data.data && data.data.org_id) {
			return data.data;
		} else {
			console.debug(
				"Org details not found on server: ",
				JSON.stringify(
					{
						status: res.status,
						domain: domain,
						sub_domain: subdomain,
						data: data,
					},
					null,
					2
				)
			);

			return null;
		}
	} catch (e) {
		console.error("Error getting org details: ", e);
		return null;
	}
};
