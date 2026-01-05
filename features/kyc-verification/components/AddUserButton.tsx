/**
 * AddUserButton - Button component to trigger the add user modal.
 */

import { Button } from "components";

interface AddUserButtonProps {
	/** Click handler */
	onClick: () => void;
}

/**
 * Button to open the add user modal.
 * Displays a plus icon with "Add User" text.
 * @param {AddUserButtonProps} props - The component props
 * @param {Function} props.onClick - Callback function for button click
 * @returns {JSX.Element} The rendered button component
 */
export const AddUserButton = ({ onClick }: AddUserButtonProps): JSX.Element => {
	return (
		<Button
			onClick={onClick}
			size="sm"
			variant="primary"
			icon="add"
			iconStyle={{ size: "xs" }}
		>
			Add User
		</Button>
	);
};

export default AddUserButton;
