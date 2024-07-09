/**
 * Check for major dependency upgrades and unused dependencies.
 * Uses npm-check to gather information about the current state of dependencies.
 * @async
 * @function checkDeps
 */
(async () => {
	try {
		// Flags for termination control
		const terminateIfMajorDeps = false;
		const terminateIfMajorDevDeps = false;
		const terminateIfUnusedDeps = false;

		// Dynamically load npm-check
		// npm-check package uses a default export, not a named export
		const npmCheck = (await import("npm-check")).default;
		const options = {};

		const currentState = await npmCheck(options);
		const packages = currentState.get("packages");

		// Arrays to store major upgrades and unused dependencies
		const majorDevDeps = [];
		const majorDeps = [];
		const unusedDeps = [];

		packages.forEach((pkg) => {
			const dependencyType = pkg.devDependency
				? "devDependency"
				: "dependency";

			if (pkg.bump === "major") {
				const upgradeInfo = {
					dependencyType,
					moduleName: pkg.moduleName,
					currentVersion: pkg.installed,
					latestVersion: pkg.latest,
				};

				if (pkg.devDependency) {
					majorDevDeps.push(upgradeInfo);
				} else {
					majorDeps.push(upgradeInfo);
				}
			}

			if (pkg.unused) {
				unusedDeps.push({
					dependencyType,
					moduleName: pkg.moduleName,
				});
			}
		});

		// Function to create ANSI colored string
		const colorize = (text, color) => `\u001b[${color}m${text}\u001b[0m`;

		/**
		 * Create a table-like structure from headers and rows.
		 * @param {Array<string>} headers - The headers for the table.
		 * @param {Array<Array<string>>} rows - The rows of the table.
		 * @returns {string} The formatted table as a string.
		 */
		const createTable = (headers, rows) => {
			const table = [headers.join(" | "), "-".repeat(70)];
			rows.forEach((row) => {
				table.push(row.join(" | "));
			});
			return table.join("\n");
		};

		// Prepare data for major dev dependencies upgrades table
		const majorUpgradeHeaders = [
			"Package Name",
			"Current Version",
			"Latest Version",
		];

		const majorDepsRows = majorDeps.map((pkg) => [
			colorize(pkg.moduleName, "33"),
			colorize(`v${pkg.currentVersion}`, "34"),
			colorize(`v${pkg.latestVersion}`, "32"),
			,
		]);

		const majorDevDepsRows = majorDevDeps.map((pkg) => [
			colorize(pkg.moduleName, "33"), // Red for dependency name
			colorize(`v${pkg.currentVersion}`, "34"), // Blue for current version
			colorize(`v${pkg.latestVersion}`, "32"), // Green for latest version
		]);

		// Prepare data for unused dependencies table
		const unusedDepsHeaders = ["Dependency Type", "Package Name"];

		const unusedDepsRows = unusedDeps.map((pkg) => [
			pkg.dependencyType,
			colorize(pkg.moduleName, "33"), // Red for dependency name
		]);

		// Log major dependencies upgrades
		if (majorDepsRows.length > 0) {
			console.log(
				colorize("\nMajor dependencies upgrades available:", "31")
			);
			console.log(createTable(majorUpgradeHeaders, majorDepsRows));
		} else {
			console.log(
				colorize("\nNo major dependency upgrades available", "32")
			);
		}

		// Log major dev dependencies upgrades
		if (majorDevDepsRows.length > 0) {
			console.log(
				colorize("\nMajor dev dependencies upgrades available:", "31")
			);
			console.log(createTable(majorUpgradeHeaders, majorDevDepsRows));
		} else {
			console.log(
				colorize("\nNo major dev dependency upgrades available", "32")
			);
		}

		// Log unused dependencies
		if (unusedDepsRows.length > 0) {
			console.log(colorize("\nUnused Dependencies:", "31"));
			console.log(createTable(unusedDepsHeaders, unusedDepsRows));
		} else {
			console.log(colorize("\nZero unused dependency", "32"));
		}

		// Exit with failure if specified conditions are met
		if (terminateIfUnusedDeps && unusedDeps.length > 0) {
			console.error(
				colorize("\nError: Unused dependencies found.", "31")
			);
			process.exit(1); // Exit with a failure code
		} else if (terminateIfMajorDevDeps && majorDevDeps.length > 0) {
			console.error(
				colorize(
					"\nError: Major dev dependencies updates pending.",
					"31"
				)
			);
			process.exit(1); // Exit with a failure code
		} else if (terminateIfMajorDeps && majorDeps.length > 0) {
			console.error(
				colorize("\nError: Major dependencies updates pending.", "31")
			);
			process.exit(1); // Exit with a failure code
		} else {
			process.exit(0); // Exit with a success code
		}
	} catch (error) {
		console.error(colorize("Error checking npm packages:", "31"), error);
		process.exit(1); // Exit with a failure code
	}
})();
