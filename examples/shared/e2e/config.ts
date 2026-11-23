import fs from "fs"
import { fileURLToPath } from "url"

/** Upper bound for any single wait in the e2e suites (actions, popups, polling). */
export const MAX_WAIT_MS = 30_000

const SIGNER_URL_VAR = "VITE_MOCKED_NFID_SIGNER_PROVIDER_URL"
const DEFAULT_SIGNER_URL = "https://dev.nfid.one/rpc"

function readRootEnv(name: string): string | undefined {
  const envPath = fileURLToPath(new URL("../../../.env", import.meta.url))
  if (!fs.existsSync(envPath)) return undefined
  const line = fs
    .readFileSync(envPath, "utf8")
    .split("\n")
    .find((l) => l.trim().startsWith(`${name}=`))
  return line?.slice(line.indexOf("=") + 1).trim() || undefined
}

/**
 * The NFID signer the playground dapps talk to. Same variable the playground uses
 * (`.env`, overridable from the shell), so pointing the dapps and the tests at another
 * NFID (e.g. a local build on http://localhost:9090) is a single switch.
 */
export const NFID_SIGNER_URL =
  process.env[SIGNER_URL_VAR] ?? readRootEnv(SIGNER_URL_VAR) ?? DEFAULT_SIGNER_URL

/** NFID wallet origin the tests open to inject the test user's auth state. */
export const NFID_URL = new URL("/", NFID_SIGNER_URL).toString()
