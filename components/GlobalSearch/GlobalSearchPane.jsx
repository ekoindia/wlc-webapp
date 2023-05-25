import {
	KBarAnimator,
	KBarPortal,
	KBarPositioner,
	KBarResults,
	KBarSearch,
	useMatches,
} from "kbar";

function RenderResults() {
	const { results } = useMatches();

	return (
		<KBarResults
			items={results}
			onRender={({ item, active }) =>
				typeof item === "string" ? (
					<div>{item}</div>
				) : (
					<div
						style={{
							background: active ? "#eee" : "transparent",
						}}
					>
						{item.name}
					</div>
				)
			}
		/>
	);
}

export default function GlobalSearchPane() {
	return (
		<KBarPortal>
			<KBarPositioner>
				<KBarAnimator>
					<KBarSearch />
					<RenderResults />
				</KBarAnimator>
			</KBarPositioner>
		</KBarPortal>
	);
}
