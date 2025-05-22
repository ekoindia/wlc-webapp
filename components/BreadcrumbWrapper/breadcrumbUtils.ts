type Crumb = {
	label: string;
	href: string;
	isCurrent: boolean;
};

type LabelOverrides = Record<string, string>;

/**
 * Generates breadcrumb configuration data for a given path.
 * This is passed to the <BreadcrumbWrapper> component to configure the state of the breadcrumb.
 * @param {string} asPath - The full path including query parameters.
 * @param {LabelOverrides} [labelOverrides] - Optional overrides for segment labels.
 * @param {string[]} [omitPaths] - Optional array of full paths to omit from breadcrumbs.
 * @returns {Crumb[]} An array of breadcrumb objects with `label`, `href`, and `isCurrent`.
 */
export const generateBreadcrumbs = (
	asPath: string,
	labelOverrides: LabelOverrides = {},
	omitPaths: string[] = []
): Crumb[] => {
	const [pathname, query] = asPath.split("?");
	const segments = pathname.split("/").filter(Boolean);
	const lastIndex = segments.length - 1;

	/**
	 * Formats a segment into a readable label.
	 * @param {string} segment - The path segment to format.
	 * @returns {string} The formatted label.
	 */
	const formatLabel = (segment: string): string => {
		return (
			labelOverrides[segment] ??
			segment.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
		);
	};

	return segments
		.map((segment, i) => {
			const href = "/" + segments.slice(0, i + 1).join("/");
			const label = formatLabel(segment);
			const isCurrent = i === lastIndex;

			return {
				label,
				href: query && isCurrent ? `${href}?${query}` : href,
				isCurrent,
			};
		})
		.filter((crumb) => !omitPaths.includes(crumb.href)); // Omit specified paths
};
