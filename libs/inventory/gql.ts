import { GraphQLClient } from "graphql-request";

const endpoint = process.env.NEXT_PUBLIC_INVENTORY_GRAPHQL_API_URL;

if (!endpoint) {
	console.error("NEXT_PUBLIC_INVENTORY_GRAPHQL_API_URL is not configured");
}

export const gqlClient = endpoint
	? null
	: new GraphQLClient(endpoint, {
			headers: {
				"Content-Type": "application/json",
				// "Access-Control-Allow-Origin": "*",
				// "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
				// "Access-Control-Allow-Headers": "Content-Type, Authorization",
				Authorization: "11205980", // TODO: Pass the actual user-code of vendor
			},
			mode: "cors",
		});

/**
 *
 * @param query
 * @param variables
 */
export async function gqlRequest<T>(
	query: string,
	variables?: Record<string, any>
): Promise<T> {
	if (!gqlClient) {
		return Promise.reject(
			new Error("GraphQL Client is not configured properly")
		);
	}

	try {
		const result = await gqlClient.request<T>(query, variables || {});
		return result;
	} catch (error: any) {
		console.error("GraphQL Error:", {
			endpoint,
			query: query.trim(),
			variables,
			error: error.response || error.message || error,
		});

		// Enhanced error message
		if (error.response?.status === 400) {
			throw new Error(
				`GraphQL Query Error: ${error.response?.error || "Invalid query structure"}`
			);
		}

		throw error;
	}
}
