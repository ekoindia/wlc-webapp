import { Center } from "@chakra-ui/react";
import { useSession } from "contexts";
import { useEffect } from "react";

/**
 *
 */
export default function Logout() {
	const { logout } = useSession();

	useEffect(() => {
		logout({ isForced: true });
	}, [logout]);

	// Show a "Logging out..." message at the center of the screen with large faded text
	return (
		<Center h="100vh" w="100vw" bg="blackAlpha.800">
			<h3 style={{ color: "white", fontSize: "2rem" }}>Logging out...</h3>
		</Center>
	);
}
