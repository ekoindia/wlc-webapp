import React, { createContext, useContext, useEffect, useState } from "react";

/**
 * @typedef {Object} TodoValue
 * @property {string[]} todos - The current list of todo notes.
 * @property {function(string):boolean} addTodo - Function to add a note.
 * @property {function(number):void} deleteTodo - Function to delete a note.
 */

/**
 * The todo context.
 * @type {React.Context<TodoValue>}
 */
const TodoContext = createContext();

const MAX_TODOS = 10;

/**
 * Custom hook to use the todo context.
 * @returns {TodoValue} The todo context.
 */
export const useTodos = () => {
	return useContext(TodoContext);
};

/**
 * Provider component for the todo context.
 * @param {Object} props - The props.
 * @param {React.ReactNode} props.children - The child components.
 * @returns {React.ReactElement} The provider element.
 */
export const TodoProvider = ({ children }) => {
	const [loaded, setLoaded] = useState(false);
	const [todos, setTodos] = useState([]);

	// Function to add a note and return true if successful, false if not
	const addTodo = (newNote) => {
		if (todos.length < MAX_TODOS) {
			setTodos([...todos, newNote]);
			return true;
		}
		return false;
	};

	// Function to delete a note by index
	const deleteTodo = (index) => {
		setTodos(todos.filter((_, i) => i !== index));
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

	/**
	 * The value provided to the todo context.
	 * @type {TodoValue}
	 */
	const value = {
		todos,
		addTodo,
		deleteTodo,
	};

	return (
		<TodoContext.Provider value={value}>{children}</TodoContext.Provider>
	);
};
