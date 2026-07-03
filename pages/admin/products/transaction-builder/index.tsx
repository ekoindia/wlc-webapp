import { Flex, Text, Textarea, useDisclosure } from "@chakra-ui/react";
import { Button, Drawer, PaddingBox, PageTitle } from "components";
import { EkoConnectWidget } from "components/EkoConnectWidget";
import {
	createEmptyConfig,
	InteractionConfig,
	InteractionConfigEditor,
} from "features/products/transaction-builder";
import { useFeatureFlag } from "hooks";
import { ChangeEvent, useState } from "react";

/**
 * Transaction Builder — an admin/dev tool to test the Interaction Framework.
 *
 * Renders a custom transaction card via <EkoConnectWidget> driven by an `interaction_config`
 * object. The config is a single source of truth, editable two ways:
 *   - "Customize" — a raw JSON text field.
 *   - "Create" — a visual editor (drag-to-reorder fields + add palette).
 * Both update the same config; the widget renders it live.
 *
 * Gated behind the dev-only `INTERACTION_FRAMEWORK_TEST` feature flag and admin left-menu.
 */
const TransactionBuilderRoute = (): JSX.Element | null => {
	const [isFeatureEnabled] = useFeatureFlag("INTERACTION_FRAMEWORK_TEST");

	const customizeDrawer = useDisclosure();
	const createDrawer = useDisclosure();

	// Single source of truth for the widget.
	const [config, setConfig] = useState<InteractionConfig | undefined>(
		undefined
	);
	// Raw text shown in the "Customize" JSON field (kept in sync with `config`).
	const [rawJson, setRawJson] = useState<string>("");
	// Parse error from the "Customize" field (null = no error).
	const [parseError, setParseError] = useState<string | null>(null);

	/**
	 * Apply a structured config (from the visual editor) and mirror it to the JSON field.
	 * @param next
	 */
	const handleConfigChange = (next: InteractionConfig): void => {
		setConfig(next);
		setRawJson(JSON.stringify(next, null, 2));
		setParseError(null);
	};

	/**
	 * Parse raw JSON typed in the "Customize" field into the shared config.
	 * @param event
	 */
	const handleJsonChange = (
		event: ChangeEvent<HTMLTextAreaElement>
	): void => {
		const text = event.target.value;
		setRawJson(text);

		if (text.trim() === "") {
			setConfig(undefined);
			setParseError(null);
			return;
		}

		try {
			setConfig(JSON.parse(text));
			setParseError(null);
		} catch (error) {
			// Keep the previous valid config; just surface the error.
			setParseError(
				error instanceof Error ? error.message : "Invalid JSON"
			);
		}
	};

	if (!isFeatureEnabled) {
		return (
			<PaddingBox>
				<PageTitle title="Transaction Builder" hideBackIcon />
				<Text color="error">This feature is not available.</Text>
			</PaddingBox>
		);
	}

	return (
		<PaddingBox>
			{/* Top toolbar */}
			<Flex align="center" justify="space-between" gap="2" wrap="wrap">
				<PageTitle title="Transaction Builder" isBeta hideBackIcon />
				<Flex gap="2" ml="auto">
					<Button variant="primary" onClick={createDrawer.onOpen}>
						Create
					</Button>
					<Button variant="outline" onClick={customizeDrawer.onOpen}>
						Customize
					</Button>
				</Flex>
			</Flex>

			{/* Custom transaction card */}
			<EkoConnectWidget interaction_config={config} />

			{/* Customize side panel (raw JSON) */}
			<Drawer
				id="trxn-builder-config"
				title="Customize Interaction Config"
				placement="right"
				size="lg"
				isOpen={customizeDrawer.isOpen}
				onOpen={customizeDrawer.onOpen}
				onClose={customizeDrawer.onClose}
			>
				<Flex direction="column" gap="3" p="4" h="100%">
					<Text fontSize="sm" color="gray.600">
						Enter a valid JSON object. It is passed to the widget as
						the <code>interaction_config</code> property.
					</Text>
					<Textarea
						value={rawJson}
						onChange={handleJsonChange}
						placeholder={'{\n  "key": "value"\n}'}
						isInvalid={!!parseError}
						focusBorderColor="primary.light"
						fontFamily="mono"
						fontSize="sm"
						flex="1"
						minH="60vh"
						resize="vertical"
					/>
					{parseError ? (
						<Text fontSize="sm" color="error">
							{parseError}
						</Text>
					) : (
						<Text fontSize="sm" color="success">
							{config
								? "Valid JSON applied to the widget."
								: "Waiting for input…"}
						</Text>
					)}
				</Flex>
			</Drawer>

			{/* Create side panel (visual editor) */}
			<Drawer
				id="trxn-builder-create"
				title="Create Interaction Config"
				placement="right"
				size="xl"
				isOpen={createDrawer.isOpen}
				onOpen={createDrawer.onOpen}
				onClose={createDrawer.onClose}
			>
				<InteractionConfigEditor
					config={config ?? createEmptyConfig()}
					onChange={handleConfigChange}
				/>
			</Drawer>
		</PaddingBox>
	);
};

TransactionBuilderRoute.pageMeta = {
	title: "Transaction Builder",
	isBeta: true,
	isSubPage: false,
};

export default TransactionBuilderRoute;
