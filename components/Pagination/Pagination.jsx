import { useEffect, useState } from "react";

/**
 * A <Pagination> component
 * TODO: Write more description here
 * @arg 	{Object}	prop	Properties passed to the component
 * @param	{string}	[prop.className]	Optional classes to pass to this component.
 * @example	`<Pagination></Pagination>`
 */
const Pagination = (props) => {
	const [count, setCount] = useState(0); // TODO: Edit state as required

	useEffect(() => {
		// TODO: Add your useEffect code here and update dependencies as required
	}, []);
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

	const onNext = () => {
		onPageChange(currentPage + 1);
	};

	const onPrevious = () => {
		onPageChange(currentPage - 1);
	};

	let lastPage = paginationRange[paginationRange.length - 1];

	return (
		<ul
			// className={classnames("pagination-container", { [className]: className })}
			className={`pagination-container ${className}`}
		>
			{/* arrow-back */}
			<li
				// className={classnames("pagination-item", {
				// 	disabled: currentPage === 1,
				// })}
				className={`pagination-item`}
				// TODO disabled where currentPage === 1
				onClick={onPrevious}
			>
				<div className="arrow left" />
			</li>
			{/* page-numbers */}
			{paginationRange.map((pageNumber, index) => {
				if (pageNumber === DOTS) {
					return (
						<li className="pagination-item dots" key={index}>
							&#8230;
						</li>
					);
				}

				return (
					<li
						// className={classnames("pagination-item", {
						// 	selected: pageNumber === currentPage,
						// })}
						className={`pagination-item`}
						// TODO selected where pageNumber === currentPage
						onClick={() => onPageChange(pageNumber)}
						key={index}
					>
						{pageNumber}
					</li>
				);
			})}
			{/* arrow next */}
			<li
				// className={classnames("pagination-item", {
				// 	disabled: currentPage === lastPage,
				// })}
				className={`pagination-item`}
				// TODO disabled where currentPage === lastPage
				onClick={onNext}
			>
				<div className="arrow right" />
			</li>
		</ul>
	);
};

export default Pagination;
