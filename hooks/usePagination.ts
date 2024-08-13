import { useMemo } from "react";

export const ELLIPSIS = "...";
const SIBLING_COUNT = 1;

const range = (start: number, end: number): number[] =>
	Array.from({ length: end - start + 1 }, (_, idx) => idx + start);

/**
 * Parameters for the `usePagination` hook.
 */
type UsePaginationParams = {
	totalCount?: number;
	pageSize: number;
	currentPage: number;
	tableDataSize?: number;
};

/**
 * Custom hook to handle pagination logic.
 * @param {UsePaginationParams} params - The parameters for pagination.
 * @param {number} [params.totalCount] - The total number of items. If undefined, the pagination will be based on `tableDataSize` and `pageSize`.
 * @param {number} params.pageSize - The number of items per page.
 * @param {number} params.currentPage - The current page number.
 * @param {number} [params.tableDataSize] - The size of the table data. Required if `totalCount` is undefined.
 * @returns {Array<number|string>} - The pagination range including ellipses if needed.
 */
const usePagination = ({
	totalCount,
	pageSize,
	currentPage,
	tableDataSize,
}: UsePaginationParams): (number | string)[] => {
	const pagination = useMemo(() => {
		if (totalCount === undefined) {
			const hasNextPage = tableDataSize >= pageSize;
			return hasNextPage ? [currentPage + 1] : [];
		} else {
			const totalPageCount = Math.ceil(totalCount / pageSize);

			// Pages count is determined as SIBLING_COUNT + firstPage + lastPage + currentPage + 2*ELLIPSIS
			const totalPageNumbers = SIBLING_COUNT + 5;

			// If the number of pages is less than the page numbers we want to show in our pagination component, return the range [1..totalPageCount]
			if (totalPageNumbers >= totalPageCount) {
				return range(1, totalPageCount);
			}

			const leftSiblingIndex = Math.max(currentPage - SIBLING_COUNT, 1);
			const rightSiblingIndex = Math.min(
				currentPage + SIBLING_COUNT,
				totalPageCount
			);

			// We do not want to show ELLIPSIS if there is only one position left after/before the left/right page count
			const shouldShowLeftEllipsis = leftSiblingIndex > 2;
			const shouldShowRightEllipsis =
				rightSiblingIndex < totalPageCount - 2;

			if (!shouldShowLeftEllipsis && shouldShowRightEllipsis) {
				const leftItemCount = 3 + 2 * SIBLING_COUNT;
				const leftRange = range(1, leftItemCount);
				return [...leftRange, ELLIPSIS, totalPageCount];
			}

			if (shouldShowLeftEllipsis && !shouldShowRightEllipsis) {
				const rightItemCount = 3 + 2 * SIBLING_COUNT;
				const rightRange = range(
					totalPageCount - rightItemCount + 1,
					totalPageCount
				);
				return [1, ELLIPSIS, ...rightRange];
			}

			if (shouldShowLeftEllipsis && shouldShowRightEllipsis) {
				const middleRange = range(leftSiblingIndex, rightSiblingIndex);
				return [1, ELLIPSIS, ...middleRange, ELLIPSIS, totalPageCount];
			}
		}
	}, [totalCount, pageSize, currentPage, tableDataSize]);

	return pagination;
};

export default usePagination;
