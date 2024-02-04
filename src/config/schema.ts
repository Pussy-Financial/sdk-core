import { ChainId } from '../chains'
import { z } from 'zod'

/**
 * Next.JS our frontend framework, on the client side, only allows us to access environment variables that are prefixed with NEXT_PUBLIC_.
 */
export const SchemaPussyLibraryConfigEnvVars = z.object({
  NEXT_PUBLIC_PUSSY_LIBRARY_CONFIG: z.string()
})

const SchemaContractData = z.object({
  address: z.string(),
})

const SchemaContractsAll = z.object({
  ecosystem: z.object({
    v3CoreFactory: SchemaContractData,
    multicall: SchemaContractData,
    quoter: SchemaContractData,
    v3Migrator: SchemaContractData,
    nonfungiblePositionManager: SchemaContractData,
    tickLens: SchemaContractData,
    swapRouter02: SchemaContractData,
    v1MixedRouteQuoter: SchemaContractData
  }),
  tokens: z.object({
    weth: SchemaContractData,
    usdc: SchemaContractData,
    usdt: SchemaContractData,
    wbtc: SchemaContractData,
    dai: SchemaContractData,
  })
})

/**
 * Allow overriding both MAINNET and HARDHAT chain addresses for testing and eventual production v3 system deployment.
 */

const SchemaPussyLibraryConfig_ChainConfig = z.object({
  contracts: SchemaContractsAll
})

// JSON does not support numeric keys, so we need an intermediate schema for parsing the JSON string
const SchemaPussyLibraryConfig_Serialized = z.object({
  chains: z.record(z.union([
    z.literal(ChainId.MAINNET.toString()),
    z.literal(ChainId.HARDHAT.toString())
  ]), SchemaPussyLibraryConfig_ChainConfig.optional())
});

export const SchemaPussyLibraryConfig = SchemaPussyLibraryConfig_Serialized.transform((data) => {
  const transformedChains = Object.keys(data.chains).reduce((acc, key) => {
    const numericKey = parseInt(key, 10); // Convert string key back to number
    const enumKey = ChainId[numericKey]; // Map numeric key to ChainId enum
    if (enumKey !== undefined) {
      const chainConfig = data.chains[key]!;
      acc[numericKey as ChainId] = chainConfig;
    }
    return acc;
  }, {} as Record<ChainId, z.infer<typeof SchemaPussyLibraryConfig_ChainConfig>>);

  return {
    ...data,
    chains: transformedChains,
  };
});


// const SchemaPussyLibraryConfig = z.object({
//   chains: z.record(z.string(), z.object({
//     contracts: SchemaContractsAll
//   }).optional())
// }).preprocess((data) => {
//   if (typeof data === 'object' && data !== null) {
//     const chains = data.chains;
//     if (typeof chains === 'object' && chains !== null) {
//       const transformedChains = Object.keys(chains).reduce((acc, key) => {
//         const numKey = parseInt(key, 10);
//         if (!isNaN(numKey)) {
//           acc[numKey] = chains[key];
//         }
//         return acc;
//       }, {} as Record<number, any>);
//       return { ...data, chains: transformedChains };
//     }
//   }
//   return data;
// });

export type PussyLibraryConfigEnvVars = z.infer<typeof SchemaPussyLibraryConfigEnvVars>
export type PussyLibraryConfig = z.infer<typeof SchemaPussyLibraryConfig>
