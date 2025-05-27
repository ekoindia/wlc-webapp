export interface BreadcrumbItem {
	href: string; // URL for the breadcrumb
	label: string; // Display label for the breadcrumb
	isCurrent: boolean; // Indicates if the breadcrumb is the current page
}

export interface BreadcrumbsData {
	[path: string]: string; // Static mapping: full URL → label
}

export interface LabelOverrides {
	[segment: string]: string; // Dynamic override: segment → label
}

/**
 * Generates breadcrumb configuration data for a given path.
 * This is passed to the <BreadcrumbWrapper> component to configure the state of the breadcrumb.
 * @param {string} asPath - The full path including query parameters.
 * @param {LabelOverrides} [labelOverrides] - Optional overrides for segment labels.
 * @param {string[]} [omitPaths] - Optional array of full paths to omit from breadcrumbs.
 * @returns {BreadcrumbItem[]} An array of breadcrumb objects with `label`, `href`, and `isCurrent`.
 */
export const generateBreadcrumbs = (
	asPath: string,
	labelOverrides: LabelOverrides = {},
	omitPaths: string[] = []
): BreadcrumbItem[] => {
	const [pathname, query] = asPath.split("?");
	const segments = pathname.split("/").filter(Boolean);
	const lastIndex = segments.length - 1;

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
		.filter((crumb) => !omitPaths.includes(crumb.href));
};

interface ResolveBreadcrumbsParams {
	breadcrumbsData?: BreadcrumbsData;
	providedCrumbs?: BreadcrumbItem[];
	useDynamic?: boolean;
	labelOverrides?: LabelOverrides;
	omitPaths?: string[];
	slug?: string;
	asPath: string;
	pathname: string;
}

/**
 * Resolves the final breadcrumb list based on props and route state.
 * @param {ResolveBreadcrumbsParams} params - Input parameters.
 * @returns {BreadcrumbItem[]} Final list of resolved breadcrumbs.
 * @example
 * // Example with providedCrumbs
 * resolveBreadcrumbs({ providedCrumbs: [{ href: "/", label: "Home", isCurrent: true }] });
 * @example
 * // Example with dynamic generation
 * resolveBreadcrumbs({ asPath: "/dashboard/settings", useDynamic: true });
 */
export function resolveBreadcrumbs(
	params: ResolveBreadcrumbsParams
): BreadcrumbItem[] {
	const {
		breadcrumbsData,
		providedCrumbs,
		useDynamic,
		labelOverrides = {},
		omitPaths = [],
		slug,
		asPath,
		pathname,
	} = params;
	if (providedCrumbs?.length) return providedCrumbs;

	if (useDynamic) {
		return generateBreadcrumbs(asPath, labelOverrides, omitPaths);
	}

	if (breadcrumbsData) {
		const currentURL = pathname.replace("[slug]", slug || "");
		const pathArray = currentURL.split("/").filter(Boolean);

		return pathArray.reduce<BreadcrumbItem[]>((acc, _path, index) => {
			const URL = `/${pathArray.slice(0, index + 1).join("/")}`;
			if (breadcrumbsData[URL]) {
				acc.push({
					href: URL,
					label: breadcrumbsData[URL],
					isCurrent: index === pathArray.length - 1,
				});
			}
			return acc;
		}, []);
	}

	return [];
}
