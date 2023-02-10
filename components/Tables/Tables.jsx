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
import { NetworkCard } from "components/Network";
import { TransactionHistoryCard } from "components/TransactionHistory";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { Cards, Icon, IconButtons, Menus, Pagination, Tags } from "..";

const Tables = (props) => {
	const {
		pageLimit: PageSize = 10,
		data: tableData,
		renderer,
		variant,
		tableName,
	} = props;
	const router = useRouter();
	const [currentSort, setCurrentSort] = useState("default");
	const [isSmallerThan768] = useMediaQuery("(max-width: 768px)");
	const [currentPage, setCurrentPage] = useState(1);

	useEffect(() => {
		if (router.query.page && +router.query.page !== currentPage) {
			setCurrentPage(+router.query.page);
			console.log("Table : useEffect Page", router.query.page);
		}
	}, [router.query.page]);

	const currentTableData = useMemo(() => {
		const firstPageIndex = (currentPage - 1) * PageSize;
		const lastPageIndex = firstPageIndex + PageSize;
		return tableData.slice(firstPageIndex, lastPageIndex);
	}, [currentPage]);

	const redirect = () => {
		switch (tableName) {
			case "Network":
				router.push(`my-network/profile/`);
				break;
			case "Transaction":
				router.push(`transaction-history/account-statement/`);
				break;
		}
	};

	const getTh = () => {
		return renderer.map((item, index) => {
			if (item.sorting) {
				return (
					<Th
						key={index}
						p={{ md: ".5em", xl: "1em" }}
						fontSize={{ md: "10px", xl: "11px", "2xl": "16px" }}
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
						fontSize={{ md: "10px", xl: "12px", "2xl": "16px" }}
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
					fontSize={{ md: "10px", xl: "12px", "2xl": "16px" }}
				>
					{renderer.map((r, rIndex) => {
						return (
							<Td p={{ md: ".5em", xl: "1em" }} key={rIndex}>
								{prepareCol(
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
	const prepareCol = (item, column, index) => {
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
			if (tableName === "Network") {
				return (
					<Cards
						key={index}
						width="100%"
						height="auto"
						p="15px"
						onClick={redirect}
					>
						<NetworkCard item={item} />
					</Cards>
				);
			} else if (tableName === "Transaction") {
				return (
					<Cards
						key={index}
						width="100%"
						height="auto"
						p="15px"
						onClick={redirect}
					>
						<TransactionHistoryCard item={item} />
					</Cards>
				);
			}
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
				{!isSmallerThan768 ? (
					<>
						<TableContainer
							borderRadius="10px 10px 0 0"
							mt={{ base: "20px", "2xl": "10px" }}
							border="1px solid #E9EDF1"
							css={{
								"&::-webkit-scrollbar": {
									height: "0.8vw",
								},
								"&::-webkit-scrollbar-track": {
									height: "0.8vw",
								},
								"&::-webkit-scrollbar-thumb": {
									background: "#D2D2D2",
									borderRadius: "5px",
								},
							}}
						>
							<Table variant={variant} bg="white">
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
								onPageChange={(page) => {
									console.log(page);
									router.query.page = page;
									console.log("Page", page);
									router.replace(router);
									setCurrentPage(page);
								}}
							/>
						</Flex>
					</>
				) : (
					<Flex
						direction="column"
						gap="4"
						alignItems="center"
						mt={"15px"}
					>
						{prepareCard()}
					</Flex>
				)}
			</Box>
		</>
	);
};

export default Tables;

/* for row element styling */
export const getNameStyle = (name) => {
	return (
		<Flex align={"center"} gap="0.625rem">
			<Box>
				<Avatar
					bg="accent.DEFAULT"
					color="divider"
					size={{ base: "sm", sm: "sm", md: "xs", lg: "sm" }}
					name={name[0]}
					// src={item.link}
				/>
			</Box>
			<Box as="span">{name}</Box>
		</Flex>
	);
};
export const getStatusStyle = (status) => {
	return (
		<Tags
			size={{ base: "sm", lg: "xs", "2xl": "md" }}
			px={"10px"}
			status={status}
		/>
	);
};
export const getLocationStyle = (
	location,
	lat = 23.1967657,
	long = 77.4270079
) => {
	return (
		<Flex alignItems={"center"}>
			<Box>{location}</Box>
			<IconButtons
				iconSize={"xs"}
				iconName="near-me"
				iconStyle={{
					width: "12px",
					height: "12px",
				}}
				onClick={(e) => {
					openGoogleMap(lat, long);
					e.stopPropagation();
				}}
			/>
		</Flex>
	);
};
export const getArrowStyle = () => {
	return (
		<Box
			color="hint"
			width={{ md: "16px", lg: "20px", "2xl": "24px" }}
			height={{ md: "16px", lg: "20px", "2xl": "24px" }}
		>
			<Icon name="arrow-forward" width="100%" />
		</Box>
	);
};
export const getModalStyle = (data) => {
	return (
		<>
			<Menus
				minH={{ base: "25px", xl: "25px", "2xl": "30px" }}
				minW={{ base: "25px", xl: "25px", "2xl": "30px" }}
				width={{ base: "25px", xl: "25px", "2xl": "30px" }}
				height={{ base: "25px", xl: "25px", "2xl": "30px" }}
				iconStyles={{ height: "15px", width: "4px" }}
				onClick={(e) => {
					e.stopPropagation();
				}}
			/>
		</>
	);
};
export const openGoogleMap = ({ latitude, longitude }) => {
	const lat = parseFloat(latitude);
	const lng = parseFloat(longitude);
	window.open(`https://maps.google.com/?q=${lat},${lng}`, "_blank");
};
