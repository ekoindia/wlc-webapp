import { YoutubePlayer } from "components/YoutubePlayer";
import { render, screen } from "test-utils";

describe("YoutubePlayer component", () => {
	const testVideoId = "dQw4w9WgXcQ";

	it("renders successfully with video ID", () => {
		const { container } = render(<YoutubePlayer videoId={testVideoId} />);
		expect(container).not.toBeEmptyDOMElement();

		const iframe = container.querySelector("iframe");
		expect(iframe).toBeInTheDocument();
		expect(iframe).toHaveAttribute(
			"src",
			`https://www.youtube.com/embed/${testVideoId}`
		);
		expect(iframe).toHaveAttribute("title", "YouTube video player");
	});

	it("renders with custom title", () => {
		const customTitle = "Custom Video Player";
		render(<YoutubePlayer videoId={testVideoId} title={customTitle} />);

		const iframe = screen.getByTitle(customTitle);
		expect(iframe).toBeInTheDocument();
	});

	it("renders nothing when video ID is missing", () => {
		// Silence console warnings for this test
		const originalWarn = console.warn;
		console.warn = jest.fn();

		const { container } = render(<YoutubePlayer videoId="" />);
		expect(container.querySelector("iframe")).not.toBeInTheDocument();

		// Restore console.warn
		console.warn = originalWarn;
	});
});
