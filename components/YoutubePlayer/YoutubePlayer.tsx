import { AspectRatio, Box } from "@chakra-ui/react";

/**
 * YoutubePlayer component props
 */
interface YoutubePlayerProps {
	/**
	 * YouTube video ID (e.g., "dQw4w9WgXcQ" from https://www.youtube.com/watch?v=dQw4w9WgXcQ)
	 */
	videoId: string;
	/**
	 * Title for the iframe for accessibility
	 * @default "YouTube video player"
	 */
	title?: string;
	/**
	 * Allow fullscreen mode
	 * @default true
	 */
	allowFullScreen?: boolean;
	/**
	 * Custom aspect ratio for the player
	 * @default 16/9
	 */
	aspectRatio?: number;
	/**
	 * Maximum width of the player
	 * @default "100%"
	 */
	maxWidth?: string | number;
}

/**
 * A responsive YouTube video player component
 * @param root0 Component props
 * @param root0.videoId The YouTube video ID
 * @param root0.title Title for the iframe (accessibility)
 * @param root0.allowFullScreen Whether to allow fullscreen mode
 * @param root0.aspectRatio Custom aspect ratio for the player
 * @param root0.maxWidth Maximum width of the player
 */
export const YoutubePlayer = ({
	videoId,
	title = "YouTube video player",
	allowFullScreen = true,
	aspectRatio = 16 / 9,
	maxWidth = "100%",
}: YoutubePlayerProps): JSX.Element => {
	if (!videoId) {
		return null;
	}

	const embedUrl = `https://www.youtube.com/embed/${videoId}`;

	return (
		<Box maxW={maxWidth} mx="auto">
			<AspectRatio ratio={aspectRatio}>
				<iframe
					title={title}
					src={embedUrl}
					allowFullScreen={allowFullScreen}
					allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
					frameBorder="0"
					loading="lazy"
				/>
			</AspectRatio>
		</Box>
	);
};

YoutubePlayer.displayName = "YoutubePlayer";
