import type { Meta, StoryObj } from "@storybook/react";
import JsonViewer from "./JsonViewer";

const meta: Meta<typeof JsonViewer> = {
	title: "Components/JsonViewer",
	component: JsonViewer,
	tags: ["autodocs"],
	parameters: {
		layout: "padded",
	},
	argTypes: {
		data: {
			control: "object",
			description: "JSON data to display",
		},
		collapseAfterLevel: {
			control: { type: "number", min: 0, max: 10 },
			description: "Collapse nodes beyond this depth level",
		},
		animated: {
			control: "boolean",
			description: "Enable expand/collapse animations",
		},
	},
};

export default meta;
type Story = StoryObj<typeof JsonViewer>;

// Sample data matching the reference design
const sampleUserData = {
	user: {
		id: 12345,
		name: "Jane Smith",
		email: "jane.smith@example.com",
		isActive: true,
		roles: ["admin", "editor", "viewer"],
		metadata: {
			createdAt: "2024-01-15T10:30:00Z",
			lastLogin: "2024-12-30T08:45:00Z",
			preferences: {
				theme: "dark",
				notifications: {
					email: true,
					push: false,
					sms: null,
				},
			},
		},
	},
	projects: [
		{
			id: 1,
			title: "Website Redesign",
			status: "in-progress",
			team: ["Alice", "Bob", "Charlie"],
			budget: 50000,
			milestones: [
				{ name: "Design Phase", completed: true },
				{ name: "Development", completed: false },
				{ name: "Testing", completed: false },
			],
		},
		{
			id: 2,
			title: "Mobile App",
			status: "planning",
			team: [],
			budget: 75000,
			milestones: [],
		},
	],
	statistics: {
		totalUsers: 1523,
		activeToday: 847,
		revenue: 125430.5,
		growth: 0.125,
	},
	emptyObject: {},
	emptyArray: [],
	nullValue: null,
	undefinedValue: undefined,
};

/**
 * Default story showing a complex nested object
 */
export const Default: Story = {
	args: {
		data: sampleUserData,
		collapseAfterLevel: 3,
		animated: true,
	},
};

/**
 * Simple object with primitive values
 */
export const SimpleObject: Story = {
	args: {
		data: {
			name: "John Doe",
			age: 32,
			email: "john@example.com",
			verified: true,
			balance: 1250.75,
		},
		collapseAfterLevel: 10,
	},
};

/**
 * Array of items
 */
export const ArrayData: Story = {
	args: {
		data: ["Apple", "Banana", "Cherry", "Date", "Elderberry"],
	},
};

/**
 * All nodes collapsed by default
 */
export const CollapsedByDefault: Story = {
	args: {
		data: sampleUserData,
		collapseAfterLevel: 0,
	},
};

/**
 * All nodes expanded
 */
export const FullyExpanded: Story = {
	args: {
		data: sampleUserData,
		collapseAfterLevel: Infinity,
	},
};

/**
 * Without animations
 */
export const NoAnimations: Story = {
	args: {
		data: sampleUserData,
		collapseAfterLevel: 2,
		animated: false,
	},
};

/**
 * JSON string input
 */
export const JsonString: Story = {
	args: {
		data: JSON.stringify(
			{
				message: "This was a JSON string",
				parsed: true,
				count: 42,
			},
			null,
			2
		),
	},
};

/**
 * Invalid JSON string - shows error
 */
export const InvalidJson: Story = {
	args: {
		data: '{ invalid json: "missing quotes }',
	},
};

/**
 * Circular reference detection
 */
export const CircularReference: Story = {
	render: () => {
		const obj: Record<string, unknown> = {
			name: "Root",
			nested: {
				value: 123,
			},
		};
		// Create circular reference
		(obj.nested as Record<string, unknown>).parent = obj;

		return <JsonViewer data={obj} collapseAfterLevel={5} />;
	},
};

/**
 * Empty collections
 */
export const EmptyCollections: Story = {
	args: {
		data: {
			emptyObject: {},
			emptyArray: [],
			nestedEmpty: {
				also: {},
				andArray: [],
			},
		},
		collapseAfterLevel: 5,
	},
};

/**
 * Deeply nested structure
 */
export const DeeplyNested: Story = {
	args: {
		data: {
			level1: {
				level2: {
					level3: {
						level4: {
							level5: {
								level6: {
									level7: {
										value: "Deep value!",
									},
								},
							},
						},
					},
				},
			},
		},
		collapseAfterLevel: 3,
	},
};

/**
 * Primitive values only
 */
export const PrimitiveValues: Story = {
	args: {
		data: {
			string: "Hello, World!",
			number: 42,
			float: 3.14159,
			booleanTrue: true,
			booleanFalse: false,
			nullValue: null,
			undefinedValue: undefined,
		},
	},
};

/**
 * Compact view
 */
export const CompactView: Story = {
	args: {
		data: { name: "Compact view", value: 100 },
	},
};

/**
 * Large array
 */
export const LargeArray: Story = {
	args: {
		data: Array.from({ length: 50 }, (_, i) => ({
			id: i + 1,
			name: `Item ${i + 1}`,
			active: i % 2 === 0,
		})),
		collapseAfterLevel: 1,
	},
};
