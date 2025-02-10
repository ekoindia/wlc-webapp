import { Center } from "@chakra-ui/react";

const Custom404 = () => {
	// Read sessionStorage for org_details. If org_id not found in org_details, show the "close" button to close the current tab; otherwise, show the back button to go back to the home page.
	const orgDetails = JSON.parse(sessionStorage.getItem("org_detail"));

	return (
		<Center h="100vh" className="hello">
			<Center
				flexDirection="column"
				color={"#232323"}
				rowGap={"10px"}
				w={{ base: "100%", md: "30%" }}
			>
				<h1
					style={{
						fontSize: "120px",
						fontWeight: "700",
						color: "#999",
						lineHeight: "normal",
					}}
				>
					404
				</h1>
				<h2
					style={{
						fontSize: "22px",
						fontWeight: "700",
						color: "#333",
						textAlign: "center",
						textTransform: "uppercase",
					}}
				>
					Oops! Page Not Found
				</h2>

				<p
					style={{
						color: "#787878",
						fontWeight: "400",
						marginBottom: "24px",
						textAlign: "center",
					}}
				>
					Sorry, but the page you are looking for does not exist, or,
					has been removed.
				</p>
				{
					// If org_id not found in org_details, show the "close" button to close the current tab; otherwise, show the back button to go back to the home page.
					orgDetails?.org_id ? (
						<a
							href="/"
							style={{
								cursor: "pointer",
								display: "inline-block",
								textAlign: "center",
								padding: "0.6em 1em",
								border: "2px solid #666",
								borderRadius: 6,
								color: "#666",
							}}
						>
							Back to Home
						</a>
					) : null
				}
			</Center>
		</Center>
	);
};

export default Custom404;
