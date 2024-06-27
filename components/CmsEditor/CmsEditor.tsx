import { Box } from "@chakra-ui/react";
import { Puck } from "@measured/puck";
import "@measured/puck/puck.css";
import { Button } from "components";
import { cmsConfig } from "libs/cms";
import { useState } from "react";
import { FiGlobe, FiX } from "react-icons/fi";

// Declare the props interface
interface CmsEditorProps {
	initialData?: object;
	label?: string;
	onClose?: () => void;
	onSave?: (_data: object) => void;
	// [key: string]: any;
}

/**
 * CMS Editor
 * @param {object} prop - Properties passed to the component
 * @param {object} [prop.initialData] - Initial configuration data for the editor
 * @param {string} [prop.label] - Label for the editor
 * @param {Function} [prop.onClose] - Callback function to handle close
 * @param {Function} [prop.onSave] - Callback function to handle save
 * // @param {...*} rest - Rest of the props
 */
const CmsEditor = ({
	initialData = {},
	label = "Page Editor",
	onClose,
	onSave,
	// ...rest
}: CmsEditorProps) => {
	const [updatedData, setUpdatedData] = useState(null);

	/**
	 * Overrides for the default Puck editor UI.
	 * NOTE: The overrides API is highly experimental and is likely to experience breaking changes. (as of Puck v0.15.0)
	 */
	const overrides = {
		headerActions: () => (
			<>
				<Button
					variant="accent_outline"
					icon={<FiX />}
					onClick={() => {
						setUpdatedData(null);
						onClose && onClose();
					}}
				>
					Close
				</Button>
				<Button
					variant="accent"
					disabled={updatedData === null}
					icon={<FiGlobe />}
					iconPosition="left"
					onClick={() => updatedData && onSave && onSave(updatedData)}
				>
					Publish
				</Button>
			</>
		),
	};

	if (initialData === null) return <p>Loading...</p>;

	// MARK: JSX
	return (
		<Box
			w="100%"
			sx={{
				".Puck > div": {
					position: "relative",
					borderRadius: "6px",
					overflow: "hidden",
				},
			}}
		>
			<Puck
				config={cmsConfig}
				data={initialData || {}}
				headerTitle={label}
				viewports={[
					{
						width: 360,
						height: "auto", // Optional height. Can be numeric or "auto". Defaults to "auto".
						label: "Mobile", // Optional. Shown in tooltip.
						icon: "Smartphone",
					},
					{
						width: 1100,
						height: "auto",
						label: "Desktop",
						icon: "Monitor",
					},
				]}
				overrides={overrides}
				// onPublish={save}
				onChange={setUpdatedData}
			/>
		</Box>
	);
};

export default CmsEditor;
