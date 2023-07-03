import { getKBarAction } from ".";

export const getNotesAction = ({ queryValue, addTodo, toast }) => {
	console.log("getNotesAction:", queryValue, queryValue?.length);

	if (!(queryValue?.length > 2)) {
		return [];
	}

	return [
		getKBarAction({
			id: "note/add",
			name: "Save this as a Quick Note",
			subtitle: `☑️ Note will be saved on Home page`,
			keywords: queryValue,
			icon: "book",
			iconSize: "lg",
			iconColor: "#9333ea",
			// section: "Tools",
			priority: -999,
			perform: () => {
				addTodo(queryValue);
				toast({
					title: "Note Saved on Home page:",
					description:
						queryValue.length > 10
							? queryValue.slice(0, 20) + "…"
							: queryValue,
					status: "success",
					duration: 4000,
				});
			},
		}),
	];
};
