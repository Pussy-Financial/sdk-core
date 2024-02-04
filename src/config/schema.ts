import { ChainId } from '../chains'
import { z } from 'zod'

/**
 * Next.JS our frontend framework, on the client side, only allows us to access environment variables that are prefixed with NEXT_PUBLIC_.
 */
export const SchemaPussyLibraryConfigEnvVars = z.object({
  NEXT_PUBLIC_PUSSY_LIBRARY_CONFIG: z.string()
})

const SchemaEcosystemAddresses = z.object({
  v3CoreFactory: z.string(),
  multicall: z.string(),
  quoter: z.string(),
  v3Migrator: z.string(),
  nonfungiblePositionManager: z.string(),
  tickLens: z.string(),
  swapRouter02: z.string(),
  v1MixedRouteQuoter: z.string()
})

/**
 * Allow overriding both MAINNET and HARDHAT chain addresses for testing and eventual production v3 system deployment.
 */
export const SchemaPussyLibraryConfig = z.object({
  chains: z.object({
    [ChainId.MAINNET]: z.object({
      addresses: SchemaEcosystemAddresses
    }).optional(),
    [ChainId.HARDHAT]: z.object({
      addresses: SchemaEcosystemAddresses
    }).optional()
  })
})

export type PussyLibraryConfigEnvVars = z.infer<typeof SchemaPussyLibraryConfigEnvVars>
export type PussyLibraryConfig = z.infer<typeof SchemaPussyLibraryConfig>
