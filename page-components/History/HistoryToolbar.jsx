import { Flex, Text } from "@chakra-ui/react";
import { Button, Icon, Modal } from "components";
import { Fragment } from "react";
import { Form } from "tf-components";

/**
 * A HistoryToolbar page-component
 * @param root0
 * @param root0.isFiltered
 * @param root0.clearFilter
 * @param root0.openModalId
 * @param root0.setOpenModalId
 * @param root0.searchBarConfig
 * @param root0.actionBtnConfig
 * @example	`<HistoryToolbar></HistoryToolbar>` TODO: Fix example
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
							size="lg"
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
										}}
									/>
									<Flex gap="4">
										<Button
											w="100%"
											size="lg"
											variant="link"
											color="primary.dark"
											onClick={secondaryButtonAction}
										>
											{secondaryButtonText}
										</Button>
										<Button
											w="100%"
											size="lg"
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
