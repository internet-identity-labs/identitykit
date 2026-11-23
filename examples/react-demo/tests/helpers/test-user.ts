import { NfidwTestUser } from "../../../shared/e2e/users.js"

/** NFID Wallet account this suite logs in with. Its data lives in examples/shared/e2e/users.json. */
export const NFIDW_USER = new NfidwTestUser(200000294)

/** Host of this dapp as NFID sees it (anonymous profiles are derived per host). */
export const DAPP_HOST = "localhost:3002"
