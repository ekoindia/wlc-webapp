import { Flex } from "@chakra-ui/react";
// import { Box, Grid, Image, Link, Text } from "@chakra-ui/react";
// import { useEffect, useState } from "react";

/**
 * Embeds an external announcements page in the dashboard.
 * @example	`<AnnouncementsDashboard></AnnouncementsDashboard>`
 */
const AnnouncementsDashboard = () => {
	// const [announcements, setAnnouncements] = useState([]);

	// useEffect(() => {
	// 	const fetchAnnouncements = async () => {
	// 		const response = await fetch(
	// 			process.env.NEXT_PUBLIC_ADMIN_ANNOUNCEMENT_EMBED_URL
	// 		);
	// 		const data = await response.json();
	// 		if (data && data.posts) {
	// 			setAnnouncements(data.posts);
	// 		}
	// 	};

	// 	fetchAnnouncements();
	// }, []);

	if (!process.env.NEXT_PUBLIC_ADMIN_ANNOUNCEMENT_EMBED_URL) {
		return null;
	}

	// Display a grid of announcement posts from the `announcements` array. It contains title, date, url and image.
	// return (
	// 	<Grid
	// 		templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }}
	// 		gap={6}
	// 		p={4}
	// 	>
	// 		{announcements.map((announcement, index) => (
	// 			<Box
	// 				key={index}
	// 				borderWidth="1px"
	// 				borderRadius="lg"
	// 				overflow="hidden"
	// 				boxShadow="md"
	// 			>
	// 				<Image
	// 					src={announcement.image}
	// 					alt={announcement.title}
	// 					objectFit="cover"
	// 					width="100%"
	// 					height="200px"
	// 				/>
	// 				<Box p={4}>
	// 					<Text fontWeight="bold" fontSize="lg" mb={2}>
	// 						{announcement.title}
	// 					</Text>
	// 					<Text fontSize="sm" color="gray.500" mb={4}>
	// 						{new Date(announcement.date).toLocaleDateString()}
	// 					</Text>
	// 					<Link
	// 						href={announcement.url}
	// 						color="teal.500"
	// 						fontWeight="bold"
	// 						isExternal
	// 					>
	// 						Read More
	// 					</Link>
	// 				</Box>
	// 			</Box>
	// 		))}
	// 	</Grid>
	// );

	return (
		<Flex direction="column" gap="4" p={{ base: "0px", md: "20px 0px" }}>
			{/* Embeds an external announcements page in the dashboard. */}
			<iframe
				src={process.env.NEXT_PUBLIC_ADMIN_ANNOUNCEMENT_EMBED_URL}
				style={{
					width: "100%",
					height: "100vh",
					border: "none",
					borderRadius: "8px",
					overflow: "hidden",
				}}
				title="Announcements"
			></iframe>
		</Flex>
	);
};

export default AnnouncementsDashboard;
