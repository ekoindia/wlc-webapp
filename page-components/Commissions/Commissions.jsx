import { Flex } from "@chakra-ui/react";
import { Headings, Tags } from "components";
import { tableRowLimit } from "constants";
import { useCommissionSummary } from "contexts";
import { useEffect, useState } from "react";
import { formatCurrency } from "utils/numberFormat";
import { CommissionsTable } from ".";

const limit = tableRowLimit?.XLARGE; // Page size

const Commissions = ({ prod_id }) => {
	const [tableData, setTableData] = useState();
	const [currentPage, setCurrentPage] = useState(1);
	const [tagValue, setTagValue] = useState("");

	const commissionData = useCommissionSummary();

	const handleTagClick = (id) => {
		setTagValue(id);
	};
	useEffect(() => {
		if (prod_id) {
			setTagValue(prod_id);
		}
	}, [prod_id]);

	useEffect(() => {
		if (!tagValue || !commissionData) return;

		const tagData = commissionData?.data[tagValue].slabs;

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
						transaction_value: !(slab_from || slab_to)
							? "Any"
							: `${slab_from ? `₹ ${slab_from}` : "Any"} - ${
									slab_to ? `₹ ${slab_to || 0}` : "Any"
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
						biller_name: biller_name || "-",
					})
				)
			);
		}
	}, [tagValue, commissionData]);

	const commissionProducts = Object.keys(commissionData?.data || {}).map(
		(id) => ({
			id,
			label: commissionData?.data[id].label || id,
		})
	);

	if (!commissionProducts?.length) return null;

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
				{commissionProducts?.map((tx) => (
					<Tags
						key={tx?.id}
						status={tx?.label}
						w="fit-content"
						h="32px"
						margin="0 10px 12px 0"
						size="lg"
						px="10px"
						borderRadius="16"
						fontSize="12"
						bg={tx?.id === tagValue ? "accent.DEFAULT" : "divider"}
						color={tx?.id === tagValue ? "white" : "#555"}
						_hover={{ bg: "accent.DEFAULT", color: "white" }}
						onClick={() => handleTagClick(tx.id)}
					/>
				))}
			</Flex>
			<CommissionsTable
				pageNumber={currentPage}
				setPageNumber={setCurrentPage}
				tableRowLimit={limit}
				tagClicked={tagValue}
				commissionData={tableData}
			/>
		</Flex>
	);
};

export default Commissions;
