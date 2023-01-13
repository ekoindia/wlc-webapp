import axios from "axios";
import { useEffect, useState, useMemo } from "react";
import { useTable, useSortBy } from "react-table";

const url = "https://fakestoreapi.com/products";

const fetchData = [
	{
		id: 1,
		title: "Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops",
		price: 10.012023,
		description: "Your perfect",
		category: "men's clothing",
		image: "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg",
		rating: {
			rate: 3.9,
			count: 120,
		},
	},
];

import React from "react";
import {
	Center,
	Heading,
	Spinner,
	Table,
	Tbody,
	Thead,
	Tr,
	Th,
	Td,
	Image,
} from "@chakra-ui/react";

const tableColumn = [
	{
		Header: "Sr.No.",
		accessor: "id",
	},
	{
		Header: "",
		accessor: "image",
		Cell: ({ row }) => <Image src={row.values.image} h="30px" />,
	},
	{
		Header: "Name",
		accessor: "category",
	},

	{
		Header: "Mobile Number",
		accessor: "price",
	},
	{
		Header: "Type",
		accessor: "NNN",
	},
	{
		Header: "Onboarded on",
		accessor: "Onboarderon",
	},
	{
		Header: "Account Status",
		accessor: "hjbghv",
	},

	{
		Headers: " Eko Code",
		accessor: "i",
	},
	{
		Headers: " Location",
		accessor: "hvhv",
	},
];

const Tables = () => {
	const [products, setproducts] = useState([]);
	const columns = useMemo(() => tableColumn, []);
	const data = useMemo(() => products, [products]);
	const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
		useTable(
			{
				columns,
				data,
			},
			useSortBy
		);

	useEffect(() => {
		const fetchProducts = async () => {
			try {
				const { data } = await axios.get(url);
				setproducts(data);
			} catch (error) {
				console.log(error);
			}
		};
		fetchProducts();
	}, []);

	console.log("bhjhgfvv", products);

	if (products.length === 0)
		return (
			<Center>
				<Spinner />
			</Center>
		);

	return (
		<>
			<Heading>React Table</Heading>
			<Table variant="striped" color="#F2F2F" {...getTableProps()}>
				<Thead
					bg="#D2D2D2"
					color="#0C243B"
					border=" 1px solid #E9EDF1;"
				>
					{headerGroups.map((headerGroups) => (
						<Tr {...headerGroups.getHeaderGroupProps()}>
							{headerGroups.headers.map((column) => (
								<Th
									{...column.getHeaderProps(
										column.getSortByToggleProps()
									)}
								>
									{column.render("Header")}
									{column.isSorted
										? column.isSortedDesc
											? " "
											: ""
										: ""}
								</Th>
							))}
						</Tr>
					))}
				</Thead>
				<Tbody {...getTableBodyProps()}>
					{rows.map((row, i) => {
						prepareRow(row);
						return (
							<Tr {...row.getRowProps()}>
								{row.cells.map((cell) => (
									<Td {...cell.getCellProps()}>
										{cell.render("Cell")}
									</Td>
								))}
							</Tr>
						);
					})}
				</Tbody>
			</Table>
		</>
	);
};

export default Tables;
