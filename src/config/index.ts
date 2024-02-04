import { z } from 'zod'
import {
  PussyLibraryConfig,
  PussyLibraryConfigEnvVars,
  SchemaPussyLibraryConfig,
  SchemaPussyLibraryConfigEnvVars
} from './schema'

const tryParseEnvVarJSON = <T extends z.ZodType<any>>(schema: T, envVar: string): z.infer<T> | Error => {
  try {
    return schema.parse(JSON.parse(envVar))
  } catch (error) {
    return new Error(`Failed to parse env var ${envVar}: ${error}`)
  }
}

const parseLibraryConfigEnvVars = (): PussyLibraryConfigEnvVars | Error => {
  try {
    const configEnvVars = SchemaPussyLibraryConfigEnvVars.parse(process.env)
    return configEnvVars
  } catch (error) {
    return new Error(`Failed to parse PussyLibraryConfigEnvVars: ${error}`)
  }
}

export class PussyLibraryConfigFactory {
  static fromEnv(): PussyLibraryConfig | Error {
    try {
      const configEnvVars = parseLibraryConfigEnvVars()
      if (configEnvVars instanceof Error) return configEnvVars

      const config = tryParseEnvVarJSON(SchemaPussyLibraryConfig, configEnvVars.NEXT_PUBLIC_PUSSY_LIBRARY_CONFIG)
      if (config instanceof Error) return config

      return config
    } catch (error) {
      return new Error(`Failed to parse PussyLibraryConfig: ${error}`)
    }
  }
}

// Initialize config here, for now at least

export const PUSSY_LIBRARY_CONFIG: PussyLibraryConfig = PussyLibraryConfigFactory.fromEnv() as PussyLibraryConfig
if (PUSSY_LIBRARY_CONFIG instanceof Error) {
  console.error(PUSSY_LIBRARY_CONFIG)
  process.exit(1)
}
