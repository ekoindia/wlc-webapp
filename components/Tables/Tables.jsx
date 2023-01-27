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
} from "@chakra-ui/react";
import { useMemo, useState } from "react";
import { Icon, IconButtons, Pagination, Tags } from "..";

const Tables = (props) => {
	const [currentPage, setCurrentPage] = useState(1);
	const [currentSort, setCurrentSort] = useState("default");

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
					<Th key={index}>
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
				return <Th key={index}>{item.field}</Th>;
			}
		});
	};
	const getTr = () => {
		return currentTableData.map((item, index) => {
			return (
				<Tr key={index} onClick={redirect}>
					{renderer.map((r) => {
						return prepareRow(
							item,
							r,
							index + currentPage * PageSize - (PageSize - 1)
						);
					})}
				</Tr>
			);
		});
	};
	const prepareRow = (item, column, index) => {
		switch (column?.show) {
			case "Tag":
				return <Td>{getStatusStyle(item[column.name])}</Td>;
			case "Modal":
				return <Td>{getModalStyle()}</Td>;
			case "IconButton":
				return <Td>{getLocationStyle(item[column.name])}</Td>;
			case "Avatar":
				return <Td>{getNameStyle(item[column.name])}</Td>;
			case "Arrow":
				return <Td>{getArrowStyle()}</Td>;
			default:
				if (column?.field === "Sr. No.") {
					return <Td>{index}</Td>;
				} else {
					return <Td>{item[column.name]}</Td>;
				}
		}
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
			<Box w="1610px">
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
			</Box>
		</>
	);
};

export default Tables;
