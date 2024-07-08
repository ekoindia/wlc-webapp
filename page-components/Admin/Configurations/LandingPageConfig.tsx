import { Flex, Modal, ModalContent, ModalOverlay } from "@chakra-ui/react";
import { Button, CmsEditor, Radio } from "components";
import { useEffect, useState } from "react";
import { RiImageEditFill } from "react-icons/ri";
import { Section } from "./Section";

// Save the data to your database
// TODO: Save to database
const save = (data) => {
	if (!data) return;
	console.log("SAVING LANDING PAGE CONFIG: ", data);
	localStorage.setItem("inf-landing-page-cms", JSON.stringify(data));
};

const LandingPageConfig = () => {
	const [initialData, setInitialData] = useState(null);
	const [landingPageStyle, setLandingPageStyle] = useState("");
	const [openEditor, setOpenEditor] = useState(false);

	// Load the Landing Page Style
	useEffect(() => {
		const landingPageStyle = localStorage.getItem(
			"inf-landing-page-cms-conf"
		); // Eg: {"type":"page"}
		if (landingPageStyle) {
			setLandingPageStyle(JSON.parse(landingPageStyle).type);
		} else {
			setLandingPageStyle("card");
		}
	}, []);

	// Load the initial configuration data...
	useEffect(() => {
		try {
			const data = JSON.parse(
				localStorage.getItem("inf-landing-page-cms")
			);
			setInitialData(data || {});
		} catch (error) {
			console.error("Error loading landing page CMS config: ", error);
			setInitialData({});
		}
	}, []);

	// Save the selected Landing Page Style to LocalStorage
	// TODO: Save on server
	useEffect(() => {
		// console.log("Selected Landing Page Style:", landingPageStyle);
		if (landingPageStyle === "page") {
			localStorage.setItem(
				"inf-landing-page-cms-conf",
				JSON.stringify({ type: "page" })
			);
		} else if (landingPageStyle === "card") {
			// Delete the key if the value is "card"
			localStorage.removeItem("inf-landing-page-cms-conf");
		}
	}, [landingPageStyle]);

	return (
		<Flex direction="column" gap={{ base: 4, md: 8 }}>
			<Section title="Landing Page Design">
				<Flex direction="column" gap={8}>
					<Radio
						label="Select Landing Page Style"
						options={[
							{ label: "Splash Screen (Default)", value: "card" },
							{ label: "Landing Page", value: "page" },
						]}
						value={landingPageStyle}
						required
						onChange={(e) => setLandingPageStyle(e)}
					/>

					<Button
						variant="accent"
						icon={<RiImageEditFill />}
						onClick={() => setOpenEditor(true)}
					>
						Edit Page Design
					</Button>
				</Flex>
			</Section>

			{openEditor && (
				<Modal
					isOpen={true}
					onClose={() => setOpenEditor(false)}
					size="full"
				>
					<ModalOverlay bg="blackAlpha.700" backdropBlur="10px" />
					<ModalContent
						{...{
							width: "100%",
							maxWidth: "100%",
							alignItems: "center",
							justifyContent: "center",
							bg: "transparent",
							boxShadow: "none",
						}}
					>
						<CmsEditor
							initialData={initialData}
							label="Landing Page"
							onSave={save}
							onClose={() => setOpenEditor(false)}
						/>
					</ModalContent>
				</Modal>
			)}
		</Flex>
	);
};

export default LandingPageConfig;
