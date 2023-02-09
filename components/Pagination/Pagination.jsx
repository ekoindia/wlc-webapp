import { Box, Center, Flex, Square } from "@chakra-ui/react";
import { DOTS, usePagination } from "hooks";
import { useState } from "react";
import { Icon } from "..";

const Pagination = (props) => {
	const [currPageNumber, setCurrPageNumber] = useState(1);

	const {
		onPageChange,
		totalCount,
		siblingCount = 1,
		currentPage,
		pageSize,
		className,
	} = props;

	const paginationRange = usePagination({
		currentPage,
		totalCount,
		siblingCount,
		pageSize,
	});

	if (currentPage === 0 || paginationRange.length < 2) {
		return null;
	}

	let lastPage = paginationRange[paginationRange.length - 1];

	return (
		<Flex
			mt="20px"
			mb={{ base: "30px", "2xl": "0px" }}
			justifyContent="space-between"
			w="100%"
			fontSize={{ md: "12px", "2xl": "16px" }}
		>
			<Flex gap={2} color="light">
				<Box as="span">Results</Box>
				<Box as="span" color="dark">
					{currentPage * pageSize - (pageSize - 1)} -{" "}
					{currentPage * pageSize > totalCount
						? totalCount
						: currentPage * pageSize}
				</Box>
				<Box as="span">of</Box>
				<Box as="span">{totalCount}</Box>
			</Flex>
			<Flex gap={6}>
				<Flex
					color={currentPage !== 1 ? "light" : "hint"}
					onClick={() => {
						onPageChange(
							currentPage !== 1 ? currentPage - 1 : currentPage
						);
						setCurrPageNumber(
							currentPage !== 1 ? currentPage - 1 : currentPage
						);
					}}
					cursor="pointer"
				>
					<Center
						width={{ md: "15px", "2xl": "20px" }}
						height={"100%"}
					>
						<Icon name="chevron-left" width="100%" />
					</Center>
				</Flex>
				<Flex gap={{ md: "4", "2xl": "6" }}>
					{paginationRange.map((pageNumber, index) => {
						if (pageNumber === DOTS) {
							return (
								<Box as="span" key={index}>
									&#8230;
								</Box>
							);
						}
						return (
							<Square
								size="auto"
								px="7px"
								borderRadius="6px"
								key={index}
								cursor="pointer"
								bg={
									currPageNumber === pageNumber
										? "accent.DEFAULT"
										: ""
								}
								color={
									currPageNumber === pageNumber
										? "white"
										: "light"
								}
								onClick={() => {
									onPageChange(pageNumber);
									setCurrPageNumber(pageNumber);
								}}
							>
								<Box>{pageNumber}</Box>
							</Square>
						);
					})}
				</Flex>
				<Flex
					color={currentPage !== lastPage ? "light" : "hint"}
					cursor="pointer"
					onClick={() => {
						onPageChange(
							currentPage !== lastPage
								? currentPage + 1
								: currentPage
						);
						setCurrPageNumber(
							currentPage !== lastPage
								? currentPage + 1
								: currentPage
						);
					}}
				>
					{/* <Icon name="chevron-right" width="20px" /> */}
					<Center
						width={{ md: "15px", "2xl": "20px" }}
						height={"100%"}
					>
						<Icon name="chevron-right" width="100%" />
					</Center>
				</Flex>
			</Flex>
		</Flex>
	);
};

export default Pagination;
