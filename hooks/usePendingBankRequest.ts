import { Endpoints } from "constants/index";
import { useSession } from "contexts";
import { fetcher } from "helpers";
import { useCallback, useEffect, useState } from "react";
import { useRefreshToken } from ".";

interface PendingBankRequest {
	createdAt: string;
	reason: string;
	data: string; // JSON string with ifsc and accountNumber
	changeType: string;
	agentName: string | null;
	makerName: string | null;
	transactionId: string;
	status: number;
}

interface ParsedBankData {
	ifsc: string;
	accountNumber: string;
}

interface UsePendingBankRequestReturn {
	pendingRequest: PendingBankRequest | null;
	parsedBankData: ParsedBankData | null;
	isLoading: boolean;
	error: string | null;
	refetch: () => Promise<void>;
}

const usePendingBankRequest = (
	user_code: string
): UsePendingBankRequestReturn => {
	const [pendingRequest, setPendingRequest] =
		useState<PendingBankRequest | null>(null);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);

	const { accessToken } = useSession();
	const { generateNewToken } = useRefreshToken();

	const fetchPendingRequest = useCallback(async () => {
		if (!accessToken || !user_code) return;

		setIsLoading(true);
		setError(null);

		try {
			const response: any = await fetcher(
				process.env.NEXT_PUBLIC_API_BASE_URL + Endpoints.TRANSACTION,
				{
					headers: {
						"tf-req-uri-root-path": "/ekoicici/v1",
						"tf-req-uri": `/request`,
						"tf-req-method": "POST",
					},
					body: {
						interaction_type_id: "1060",
						bc: "3",
						operation_type: 2, // 2 = fetch
						user_code: user_code,
						source: "WLC",
						version: "v2",
					},
					token: accessToken,
				},
				generateNewToken
			);

			if (response.status === 0) {
				const request = response?.data?.agent_details?.[0] || null;
				setPendingRequest(request);
			} else {
				setError(response.message || "Failed to fetch pending request");
			}
		} catch (err: any) {
			setError(err.message || "Something went wrong");
		} finally {
			setIsLoading(false);
		}
	}, [accessToken, user_code, generateNewToken]);

	useEffect(() => {
		fetchPendingRequest();
	}, [fetchPendingRequest]);

	// Parse the data JSON string
	const parsedBankData: ParsedBankData | null = pendingRequest?.data
		? (() => {
				try {
					return JSON.parse(pendingRequest.data);
				} catch {
					return null;
				}
			})()
		: null;

	return {
		pendingRequest,
		parsedBankData,
		isLoading,
		error,
		refetch: fetchPendingRequest,
	};
};

export default usePendingBankRequest;
