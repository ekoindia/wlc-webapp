import { Box } from "@chakra-ui/react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

// Declare the props interface
interface MarkdownProps {
	/**
	 * The markdown content to be rendered
	 */
	children: string;
	/**
	 * Additional properties to be passed to the component
	 */
	[key: string]: any;
}

/**
 * Component to render Markdown content.
 * Supports GitHub Flavored Markdown (GFM), such as tables, strikethrough, and task lists.
 * @component
 * @param {object} prop - Properties passed to the component
 * @param {string} prop.children - The markdown content to be rendered
 * @param {...*} rest - Rest of the props
 * @example	`<Markdown>**Bold** and _italic_ text</Markdown>`
 */
const Markdown = ({ children, ...rest }: MarkdownProps) => {
	// MARK: JSX
	return (
		<Box
			as="span"
			sx={{
				".markdown-body > table": {
					fontSize: "0.8em",
					borderCollapse: "collapse",
					borderSpacing: 0,
					display: "block",
					width: "max-content",
					maxWidth: "100%",
					overflow: "auto",
					margin: "0.5em 0",
				},
				".markdown-body > table td, .markdown-body > table th": {
					padding: "6px 10px",
					border: "1px solid #888",
				},
				".markdown-body ul, .markdown-body ol": {
					marginLeft: "1em",
					marginY: "0.5em",
					padding: 0,
				},
			}}
			{...rest}
		>
			<ReactMarkdown
				className="markdown-body"
				remarkPlugins={[remarkGfm]}
			>
				{children}
			</ReactMarkdown>
		</Box>
	);
};

export default Markdown;
