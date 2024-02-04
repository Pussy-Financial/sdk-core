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
    weth: SchemaContractData
  })
})

/**
 * Allow overriding both MAINNET and HARDHAT chain addresses for testing and eventual production v3 system deployment.
 */
export const SchemaPussyLibraryConfig = z.object({
  chains: z.object({
    [ChainId.MAINNET]: z.object({
      contracts: SchemaContractsAll
    }).optional(),
    [ChainId.HARDHAT]: z.object({
      contracts: SchemaContractsAll
    }).optional()
  })
})

export type PussyLibraryConfigEnvVars = z.infer<typeof SchemaPussyLibraryConfigEnvVars>
export type PussyLibraryConfig = z.infer<typeof SchemaPussyLibraryConfig>
