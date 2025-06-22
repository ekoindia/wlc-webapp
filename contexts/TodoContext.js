import { useCopilotAction, useCopilotReadable } from "@copilotkit/react-core";
import React, {
	createContext,
	useContext,
	useEffect,
	useMemo,
	useState,
} from "react";

/**
 * @typedef {object} TodoValue
 * @property {string[]} todos - The current list of todo notes.
 * @property {function(string):boolean} addTodo - Function to add a note.
 * @property {function(number):void} deleteTodo - Function to delete a note.
 */

/**
 * The todo context.
 * @type {React.Context<TodoValue>}
 */
const TodoContext = createContext();

const MAX_TODOS = 50;

/**
 * Custom hook to use the todo context.
 * @returns {TodoValue} The todo context.
 */
export const useTodos = () => {
	return useContext(TodoContext);
};

/**
 * Provider component for the todo context.
 * @param {object} props - The props.
 * @param {React.ReactNode} props.children - The child components.
 * @returns {React.ReactElement} The provider element.
 */
export const TodoProvider = ({ children }) => {
	const [loaded, setLoaded] = useState(false);
	const [todos, setTodos] = useState([]);

	/**
	 * Get a note by ID
	 * @param {number} id - The ID of the note to retrieve.
	 * @returns {object|null} The note object or null if not found.
	 */
	const getTodo = (id) => {
		return todos.find((todo) => todo.id === id);
	};

	/**
	 * Add a note and return true if successful, false if not
	 * @param {string} newNote - The note to add.
	 * @returns {boolean} True if the note was added, false otherwise.
	 */
	const addTodo = (newNote) => {
		if (todos.length > MAX_TODOS) {
			return false;
		}

		if (!newNote || typeof newNote !== "string" || newNote.trim() === "") {
			return false; // Ignore empty or invalid notes
		}

		setTodos([
			...todos,
			{
				id: todos.length + 1, // Simple ID generation
				note: newNote,
			},
		]);
		return true;
	};

	/**
	 * Toggle done for a note by ID
	 * @param {number} id - The ID of the note to toggle.
	 */
	const toggleTodoDone = (id) => {
		setTodos(
			todos.map((todo) =>
				todo.id === id ? { ...todo, done: !todo.done } : todo
			)
		);
	};

	/**
	 * Delete a note by ID
	 * @param {number} id - The ID of the note to delete.
	 */
	const deleteTodo = (id) => {
		setTodos(todos.filter((todo) => todo.id !== id));
	};

	// Retrieve the notes from localStorage when the component mounts
	useEffect(() => {
		const localTodos = JSON.parse(window.localStorage.getItem("todos"));
		if (localTodos?.length > 0) {
			setTodos(localTodos);
		}
		setLoaded(true);
	}, []);

	useEffect(() => {
		if (loaded) {
			window.localStorage.setItem("todos", JSON.stringify(todos));
		}
	}, [todos, loaded]);

	// MARK: Copilot
	// Define AI Copilot readable state for the todo list
	useCopilotReadable({
		description: "List of notes or todos created by the user",
		value: JSON.stringify(todos),
	});
	// Add Copilot action to add a new todo
	useCopilotAction({
		name: "add-todo",
		description:
			"Add a new note/todo to the list for the user. Whenever the user wants to remember something, add a short note here.",
		parameters: [
			{
				name: "note",
				type: "string",
				description:
					"The note to add. It can be any short text content.",
				required: true,
			},
		],
		handler: async ({ note }) => {
			console.log("[Copilot] Adding todo:", note);

			if (!note || typeof note !== "string" || note.trim() === "") {
				throw new Error("Invalid note provided.");
			}
			const success = addTodo(note);
			if (!success) {
				throw new Error("Maximum number of notes reached.");
			}
		},
	});
	// Add Copilot action to toggle a todo's done state
	useCopilotAction({
		name: "toggle-todo-done",
		description:
			"Toggle the done state of a todo. Provide the `id` of the todo to toggle.",
		parameters: [
			{
				name: "id",
				type: "number",
				description: "The ID of the todo to toggle.",
				required: true,
			},
		],
		handler: async ({ id }) => {
			console.log("[Copilot] Toggling todo with ID:", id);
			if (typeof id !== "number" || id < 1) {
				throw new Error("Invalid ID provided.");
			}
			const todo = getTodo(id);
			if (!todo) {
				throw new Error("Note not found.");
			}
			toggleTodoDone(id);
		},
	});
	// Add Copilot action to delete a todo
	useCopilotAction({
		name: "delete-todo",
		description:
			"Delete a note/todo from the list. Provide the `id` of the todo to delete.",
		parameters: [
			{
				name: "id",
				type: "number",
				description: "The ID of the todo to delete.",
				required: true,
			},
		],
		handler: async ({ id }) => {
			console.log("[Copilot] Deleting todo with ID:", id);
			if (typeof id !== "number" || id < 1) {
				throw new Error("Invalid ID provided.");
			}
			const todo = getTodo(id);
			if (!todo) {
				throw new Error("Note not found.");
			}
			deleteTodo(id);
		},
	});

	/**
	 * The value provided to the todo context.
	 * @type {TodoValue}
	 */
	const value = useMemo(() => {
		return {
			todos,
			addTodo,
			deleteTodo,
			toggleTodoDone,
			getTodo,
		};
	}, [todos]);

	return (
		<TodoContext.Provider value={value}>{children}</TodoContext.Provider>
	);
};
