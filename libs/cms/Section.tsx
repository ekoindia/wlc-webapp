import { CSSProperties, ReactNode } from "react";

export type SectionProps = {
	children: ReactNode;
	padding?: string;
	maxWidth?: string;
	style?: CSSProperties;
};

export const Section = ({
	children,
	padding = "10px",
	maxWidth = "1280px",
	style = {},
}: SectionProps) => {
	return (
		<div
			style={{
				...style,
				paddingTop: padding,
				paddingBottom: padding,
			}}
		>
			<div style={{ maxWidth }}>{children}</div>
		</div>
	);
};
