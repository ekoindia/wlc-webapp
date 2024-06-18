import { Box, Flex, Text } from "@chakra-ui/react";
// import { createAdaptor } from "@measured/puck";
import { Button, OrgLogo } from "components";
import { useContext } from "react";
import { context } from "..";
import { Section } from "../Section";

// const quotesAdaptor = createAdaptor(
// 	"Quotes API",
// 	"https://api.quotable.io/quotes",
// 	(body) =>
// 		body.results.map((item) => ({
// 			...item,
// 			title: item.author,
// 			description: item.content,
// 		}))
// );

export const Hero = {
	fields: {
		// _data: {
		// 	type: "external",
		// 	adaptor: quotesAdaptor,
		// 	adaptorParams: {
		// 		resource: "movies",
		// 		url: "http://localhost:1337",
		// 		apiToken:
		// 			"1fb8c347243145a8824481bd1008b95367677654ebc1f06c5a0a766e57b8859bcfde77f9b21405011f20eb8a13abb7b0ea3ba2393167ffc4a2cdc3828586494cc9983d5f1db4bc195ff4afb885aa55ee28a88ca796e7b883b9e9b80c98b50eadf79f5a1639ce8e2ae4cf63c2e8b8659a8cbbfeaa8e8adcce222b827eec49f989",
		// 	},
		// 	getItemSummary: (item) => item.content,
		// },
		title: { type: "text" },
		description: { type: "textarea" },
		buttons: {
			type: "array",
			getItemSummary: (item) => item.label || "Button",
			arrayFields: {
				label: { type: "text" },
				href: { type: "text" },
				variant: {
					type: "select",
					options: [
						{ label: "Primary", value: "primary" },
						{ label: "Accent", value: "accent" },
						{
							label: "Outline (Primary)",
							value: "primary_outline",
						},
						{ label: "Outline (Accent)", value: "accent_outline" },
						{ label: "Outline (Gray)", value: "outline" },
						{ label: "Link", value: "link" },
					],
				},
			},
		},
		logo: {
			label: "Show Logo?",
			type: "radio",
			options: [
				{ label: "Yes", value: true },
				{ label: "No", value: false },
			],
		},
		logoSize: {
			label: "Logo Size",
			type: "radio",
			options: [
				{ label: "Normal", value: "md" },
				{ label: "Large", value: "lg" },
			],
		},
		align: {
			type: "radio",
			options: [
				{ label: "left", value: "left" },
				{ label: "center", value: "center" },
			],
		},
		imageUrl: { type: "text" },
		imageMode: {
			type: "radio",
			options: [
				{ label: "inline", value: "inline" },
				{ label: "background", value: "background" },
			],
		},
		dark: {
			label: "Dark Mode",
			type: "radio",
			options: [
				{ label: "Yes", value: true },
				{ label: "No", value: false },
			],
		},
		padding: { type: "text" },
	},
	defaultProps: {
		logo: true,
		logoSize: "lg",
		title: "Your E-store",
		align: "left",
		description:
			"Your business partner to grow your revenue and digitize your business. Start earning today from your shop, office, home or anywhere.",
		buttons: [{ label: "Learn more", href: "#" }],
		imageUrl:
			"https://images.unsplash.com/photo-1687204209659-3bded6aecd79?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=900&q=80",
		padding: "64px",
		dark: false,
	},
	render: ({
		align = "left",
		title,
		description,
		buttons,
		logo = false,
		logoSize = "lg",
		padding,
		imageUrl,
		imageMode,
		dark = false,
	}) => {
		// eslint-disable-next-line react-hooks/rules-of-hooks
		const { paddingX } = useContext(context);

		const center = align === "center";
		const bgOverlay =
			"linear-gradient(-90deg,rgb(247, 250, 255, 0.8) 0%,rgb(247, 250, 255, 0.8) 80%)";
		const bgOverlayDark =
			"linear-gradient(-90deg,rgb(0 ,0, 0, 0.75) 0%,rgb(0 ,0, 0, 0.75) 80%)";
		const bgOverlayLarge =
			"linear-gradient(-90deg,rgba(255, 255, 255, 0) 0%,rgba(247, 250, 255, 0.95) 60%)";
		const bgOverlayLargeDark =
			"linear-gradient(-90deg,rgba(0, 0, 0, 0) 0%,rgb(0, 0, 0, 0.8) 60%)";

		return (
			// Hero
			<Section
				padding="0"
				fullWidth={true}
				position="relative"
				// bgImg="linear-gradient(rgba(255, 255, 255, 0),rgb(247, 250, 255) 100%);"
			>
				{imageMode === "background" && (
					// image & imageOverlay
					<>
						<div
							style={{
								backgroundImage: `url("${imageUrl}")`,
								backgroundRepeat: "no-repeat",
								backgroundSize: "cover",
								backgroundPosition: "center",
								position: "absolute",
								right: 0,
								top: 0,
								bottom: 0,
								left: 0,
							}}
						></div>
						<Box
							backgroundImage={
								align === "left"
									? {
											base: dark
												? bgOverlayDark
												: bgOverlay,
											md: dark
												? bgOverlayLargeDark
												: bgOverlayLarge,
										}
									: dark
										? bgOverlayDark
										: bgOverlay
							}
							position="absolute"
							right={0}
							top={0}
							bottom={0}
							left={0}
						></Box>
					</>
				)}

				{/* Inner */}
				<Flex
					w="100%"
					direction="row"
					align="center"
					justify={center ? "center" : undefined}
					textAlign={center ? "center" : undefined}
					position="relative"
					gap="48px"
					px={paddingX || "0"}
					py={padding}
					wrap={{ base: "wrap", md: "nowrap" }}
					zIndex="1"
				>
					<Flex
						direction="column"
						align={center ? "center" : undefined}
						justify={center ? "center" : undefined}
						gap="16px"
						w="100%"
						maxW={
							center
								? "100%"
								: imageMode === "background"
									? { base: "auto", md: "50%" }
									: undefined
						}
					>
						{logo ? (
							<OrgLogo size={logoSize} dark={dark} mb="2em" />
						) : null}
						<Text
							as="h1"
							lineHeight="1.1"
							fontSize={{ base: "42px", md: "60px", lg: "64px" }}
							// color="#333"
							color={{ base: dark ? "white" : "#333" }}
						>
							{title}
						</Text>
						<p
							style={{
								color: dark
									? "white"
									: imageMode === "background"
										? "#404040"
										: "#767676",
								fontSize: "20px",
								lineHeight: 1.5,
								margin: 0,
								marginBottom: "8px",
								fontWeight: 300,
							}}
						>
							{description}
						</p>
						<Flex gap="16px">
							{buttons.map((button, i) => (
								<Button
									key={i}
									href={button.href}
									variant={button.variant}
									size="lg"
								>
									{button.label}
								</Button>
							))}
						</Flex>
					</Flex>

					{align !== "center" &&
						imageMode !== "background" &&
						imageUrl && (
							<div
								style={{
									backgroundImage: `url('${imageUrl}')`,
									backgroundSize: "cover",
									backgroundRepeat: "no-repeat",
									backgroundPosition: "center",
									borderRadius: 24,
									height: 356,
									marginLeft: "auto",
									width: "100%",
								}}
							/>
						)}
				</Flex>
			</Section>
		);
	},
};
