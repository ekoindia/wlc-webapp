import React, { createContext, useContext, useEffect, useState } from "react";

/**
 * @typedef {Object} NoteValue
 * @property {string} note - The current note.
 * @property {Date} updatedAt - The date and time when the note was last updated.
 * @property {function(string):void} setNote - Function to update the note.
 * @property {function():void} deleteNote - Function to delete the note.
 */

/**
 * The note context.
 * @type {React.Context<NoteValue>}
 */
const NoteContext = createContext();

/**
 * Custom hook to use the note context.
 * @returns {NoteValue} The note context.
 */
export const useNote = () => {
	return useContext(NoteContext);
};

/**
 * Provider component for the note context.
 * @param {Object} props - The props.
 * @param {React.ReactNode} props.children - The child components.
 * @returns {React.ReactElement} The provider element.
 */
export const NoteProvider = ({ children }) => {
	const [note, setNoteState] = useState({ note: "", updatedAt: null });

	// Function to set note and update the updatedAt timestamp
	const setNote = (newNote) => {
		const note = { note: newNote, updatedAt: new Date().toISOString() };
		setNoteState(note);
		window.localStorage.setItem("note", JSON.stringify(note));
	};

	// Retrieve the note from localStorage when the component mounts
	useEffect(() => {
		const localNoteStr = window.localStorage.getItem("note");
		if (localNoteStr) {
			const localNote = JSON.parse(localNoteStr);
			if (localNote && localNote.note) {
				setNoteState(localNote);
			}
		}
	}, []);

	/**
	 * Deletes the note from local storage and updates state.
	 */
	const deleteNote = () => {
		window.localStorage.removeItem("note");
		setNoteState({ note: "", updatedAt: null });
	};

	/**
	 * The value provided to the note context.
	 * @type {NoteValue}
	 */
	const value = {
		note: note.note,
		updatedAt: note.updatedAt,
		setNote,
		deleteNote,
	};

	return (
		<NoteContext.Provider value={value}>{children}</NoteContext.Provider>
	);
};
