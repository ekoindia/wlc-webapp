import { ComponentProps, ComponentType, FC, ReactNode } from "react";

type Providers = [ComponentType<any>, ComponentProps<any>?][];

/**
 * React utility component to combines multiple React Context providers into a single provider.
 * @param providers - An array of providers to combine. Each provider is an array of a provider component and its props.
 * @returns A single provider component that wraps all the providers.
 * @example
 * ```tsx
 * const CombinedProvider = combineProviders([
 * 	[Provider1, { prop1: "value1" }],
 * 	[Provider2, { prop2: "value2" }],
 * ]);
 * ```
 * @see
 * - [React Context](https://reactjs.org/docs/context.html)
 */
const CombineProviders = (providers: Providers): FC =>
	providers.reduce(
		(
			AccumulatedProviders: FC<{ children: ReactNode }>,
			[Provider, props = {}]
		) => {
			const CombinedProvider: FC<{ children: ReactNode }> = ({
				children,
			}) => (
				<AccumulatedProviders>
					<Provider {...props}>
						<>{children}</>
					</Provider>
				</AccumulatedProviders>
			);

			const providerName = Provider.displayName || Provider.name;
			CombinedProvider.displayName = `CombinedProvider(${providerName})`;

			return CombinedProvider;
		},
		({ children }) => <>{children}</>
	);

export default CombineProviders;
