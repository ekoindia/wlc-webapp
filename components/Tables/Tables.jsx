import {
	Avatar,
	Box,
	Flex,
	Table,
	TableContainer,
	Tbody,
	Td,
	Th,
	Thead,
	Tr,
	useMediaQuery,
} from "@chakra-ui/react";
import { useMemo, useState } from "react";
import { Cards, Icon, IconButtons, Pagination, Tags } from "..";

const Tables = (props) => {
	const [currentPage, setCurrentPage] = useState(1);
	const [currentSort, setCurrentSort] = useState("default");

	const [isSmallerThan770] = useMediaQuery("(max-width: 770px)");

	const {
		pageLimit: PageSize = 10,
		data: tableData,
		renderer,
		redirect,
	} = props;

	const currentTableData = useMemo(() => {
		const firstPageIndex = (currentPage - 1) * PageSize;
		const lastPageIndex = firstPageIndex + PageSize;
		return tableData.slice(firstPageIndex, lastPageIndex);
	}, [currentPage]);

	/* for row element styling */
	const getNameStyle = (name) => {
		return (
			<Flex align={"center"} gap="0.625rem">
				<Box>
					<Avatar
						bg="accent.DEFAULT"
						color="divider"
						size="sm"
						name={name}
						// src={item.link}
					/>
				</Box>
				<Box as="span">{name}</Box>
			</Flex>
		);
	};
	const getStatusStyle = (status) => {
		return <Tags status={status} />;
	};
	const getLocationStyle = (location, lat, long) => {
		return (
			<Flex alignItems={"center"}>
				<Box>{location}</Box>
				<Box>
					<IconButtons
						iconName="near-me"
						iconStyle={{
							w: "11px",
							h: "11px",
						}}
					/>
				</Box>
			</Flex>
		);
	};
	const getArrowStyle = () => {
		return (
			<Box as="span" color="hint">
				<Icon name="arrow-forward" width="24px" height="21px" />
			</Box>
		);
	};
	const getModalStyle = (data) => {
		return <Box>...</Box>;
	};

	const getTh = () => {
		return renderer.map((item, index) => {
			if (item.sorting) {
				return (
					<Th
						key={index}
						p={{ md: ".5em", xl: "1em" }}
						fontSize={{ md: "14px", xl: "16px" }}
					>
						<Flex gap={2}>
							{item.field}
							<Box as="span" onClick={onSortChange}>
								<Icon
									//name={sortIcon[currentSort]} // uncomment this to have interative sort
									name="sort"
									width="6px"
									height="13px"
								/>
							</Box>
						</Flex>
					</Th>
				);
			} else {
				return (
					<Th
						key={index}
						p={{ md: ".5em", xl: "1em" }}
						fontSize={{ md: "14px", xl: "16px" }}
					>
						{item.field}
					</Th>
				);
			}
		});
	};
	const getTr = () => {
		return currentTableData.map((item, index) => {
			return (
				<Tr
					key={index}
					onClick={redirect}
					fontSize={{ md: "14px", xl: "16px" }}
				>
					{renderer.map((r, index) => {
						return (
							<Td p={{ md: ".5em", xl: "1em" }} key={index}>
								{prepareRow(
									item,
									r,
									index +
										currentPage * PageSize -
										(PageSize - 1)
								)}
							</Td>
						);
					})}
				</Tr>
			);
		});
	};
	const prepareRow = (item, column, index) => {
		switch (column?.show) {
			case "Tag":
				return getStatusStyle(item[column.name]);
			case "Modal":
				return getModalStyle();
			case "IconButton":
				return getLocationStyle(item[column.name]);
			case "Avatar":
				return getNameStyle(item[column.name]);
			case "Arrow":
				return getArrowStyle();
			default:
				if (column?.field === "Sr. No.") {
					return index;
				} else {
					return item[column.name];
				}
		}
	};

	/* For Responsive */
	const prepareCard = () => {
		return currentTableData.map((item, index) => {
			return (
				<Cards key={index} width="100%" height>
					Hello
					{console.log(item.name)}
				</Cards>
			);
		});
	};
	/* for sort icon & icon change */
	const sortIcon = {
		ascending: "caret-up",
		descending: "caret-down",
		default: "sort",
	};
	const onSortChange = () => {
		let nextSort;

		if (currentSort === "ascending") {
			nextSort = "descending";
		} else if (currentSort === "descending") {
			nextSort = "default";
		} else {
			nextSort = "ascending";
		}

		setCurrentSort(nextSort);
	};

	return (
		<>
			<Box w="100%">
				{!isSmallerThan770 ? (
					<>
						<TableContainer
							borderRadius="10px 10px 0 0"
							mt="20px"
							border="1px solid #E9EDF1"
						>
							<Table variant={"evenStriped"} bg="white">
								<Thead bg="hint">
									<Tr>{getTh()}</Tr>
								</Thead>
								<Tbody>{getTr()}</Tbody>
							</Table>
						</TableContainer>
						{/* Pagination */}
						<Flex justify={"flex-end"}>
							<Pagination
								className="pagination-bar"
								currentPage={currentPage}
								totalCount={tableData.length}
								pageSize={PageSize}
								onPageChange={(page) => setCurrentPage(page)}
							/>
						</Flex>
					</>
				) : (
					<Box>{prepareCard()}</Box>
				)}
			</Box>
		</>
	);
};

export default Tables;
