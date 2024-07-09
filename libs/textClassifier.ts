/**
 * Dynamically load and initialize the text-classifier (@mediaipe/tasks-vision)
 * @see https://ai.google.dev/edge/mediapipe/solutions/text/text_classifier
 * @returns {Promise<TextClassifier>} - The text classifier instance
 */
const initializeTextClassifier = async () => {
	// Dynamically load @mediaipe/tasks-vision
	const { TextClassifier, FilesetResolver } = await import(
		"@mediapipe/tasks-text"
	);

	const textFiles = await FilesetResolver.forTextTasks(
		"https://cdn.jsdelivr.net/npm/@mediapipe/tasks-text@0.10.0/wasm"
	);
	const textClassifier = await TextClassifier.createFromOptions(textFiles, {
		baseOptions: {
			modelAssetPath: `https://storage.googleapis.com/mediapipe-tasks/text_classifier/bert_text_classifier.tflite`,
		},
		maxResults: 5,
	});
	return textClassifier;
};

export { initializeTextClassifier };
