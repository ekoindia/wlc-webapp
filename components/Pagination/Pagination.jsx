import { Box, Flex, Square } from "@chakra-ui/react";
import { DOTS, usePagination } from "hooks";
import { Button, Icon } from "..";

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
	tablePageLimit,
	setHasNoMoreItems,
}) => {
	console.log("[Pagination] isSmallScreen", isSmallScreen);

	let { paginationRange, hasNextPage } = usePagination({
		currentPage,
		totalCount,
		siblingCount,
		pageSize,
		tableDataListLength,
		tablePageLimit,
		setHasNoMoreItems,
	});

	// if (currentPage === 0 || paginationRange?.length < 2) {
	// 	return null;
	// } //TODO: Check this

	let lastPage = paginationRange?.[paginationRange?.length - 1];
	console.log("[Pagination] lastPage", lastPage);

	return (
		<Flex
			my="20px"
			justifyContent={
				!isSmallScreen && totalCount ? "space-between" : "flex-end"
			}
			w="100%"
			fontSize="xs"
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

			<Flex align="center" gap="4">
				{!isSmallScreen && totalCount ? (
					<Icon
						name="chevron-left"
						color={currentPage !== 1 ? "light" : "hint"}
						size="xs"
						cursor="pointer"
						onClick={() =>
							onPageChange(
								currentPage !== 1
									? currentPage - 1
									: currentPage
							)
						}
					/>
				) : (
					<Button
						size="sm"
						cursor="pointer"
						onClick={() =>
							onPageChange(
								currentPage !== 1
									? currentPage - 1
									: currentPage
							)
						}
						disabled={currentPage === 1}
					>
						Prev
					</Button>
				)}
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
											? "accent.DEFAULT"
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
						<Flex
							bg="white"
							px="20px"
							h="100%"
							align="center"
							borderRadius="10px"
							boxShadow="0px 5px 15px #0000000D"
							userSelect="none"
						>
							{currentPage}
						</Flex>
					)}
				</Flex>
				{!isSmallScreen && totalCount ? (
					<Icon
						name="chevron-right"
						size="xs"
						color={currentPage !== lastPage ? "light" : "hint"}
						cursor="pointer"
						onClick={() =>
							onPageChange(
								currentPage !== lastPage
									? currentPage + 1
									: currentPage
							)
						}
					/>
				) : (
					<Button
						size="sm"
						cursor="pointer"
						onClick={() => {
							if (totalCount && currentPage !== lastPage) {
								onPageChange(currentPage + 1);
							} else if (!totalCount && hasNextPage) {
								onPageChange(currentPage + 1);
							}
						}}
						disabled={
							currentPage === lastPage || hasNextPage === false
						}
					>
						Next
					</Button>
				)}
			</Flex>
		</Flex>
	);
};

export default Pagination;
