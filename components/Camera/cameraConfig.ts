/**
 *   All possible resolution sets
 */
export const resolutions = [
	//{ w:{min:1920, max:1980}, h:{min:1080, max:1200} },
	{ w: 1920, h: 1080 },
	{ w: 1280, h: 720 },
	{ w: { min: 1280, max: 1920 }, h: { min: 720, max: 1200 } },
	{ w: { min: 1024, max: 1920 }, h: { min: 768, max: 1200 } },
	{ w: { min: 960, max: 1920 }, h: { min: 720, max: 1200 } },
	{ w: { min: 960, max: 1920 }, h: { min: 540, max: 1200 } },
	{ w: { min: 800, max: 1920 }, h: { min: 600, max: 1200 } },
	{ w: { min: 848, max: 1920 }, h: { min: 480, max: 1200 } },
	{ w: { min: 640, max: 1920 }, h: { min: 480, max: 1200 } },
	{ w: { min: 640, max: 1920 }, h: { min: 360, max: 1200 } },
	{ w: undefined, h: undefined },
];

/**
 * Facing modes for camera
 */
export const FACING_MODE_USER = "user";
export const FACING_MODE_ENVIRONMENT = "environment";
