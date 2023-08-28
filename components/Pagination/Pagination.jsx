import { Box, Flex, Square } from "@chakra-ui/react";
import { DOTS, usePagination } from "hooks";
import { Icon } from "..";

/**
 * A Pagination component
 * TODO: Write more description here
 * @param 	{object}	prop	Properties passed to the component
 * @param	{string}	prop.prop1	TODO: Property description.
 * @param	{...*}	rest	Rest of the props passed to this component.
 * @example	`<Pagination></Pagination>` TODO: Fix example
 */
const Pagination = ({
	onPageChange,
	totalCount,
	siblingCount = 1,
	currentPage,
	pageSize,
	isSmallScreen,
	tableDataListLength,
	tableRowLimit,
	setHasNoMoreItems,
}) => {
	// console.log("[Pagination] isSmallScreen", isSmallScreen);
	let { paginationRange, hasNextPage } = usePagination({
		currentPage,
		totalCount,
		siblingCount,
		pageSize,
		tableDataListLength,
		tableRowLimit,
		setHasNoMoreItems,
	});

	// if (currentPage === 0 || paginationRange?.length < 2) {
	// 	return null;
	// } //? Check this

	let lastPage = paginationRange?.[paginationRange?.length - 1];

	return (
		<Flex
			my="20px"
			justifyContent={
				!isSmallScreen && totalCount ? "space-between" : "flex-end"
			}
			w="100%"
			fontSize={isSmallScreen ? "md" : "xs"}
			sx={{
				"@media print": {
					display: "none !important",
				},
			}}
		>
			{!isSmallScreen && totalCount && (
				<Flex gap="1.5" color="light">
					<span>Results</span>
					<Box as="span" color="dark">
						{currentPage * pageSize - (pageSize - 1)}-
						{currentPage * pageSize > totalCount
							? totalCount
							: currentPage * pageSize}
					</Box>
					<span>of</span>
					<span>{totalCount}</span>
				</Flex>
			)}

			<Flex align="center" gap={isSmallScreen ? "8" : "4"}>
				<Icon
					name="chevron-left"
					color={currentPage !== 1 ? "light" : "hint"}
					size={isSmallScreen ? "sm" : "xs"}
					cursor="pointer"
					onClick={() =>
						onPageChange(
							currentPage !== 1 ? currentPage - 1 : currentPage
						)
					}
				/>

				<Flex gap="4" h="100%">
					{!isSmallScreen && totalCount ? (
						paginationRange?.map((pageNumber, index) => {
							if (pageNumber === DOTS) {
								return <span key={index}>{DOTS}</span>;
							}
							return (
								<Square
									px="7px"
									borderRadius="6px"
									key={index}
									cursor="pointer"
									bg={
										currentPage === pageNumber
											? "primary.DEFAULT"
											: null
									}
									color={
										currentPage === pageNumber
											? "white"
											: "light"
									}
									onClick={() => onPageChange(pageNumber)}
								>
									<span>{pageNumber}</span>
								</Square>
							);
						})
					) : (
						<span>{currentPage}</span>
					)}
				</Flex>
				<Icon
					name="chevron-right"
					size={isSmallScreen ? "sm" : "xs"}
					color={
						(totalCount && currentPage !== lastPage) ||
						(!totalCount && hasNextPage)
							? "light"
							: "hint"
					}
					cursor="pointer"
					onClick={() => {
						if (totalCount && currentPage !== lastPage) {
							onPageChange(currentPage + 1);
						} else if (!totalCount && hasNextPage) {
							onPageChange(currentPage + 1);
						}
					}}
				/>
			</Flex>
		</Flex>
	);
};

export default Pagination;
