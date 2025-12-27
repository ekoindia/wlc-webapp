import { useEffect, useState } from "react";

interface NetworkState {
	online: boolean;
	effectiveType: string;
	downlink: number;
}

const getConnectionState = (): NetworkState => {
	if (typeof window === "undefined" || typeof navigator === "undefined") {
		return {
			online: false,
			effectiveType: "unknown",
			downlink: 0,
		};
	}

	const connection = (navigator as any)?.connection;
	const effectiveType = connection?.effectiveType ?? "unknown";
	const downlink =
		typeof connection?.downlink === "number" ? connection.downlink : 0;

	return {
		online: navigator?.onLine ?? false,
		effectiveType,
		downlink,
	};
};

const useNetworkState = (): NetworkState => {
	const [state, setState] = useState<NetworkState>(() =>
		getConnectionState()
	);

	useEffect(() => {
		if (typeof window === "undefined") {
			return undefined;
		}

		const handleUpdate = () => {
			setState(getConnectionState());
		};

		const connection = (navigator as any)?.connection;

		window.addEventListener("online", handleUpdate);
		window.addEventListener("offline", handleUpdate);
		connection?.addEventListener?.("change", handleUpdate);

		return () => {
			window.removeEventListener("online", handleUpdate);
			window.removeEventListener("offline", handleUpdate);
			connection?.removeEventListener?.("change", handleUpdate);
		};
	}, []);

	return state;
};

export default useNetworkState;
