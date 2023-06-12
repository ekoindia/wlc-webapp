import {
	createContext,
	useCallback,
	useContext,
	useMemo,
	useState,
} from "react";
import uuid from "uuid";

// Create Context Object
const PubSubContext = createContext();

// List of topics
export const TOPICS = {
	ANDROID_RESPONSE: "ANDROID_RESPONSE",
};

// Create a provider for components to consume and subscribe to changes
export const PubSubProvider = (props) => {
	const [_subscribers, setSubscribers] = useState({});

	const subscribe = useCallback((topic, callback) => {
		const id = uuid.v4();
		// console.log("[PubSub] subscribe", topic, id);
		setSubscribers((prev) => ({
			...prev,
			[topic]: {
				...prev[topic],
				[id]: callback,
			},
		}));
		return () => {
			setSubscribers((prev) => ({
				...prev,
				[topic]: {
					...prev[topic],
					[id]: null,
				},
			}));
		};
	}, []);

	const publish = useCallback((topic, data) => {
		// console.log("[PubSub] publish:", topic, data);
		// Hack to get latest "subscribers" state...
		setSubscribers((prevSubscribers) => {
			if (!prevSubscribers[topic]) return prevSubscribers;
			Object.values(prevSubscribers[topic]).forEach((fn) => {
				if (fn) fn(data, topic);
			});
			return prevSubscribers;
		});
	}, []);

	const value = useMemo(
		() => ({ subscribe, publish, TOPICS }),
		[subscribe, publish, TOPICS]
	);

	return (
		<PubSubContext.Provider value={value}>
			{props.children}
		</PubSubContext.Provider>
	);
};

// Custom hook that shorthands the context
export const usePubSub = () => useContext(PubSubContext);
