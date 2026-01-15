# WaffleChart Component

A simple, customizable waffle chart component for visualizing data as a grid of colored squares (circles).

## Features

- **Responsive Grid**: Configurable rows and columns
- **Data-driven**: Takes an array of objects with values and labels
- **Interactive Tooltip**: Hover to see all categories with their percentages
- **Smooth Animations**: CSS-only staggered entrance animation with hover effects
- **Auto-color Generation**: Uses the `useHslColor` hook to generate unique colors for each data category
- **Custom Colors**: Supports custom color arrays
- **Flexible Sizing**: Configurable square size and gap between squares
- **TypeScript Support**: Fully typed with TypeScript interfaces

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `data` | `WaffleChartData[]` | **Required** | Array of objects containing `value` (number) and `label` (string) |
| `rows` | `number` | `10` | Number of rows for the chart |
| `cols` | `10` | Number of columns for the chart |
| `colors` | `string[]` | `undefined` | Optional array of color codes for each value in order |
| `size` | `string` | `"8px"` | Size (length & width) of individual squares |
| `gap` | `string` | `"4px"` | Gap between squares (both horizontal and vertical) |
| `animationDuration` | `string` | `"0.6s"` | Duration of entrance animation for each square |
| `animationDelay` | `string` | `"0.02s"` | Base delay multiplied by diagonal position (row + col) for staggered effect |

## Usage

### Basic Usage

```tsx
import { WaffleChart } from "components";

const data = [
  { value: 30, label: "Category A" },
  { value: 20, label: "Category B" },
  { value: 15, label: "Category C" },
  { value: 35, label: "Category D" },
];

function MyComponent() {
  return <WaffleChart data={data} />;
}
```

### Custom Colors

```tsx
import { WaffleChart } from "components";

const data = [
  { value: 25, label: "Red Category" },
  { value: 35, label: "Blue Category" },
  { value: 40, label: "Green Category" },
];

const colors = ["#FF6B6B", "#4ECDC4", "#45B7D1"];

function MyComponent() {
  return <WaffleChart data={data} colors={colors} />;
}
```

### Custom Dimensions and Styling

```tsx
import { WaffleChart } from "components";

const data = [
  { value: 60, label: "Majority" },
  { value: 40, label: "Minority" },
];

function MyComponent() {
  return (
    <WaffleChart
      data={data}
      rows={5}
      cols={8}
      size="12px"
      gap="5px"
    />
  );
}
```

### Custom Animation Timing

```tsx
import { WaffleChart } from "components";

const data = [
  { value: 30, label: "Fast Animation" },
  { value: 70, label: "Slow Animation" },
];

function MyComponent() {
  return (
    <WaffleChart
      data={data}
      animationDuration="1.2s"
      animationDelay="0.05s"
    />
  );
}
```

## Data Format

The `data` prop expects an array of objects with the following structure:

```typescript
interface WaffleChartData {
  value: number;  // The numeric value for this category
  label: string;  // The label/name for this category
}
```

## How It Works

1. **Value Calculation**: The component sums all values in the data array to calculate the total
2. **Percentage Distribution**: Each data item's value is converted to a percentage of the total
3. **Square Allocation**: The percentage is used to determine how many squares each category gets
4. **Tooltip Generation**: Calculates and formats percentages for display in the hover tooltip
5. **Color Assignment**:
   - If `colors` prop is provided, uses those colors in order
   - If not provided, generates unique colors using the `useHslColor` hook based on each label
6. **Rendering**: Creates a CSS Grid with the specified dimensions and fills it with colored circles

## Interactive Features

### Animations
The component features smooth, CSS-only animations that enhance the user experience:

**Entrance Animation:**
- Diagonal staggered entrance effect from top-left to bottom-right
- Each square's delay is calculated as (row + column) × animationDelay
- Each square starts at scale(0) and animates to scale(1) with a slight overshoot
- Creates a wave-like diagonal sweep across the grid
- 0.6s duration with ease-out timing for smooth motion

**Hover Effects:**
- Individual squares scale up to 115% on hover
- Smooth transitions for background color changes
- 0.2s transition duration for responsive feel

### Tooltip
The component includes an interactive tooltip that appears when hovering over the chart. The tooltip displays:
- All category labels with their corresponding percentages
- Multi-line format for easy reading
- Automatic percentage calculation based on data values

The tooltip uses Chakra UI's `Tooltip` component with:
- Top placement by default
- Arrow indicator
- Small font size for readability
- Help cursor to indicate interactivity

## Styling

The component uses:
- **CSS Grid** for layout
- **Circular squares** (border-radius: 50%)
- **Chakra UI spacing** and color utilities
- **Responsive design** principles

Empty squares (when data doesn't fill the entire grid) are rendered as transparent circles with a subtle border.

## Example Use Cases

- **Survey Results**: Visualize poll or survey responses
- **Market Share**: Display company market share data
- **Demographics**: Show population or user demographic breakdowns
- **Progress Tracking**: Visualize completion rates or progress
- **Budget Allocation**: Display spending or budget distribution

## Testing

The component includes comprehensive tests covering:
- Basic rendering
- Custom props application
- Edge cases (empty data, zero values)
- Color handling
- Grid dimension calculations
