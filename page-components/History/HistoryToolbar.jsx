import { Flex, Text } from "@chakra-ui/react";
import { Button, Icon, Modal } from "components";
import { Fragment } from "react";
import { Form } from "tf-components";

/**
 * A HistoryToolbar page-component
 * @param 	{object}	prop	Properties passed to the component
 * @param {boolean} prop.isFiltered - Whether the table is filtered or not.
 * @param {Function} prop.clearFilter - Function to clear the filter.
 * @param {string} prop.openModalId - The ID of the open modal.
 * @param {Function} prop.setOpenModalId - Function to set the open modal ID.
 * @param {object} prop.searchBarConfig - The search bar configuration.
 * @param {object} prop.actionBtnConfig - The action button configuration.
 */
const HistoryToolbar = ({
	isFiltered,
	clearFilter,
	openModalId,
	setOpenModalId,
	searchBarConfig,
	actionBtnConfig,
}) => {
	return (
		<Flex
			gap="2"
			w="100%"
			justify="flex-end"
			align="center"
			sx={{
				"@media print": {
					display: "none !important",
				},
			}}
		>
			<Button
				size="xs"
				display={{ base: "none", md: isFiltered ? "block" : "none" }}
				variant="link"
				onClick={clearFilter}
				_hover={{ textDecoration: "none" }}
			>
				Clear Filter
			</Button>

			<div>
				<Form {...searchBarConfig} />
			</div>

			{actionBtnConfig.map(
				({
					id,
					label,
					icon,
					parameter_list,
					handleSubmit,
					register,
					control,
					errors,
					isSubmitting,
					formValues,
					handleFormSubmit,
					submitButtonText,
					secondaryButtonAction,
					secondaryButtonText,
					styles,
				}) => (
					<Fragment key={id}>
						<Button
							size="md"
							variant="primary_outline"
							onClick={() =>
								setOpenModalId(id === openModalId ? null : id)
							}
							{...styles}
						>
							<Icon name={icon} size="sm" />
							&nbsp;
							<Text
								display={{ base: "none", md: "flex" }}
								fontSize="md"
							>
								{label}
							</Text>
						</Button>
						<Modal
							isOpen={openModalId === id}
							onClose={() => setOpenModalId(null)}
							title={label}
						>
							<form onSubmit={handleSubmit(handleFormSubmit)}>
								<Flex
									direction="column"
									w="100%"
									gap="8"
									mb="4"
								>
									<Form
										{...{
											parameter_list,
											register,
											control,
											formValues,
											errors,
											gap: "2",
											hideOptionalMark: true,
										}}
									/>
									<Flex gap="4">
										<Button
											w="100%"
											size="md"
											variant="link"
											color="primary.dark"
											onClick={secondaryButtonAction}
										>
											{secondaryButtonText}
										</Button>
										<Button
											w="100%"
											size="md"
											type="submit"
											loading={isSubmitting}
										>
											{submitButtonText}
										</Button>
									</Flex>
								</Flex>
							</form>
						</Modal>
					</Fragment>
				)
			)}
		</Flex>
	);
};

export default HistoryToolbar;
