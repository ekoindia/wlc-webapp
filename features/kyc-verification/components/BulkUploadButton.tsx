/**
 * BulkUploadButton - Button component to trigger the bulk verification modal.
 * Used in PageTitle's toolComponent prop.
 */

import { Button, Icon } from "components";

interface BulkUploadButtonProps {
	/** Callback when button is clicked */
	onClick: () => void;
}

/**
 * Button to open the bulk verification upload modal.
 * Displays an upload icon with "Bulk Upload" text.
 * @param {BulkUploadButtonProps} props - The component props
 * @param {Function} props.onClick - Callback function triggered when button is clicked
 * @returns {JSX.Element} The rendered button component
 */
export const BulkUploadButton = ({
	onClick,
}: BulkUploadButtonProps): JSX.Element => {
	return (
		<Button onClick={onClick} size="sm" variant="accent">
			<Icon name="file-upload" size="xs" />
			&nbsp; Bulk Upload
		</Button>
	);
};

export default BulkUploadButton;
