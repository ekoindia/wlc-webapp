import { Flex } from "@chakra-ui/react";
import { Headings, Tags } from "components";
import { tableRowLimit } from "constants";
import { useCommisionSummary } from "contexts";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { formatCurrency } from "utils/numberFormat";
import { CommissionsTable } from ".";

const limit = tableRowLimit?.XLARGE; // Page size

const Commissions = () => {
	const [tableData, setTableData] = useState();
	const [currentPage, setCurrentPage] = useState(1);
	const [tagValue, setTagValue] = useState("");
	const { query } = useRouter();

	const commisionData = useCommisionSummary();

	const handleTagClick = (status) => {
		setTagValue(status?.toLowerCase());
	};
	useEffect(() => {
		if (query?.id) {
			setTagValue(query?.id?.toLowerCase());
		}
	}, [query]);

	useEffect(() => {
		if (tagValue && commisionData) {
			const tagData = commisionData?.pricing_commission_data?.filter(
				({ product }) => product.toLowerCase() === tagValue
			);
			if (tagData?.length > 0) {
				setTableData(
					tagData.map(
						({
							slab_from,
							slab_to,
							value,
							biller_name,
							calc_type,
							min_value,
							max_value,
						}) => ({
							transaction_value: `₹ ${slab_from || 0} - ₹ ${
								slab_to || 0
							}`,
							commission:
								calc_type === 1
									? `${value}% (min: ${formatCurrency(
											min_value,
											"INR",
											false,
											true
									  )}, max: ${formatCurrency(
											max_value,
											"INR",
											false,
											true
									  )})`
									: value,
							biller_name,
						})
					)
				);
			}
		}
	}, [tagValue, commisionData]);

	return (
		<Flex
			w="full"
			h="auto"
			p={{ base: "0px", md: "20px", "2xl": "14px 30px 30px 30px" }}
			direction="column"
			border="card"
			borderRadius="10"
			boxShadow="0px 5px 15px #0000000D"
			bg="white"
			px="16px"
		>
			<Headings title="Know Your Commissions" />
			<Flex w="full" h="auto" direction="row" py="1px">
				{commisionData?.pricing_commission_data?.map((tx) => (
					<Tags
						key={tx.status}
						w="fit-content"
						h="32px"
						margin="0 10px 12px 0"
						size="lg"
						px="10px"
						status={tx.product}
						borderRadius="16"
						fontSize="12"
						bg={
							tx.product.toLowerCase() === tagValue
								? "#11299E"
								: "#E9EDF1"
						}
						color={
							tx.product.toLowerCase() === tagValue
								? "white"
								: "#555"
						}
						_hover={{ bg: "#11299E", color: "white" }}
						onClick={() => handleTagClick(tx.product)}
					/>
				))}
			</Flex>
			<CommissionsTable
				pageNumber={currentPage}
				setPageNumber={setCurrentPage}
				tableRowLimit={limit}
				tagClicked={tagValue}
				commisionData={tableData}
			/>
		</Flex>
	);
};

export default Commissions;
