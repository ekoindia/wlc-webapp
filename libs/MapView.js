export default function MapView({ w, h, lat, lng }) {
	return (
		<iframe
			width={w}
			height={h}
			frameborder="0"
			src={`https://www.bing.com/maps/embed?h=${h}&w=${w}&cp=${lat}~${lng}&lvl=18&typ=s&sty=r&src=SHELL&FORM=MBEDV8`}
			scrolling="no"
			style={{ overflow: "hidden" }}
		></iframe>
	);
}
