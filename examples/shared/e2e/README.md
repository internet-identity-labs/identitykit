# Shared e2e helpers

Playwright helpers used by both `examples/react-dapp` and `examples/react-demo`. Imported by
relative path (this folder is not a workspace package).

| File                  | What it does                                                                                    |
| --------------------- | ----------------------------------------------------------------------------------------------- |
| `config.ts`           | `MAX_WAIT_MS` (30 s cap for any wait) and the NFID URL (`NFID_SIGNER_URL`, `NFID_URL`)          |
| `users.json`          | Test accounts: seed, passkey, `authstate` and the wallet values the tests assert on             |
| `users.ts`            | Typed access to `users.json` (`NfidwTestUser`), authstate expiry                                |
| `accounts-service.ts` | Logs the NFID page in via `window.setAuthState`, bounded to 30 s, fails on an expired authstate |
| `signer-popup.ts`     | `clickInSignerPopup`: clicks in the NFID popup, fails right away on a signer error              |
| `codemirror.ts`       | Reads/writes the playground's CodeMirror editors through the editor state                       |
| `ledger.ts`           | Balance precheck (`assertLedgerBalance`) and ICRC-1 transfer argument encoding                  |
| `helpers.ts`          | `waitUntil`, `waitForPopup`, `waitForLoaderDisappear`                                           |

## Rotating the NFIDW test account

1. Add the new account to `users.json`, including `wallet.publicPrincipal` and the per-host
   `wallet.anonymous` values the suites assert on.
2. Point the suite at it: `NFIDW_USER` in `<example>/tests/helpers/test-user.ts`.
3. Fund the public wallet: react-dapp needs NFIDW (each run spends ledger fees), react-demo needs
   ICP. Tests that spend funds check the balance first and name the account to top up.

`authstate` is a delegation from the account's recovery-phrase key and expires; the tests refuse to
start with one that expires within an hour. Regenerate it from the `seed`.

## Running against another NFID (e.g. a local build)

The dapps and the tests read the same variable, `VITE_MOCKED_NFID_SIGNER_PROVIDER_URL` (root `.env`,
can be overridden from the shell):

```bash
VITE_MOCKED_NFID_SIGNER_PROVIDER_URL=http://localhost:9090/rpc npm run playground
VITE_MOCKED_NFID_SIGNER_PROVIDER_URL=http://localhost:9090/rpc npm run test:e2e
```

The NFID build must expose `window.setAuthState` (any non-stage, non-IC environment does).
