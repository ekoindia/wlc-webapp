import React, { useEffect, useState } from "react";

/**
 * A <SearchFilterSort> component
 * TODO: Write more description here
 * @arg 	{Object}	prop	Properties passed to the component
 * @param	{string}	[prop.className]	Optional classes to pass to this component.
 * @example	`<SearchFilterSort></SearchFilterSort>`
 */
const SearchFilterSort = ({ className = "", ...props }) => {
	const [count, setCount] = useState(0); // TODO: Edit state as required

	useEffect(() => {
		// TODO: Add your useEffect code here and update dependencies as required
	}, []);

	const items = [
		{
			label: <a href="">Recently Added</a>,
			key: "0",
		},
		{
			label: (
				<a href="">
					Status : <strong>Active</strong>
				</a>
			),
			key: "1",
		},
		{
			label: (
				<a href="">
					Status : <strong>Inactive</strong>
				</a>
			),
			key: "2",
		},
	];

	function Search({ onChangeHandler }) {
		return (
			<div>
				<Input
					className={style.search_box}
					onChange={onChangeHandler}
					placeholder="Search by name or mobile number"
				/>
			</div>
		);
	}
};

export default SearchFilterSort;
