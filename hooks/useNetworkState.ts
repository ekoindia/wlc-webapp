import { useEffect, useState } from "react";

interface NetworkState {
	online: boolean;
	networkStatus: "online" | "offline" | "slow" | "unknown";
	effectiveType: string;
	downlink: number;
}

const getConnectionState = (): NetworkState => {
	if (typeof window === "undefined" || typeof navigator === "undefined") {
		return {
			online: false,
			networkStatus: "unknown",
			effectiveType: "unknown",
			downlink: 0,
		};
	}

	const connection = (navigator as any)?.connection;
	const effectiveType = connection?.effectiveType ?? "unknown";
	const downlink =
		typeof connection?.downlink === "number" ? connection.downlink : 0;
	const networkStatus = navigator?.onLine
		? effectiveType === "2g" || effectiveType === "slow-2g"
			? "slow"
			: "online"
		: "offline";

	return {
		online: navigator?.onLine ?? false,
		networkStatus,
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

export { useNetworkState };
