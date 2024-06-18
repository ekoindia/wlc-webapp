import {
	Button,
	Flex,
	Popover,
	PopoverContent,
	PopoverTrigger,
	useToken,
} from "@chakra-ui/react";
import { colorThemes } from "constants/colorThemes";
import { useEffect, useState } from "react";
import { SketchPicker } from "react-color";
import { CgColorPicker } from "react-icons/cg";

const DefaultColorPresets = [
	"#D0021B",
	"#F5A623",
	"#F8E71C",
	"#8B572A",
	"#7ED321",
	"#417505",
	"#BD10E0",
	"#9013FE",
	"#4A90E2",
	"#50E3C2",
	"#B8E986",
	"#000000",
	"#4A4A4A",
	"#9B9B9B",
	"#FFFFFF",
];

// Declare the props interface
interface ColorPickerWidgetProps {
	[key: string]: any;
}

/**
 * A custom color picker component.
 *
 * @component
 * @param {object} prop - Properties passed to the component
 * @param {boolean} [themeEditor] - Adds all preset theme colors to the color picker for easily selecting those colors.
 * @param {string} [prop.defaultColor] - Default color
 * @param {function} [prop.onColorChange] - Callback function to handle color change
 * @param {...*} rest - Rest of the props
 * @example	`<ColorPickerWidget />`
 */
const ColorPickerWidget = ({
	label = "Select Color",
	themeEditor = false,
	defaultColor,
	onColorChange,
	...rest
}: ColorPickerWidgetProps) => {
	const [presetColors, setPresetColors] = useState([]);
	const [color, setColor] = useState(defaultColor || colorThemes[0].primary);
	const [primary, accent] = useToken("colors", [
		"primary.DEFAULT",
		"accent.DEFAULT",
	]);
	const [eyeDropperAvailable, setEyeDropperAvailable] = useState(false);

	// Check if EyeDropper feature is supported by the browser
	useEffect(() => {
		if (window.EyeDropper) {
			setEyeDropperAvailable(true);
		}
	}, [setEyeDropperAvailable]);

	// Add default set of colors to the color picker
	useEffect(() => {
		const presets = [];
		const clrKey = {};

		if (themeEditor) {
			colorThemes.forEach((theme) => {
				[theme.primary, theme.accent].forEach((clr, i) => {
					if (!clrKey[clr]) {
						clrKey[clr] = true;
						presets.push({
							color: clr,
							title:
								theme.name + (i === 0 ? " Primary" : " Accent"),
						});
					}
				});
			});
		} else {
			presets.push({ color: primary, title: "Primary" });
			presets.push({ color: accent, title: "Accent" });
		}

		presets.push(...DefaultColorPresets.map((color) => ({ color })));

		setPresetColors(presets);
	}, [colorThemes, primary, accent, themeEditor]);

	const onEyeDropperClick = () => {
		const eyeDropper = new window.EyeDropper();
		eyeDropper.open().then((resultColor) => {
			setColor(resultColor.sRGBHex);
			onColorChange && onColorChange({ hex: resultColor.sRGBHex });
		});
	};

	// MARK: JSX
	return (
		<Flex direction="row" align="center" gap={6} {...rest}>
			<Popover>
				<PopoverTrigger>
					<Button
						size="sm"
						bg={color}
						borderRadius={3}
						color="white"
						border="4px solid #CCC"
						_hover={{ borderColor: "#999" }}
					>
						{label}
					</Button>
				</PopoverTrigger>
				<PopoverContent
					alignItems="center"
					bg="transparent"
					width="min-content"
				>
					{/* <PopoverArrow /> */}
					{/* <PopoverCloseButton /> */}
					<SketchPicker
						disableAlpha
						presetColors={presetColors}
						color={color}
						onChange={(clr) => setColor(clr.hex)}
						onChangeComplete={(clr) =>
							onColorChange && onColorChange(clr)
						}
					/>
				</PopoverContent>
			</Popover>

			{eyeDropperAvailable ? (
				<CgColorPicker
					onClick={onEyeDropperClick}
					style={{
						borderRadius: "50%",
						background: "#CCC",
						width: "32px",
						height: "32px",
						padding: "8px",
						cursor: "pointer",
					}}
				/>
			) : null}
		</Flex>
	);
};

export default ColorPickerWidget;
