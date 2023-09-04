import { useMemo } from "react";

export const DOTS = "...";

const range = (start, end) =>
	Array.from({ length: end - start + 1 }, (_, idx) => idx + start);

const usePagination = ({
	totalCount,
	pageSize,
	siblingCount = 1,
	currentPage,
	tableDataSize,
}) => {
	const pagination = useMemo(() => {
		if (totalCount === undefined) {
			const hasNextPage = tableDataSize >= pageSize;
			return hasNextPage;
		} else {
			const totalPageCount = Math.ceil(totalCount / pageSize);

			// Pages count is determined as siblingCount + firstPage + lastPage + currentPage + 2*DOTS
			const totalPageNumbers = siblingCount + 5;

			//If the number of pages is less than the page numbers we want to show in our pagination Component, we return the range [1..totalPageCount]
			if (totalPageNumbers >= totalPageCount) {
				return range(1, totalPageCount);
			}

			const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
			const rightSiblingIndex = Math.min(
				currentPage + siblingCount,
				totalPageCount
			);

			//We do not want to show dots if there is only one position left after/before the left/right page count as that would lead to a change our Pagination component size which we do not want
			const shouldShowLeftDots = leftSiblingIndex > 2;
			const shouldShowRightDots = rightSiblingIndex < totalPageCount - 2;

			if (!shouldShowLeftDots && shouldShowRightDots) {
				const leftItemCount = 3 + 2 * siblingCount;
				const leftRange = range(1, leftItemCount);
				return [...leftRange, DOTS, totalPageCount];
			}

			if (shouldShowLeftDots && !shouldShowRightDots) {
				const rightItemCount = 3 + 2 * siblingCount;
				const rightRange = range(
					totalPageCount - rightItemCount + 1,
					totalPageCount
				);
				return [1, DOTS, ...rightRange];
			}

			if (shouldShowLeftDots && shouldShowRightDots) {
				const middleRange = range(leftSiblingIndex, rightSiblingIndex);
				return [1, DOTS, ...middleRange, DOTS, totalPageCount];
			}
		}
	}, [totalCount, pageSize, siblingCount, currentPage, tableDataSize]);

	return pagination;
};

export default usePagination;
