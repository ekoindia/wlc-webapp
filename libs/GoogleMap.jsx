import { Spinner } from "@chakra-ui/react";
// import { Inter } from "@next/font/google";
import { GoogleMap, MarkerF, useLoadScript } from "@react-google-maps/api";
import { useMemo } from "react";

// const inter = Inter({ subsets: ["latin"] });

/**
 *
 * @param props
 */
export default function Map(props) {
	const { isLoaded } = useLoadScript({
		googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
	});
	if (!isLoaded) return <Spinner />;

	return <GMap {...props} />;
}

/**
 *
 * @param root0
 * @param root0.width
 * @param root0.height
 * @param root0.zoom
 * @param root0.lat
 * @param root0.lng
 */
function GMap({ width = "100%", height = "100%", zoom = 12, lat, lng }) {
	const center = useMemo(
		() => ({ lat: parseFloat(lat), lng: parseFloat(lng) }),
		[lat, lng]
	);

	return (
		<GoogleMap
			zoom={zoom}
			center={center}
			mapContainerStyle={{ width: width, height: height }}
		>
			<MarkerF position={center} />
		</GoogleMap>
	);
}
