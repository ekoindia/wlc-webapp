import { Box, useDisclosure } from "@chakra-ui/react";
import { Puck, Render, useGetPuck } from "@measured/puck";
import "@measured/puck/puck.css";
import { Button, Modal } from "components";
import { cmsConfig, componentIcons } from "libs/cms";
import { useCallback, useEffect, useState } from "react";
import { FiEye, FiGlobe, FiMonitor, FiSmartphone } from "react-icons/fi";
import { MdDragIndicator, MdOutlineAddBox } from "react-icons/md";

/**
 * Save/Publish the CMS configuration data
 * MARK: Publish
 * @param data - The CMS data to be saved
 */
const save = (data) => {
	if (!data) return;
	console.log("SAVING LANDING PAGE CONFIG: ", data);
	// Check if login widget has been added... Otherwiase, show alert to add it.
	// This is required to ensure users can login to access the app.
	const hasLoginWidget = JSON.stringify(data).includes("LoginWidget");
	if (!hasLoginWidget) {
		alert(
			"Please add the Login Widget or Button to your landing page to allow users to login."
		);
		return;
	}
	// TODO: For demo, we save to localStorage. In real app, save to backend via API call.
	localStorage.setItem("inf-landing-page-cms", JSON.stringify(data));
};

const LandingPageEditor = () => {
	const [initialData, setInitialData] = useState(null);
	const [cmsData, setCmsData] = useState({});

	const { isOpen, onOpen, onClose } = useDisclosure();

	const overrides = {
		// actionBar: ({ children }) => (
		// 	<ActionBar label="Actions...">
		// 		<ActionBar.Group>{children}</ActionBar.Group>
		// 		<ActionBar.Group>
		// 			<ActionBar.Action onClick={() => console.log("Clicked!")}>
		// 				★
		// 			</ActionBar.Action>
		// 		</ActionBar.Group>
		// 	</ActionBar>
		// ),

		// Override the default Publish button with our custom Preview & Save buttons
		headerActions: () => (
			// { children } // Hide the default children (Publish Button)
			<>
				<ActionButton icon={<FiEye />} onClick={onOpen}>
					Preview
				</ActionButton>
				<SaveButton />
				{/* {children} */}
			</>
		),

		// Override the default drawer items to show icons
		drawerItem: ({ name }) => {
			const component = cmsConfig.components[name];
			if (!component) {
				return <p>Unknown: {name}</p>;
			}
			const Icon = componentIcons[name] || MdOutlineAddBox;
			const label = component.label || name;

			return (
				<>
					<div
						style={{
							display: "flex",
							alignItems: "center",
							gap: "8px",
							color: "#444",
							fontSize: "0.9em",
							// fontWeight: 500,
							// marginBottom: "4px",
							border: "1px solid #dcdcdc",
							padding: "12px 10px",
							borderRadius: "4px",
							backgroundColor: "#FFF",
							cursor: "grab",
						}}
					>
						<Icon />

						<span style={{ flexGrow: 1, color: "#222" }}>
							{label}
						</span>
						<MdDragIndicator />
					</div>
					{/* {children} */}
				</>
			);
		},
	};

	// Load the initial configuration data...
	useEffect(() => {
		try {
			const data = JSON.parse(
				localStorage.getItem("inf-landing-page-cms")
			);
			setInitialData(data || {});
			setCmsData(data || {}); // For initial preview
		} catch (error) {
			console.error("Error loading landing page CMS config: ", error);
			setInitialData({});
		}
	}, []);

	if (initialData === null) return <p>Loading...</p>;

	// MARK: jsx
	return (
		<>
			<Box
				sx={{
					".Puck > div": {
						// position: "relative",
						borderRadius: "6px",
						overflow: "hidden",
					},
				}}
			>
				<Puck
					config={cmsConfig}
					data={initialData || {}}
					viewports={[
						{
							width: 360,
							height: "auto", // Optional height. Can be numeric or "auto". Defaults to "auto".
							label: "Mobile", // Optional. Shown in tooltip.
							icon: <FiSmartphone />,
						},
						{
							width: 1100,
							height: "auto",
							label: "Desktop",
							icon: <FiMonitor />,
						},
					]}
					overrides={overrides}
					metadata={{
						previewMode: true,
					}}
					// TODO: Permissions. For example, allow only edit and not delete, based on plans.
					// https://puckeditor.com/docs/api-reference/permissions
					// permissions={{ duplicate: false, delete: false, insert: false }}
					onPublish={save}
					onChange={(data) => {
						console.log("Set CMS Data: ", data);
						setCmsData(data);
					}}
				/>
			</Box>

			{/* Preview Popup Modal */}
			<Modal
				id="theme-consent"
				title="Preview Landing Page"
				size="full"
				scrollBehavior="inside"
				isOpen={isOpen}
				onClose={onClose}
				closeOnEsc={true}
			>
				<Render
					config={cmsConfig}
					data={cmsData}
					metadata={{ previewMode: true }}
				/>
			</Modal>
		</>
	);
};

/**
 * Button to save the Puck CMS configuration data...
 * MARK: Save Btn
 * TODO: For demo, we save to localStorage. In real app, save to backend via API call.
 */
const SaveButton = () => {
	const getPuck = useGetPuck();

	const handleClick = useCallback(() => {
		// Only get the appState when the button is clicked
		const { appState } = getPuck();
		const data = appState?.data;
		save(data);
	}, [getPuck]);

	return (
		<ActionButton isPrimary={true} icon={<FiGlobe />} onClick={handleClick}>
			Publish
		</ActionButton>
	);
};

/**
 * Generic Action Button for Puck Editor
 * MARK: Action Btn
 * @param root0
 * @param root0.onClick
 * @param root0.icon
 * @param root0.isPrimary
 * @param root0.children
 */
const ActionButton = ({ onClick, icon, isPrimary = false, children }) => {
	return (
		<Button
			variant={isPrimary ? "accent" : "accent_outline"}
			size="sm"
			leftIcon={icon}
			onClick={onClick}
		>
			{children}
		</Button>
	);
};

export default LandingPageEditor;
