// export const convertToAccordionMenuList = (data: any[], roleTxList: any) => {
// 	return data.map((item) => {
// 		const { group_interaction_ids, link, id, ...rest } = item;

// 		let processedLink = link;
// 		if (!processedLink) {
// 			processedLink = `/transaction/${id}`;
// 		}

// 		if (group_interaction_ids) {
// 			const subItems = group_interaction_ids
// 				.split(",")
// 				.map((id: string) => {
// 					const subItemId = parseInt(id, 10);
// 					return roleTxList[subItemId];
// 				});

// 			return {
// 				...rest,
// 				id,
// 				link: processedLink,
// 				subItems,
// 			};
// 		} else {
// 			return {
// 				...rest,
// 				id,
// 				link: processedLink,
// 			};
// 		}
// 	});
// };
