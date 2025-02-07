import { expect } from "@playwright/test"

export class ExpectedTexts {
  static readonly General = {
    Public: {
      Initial_ICRC2Approve_RequestState: {
        method: "icrc49_call_canister",
        params: {
          canisterId: "etik7-oiaaa-aaaar-qagia-cai",
          sender: "7f3jf-ns7yl-tjcdk-fijk6-avi55-g5uyp-orxk6-4pv6p-f6d2c-7nex5-nae",
          method: "icrc2_approve",
          arg: "RElETAZufW17bgFueGwCs7DawwNorYbKgwUCbAjG/LYCALqJ5cIEAqLelOsGAoLz85EMA9ijjKgNfZGcnL8NAN6n99oNA8uW3LQOBAEFAAAAAICAgMnVm5n4jJ4EAAABHddbvOJ4U2u2S79mR0+xkJBPtwHztu02la8/gFECAA==",
        },
      },
      Initial_ICRC1Transfer_RequestState: {
        method: "icrc49_call_canister",
        params: {
          canisterId: "etik7-oiaaa-aaaar-qagia-cai",
          sender: "7f3jf-ns7yl-tjcdk-fijk6-avi55-g5uyp-orxk6-4pv6p-f6d2c-7nex5-nae",
          method: "icrc1_transfer",
          arg: "RElETAZte24AbAKzsNrDA2ithsqDBQFufW54bAb7ygECxvy2AgO6ieXCBAGi3pTrBgGC8/ORDATYo4yoDX0BBQEdXdZAg85gOc3s6DkTiv7FBn9RDHSPT6rgmlsBGgIAAAAAAICAgPXduOvktWw=",
        },
      },
      Initial_ICPTransfer_RequestState: {
        method: "icrc49_call_canister",
        params: {
          canisterId: "ryjl3-tyaaa-aaaaa-aaaba-cai",
          sender: "7f3jf-ns7yl-tjcdk-fijk6-avi55-g5uyp-orxk6-4pv6p-f6d2c-7nex5-nae",
          method: "transfer",
          arg: "RElETAZte2wB4KmzAnhuAGwB1vaOgAF4bgNsBvvKAQDG/LYCAbqJ5cIEeKLelOsGAoLz85EMBNijjKgNAQEFIOryWM4M9NaQ7WNXeb3wjbfURB8JbLIb5aI3/N+SxHRgECcAAAAAAAAAAAAAAAAAAAAAAOH1BQAAAAA=",
        },
      },
      Initial_IdentityKitDemoCall_RequestState: {
        method: "icrc49_call_canister",
        params: {
          canisterId: "do25a-dyaaa-aaaak-qifua-cai",
          sender: "7f3jf-ns7yl-tjcdk-fijk6-avi55-g5uyp-orxk6-4pv6p-f6d2c-7nex5-nae",
          method: "greet_no_consent",
          arg: "RElETAABcQJtZQ==",
        },
      },
      Initial_LongRunningUpdateCall_RequestState: {
        method: "icrc49_call_canister",
        params: {
          canisterId: "do25a-dyaaa-aaaak-qifua-cai",
          sender: "7f3jf-ns7yl-tjcdk-fijk6-avi55-g5uyp-orxk6-4pv6p-f6d2c-7nex5-nae",
          method: "greet_update_call",
          arg: "RElETAABcQJtZQ==",
        },
      },
      DelegationTabResponse: {
        _inner: expect.anything(),
        _delegation: {
          delegations: [
            {
              delegation: {
                expiration: expect.anything(),
                pubkey: expect.anything(),
                targets: expect.anything(),
              },
              signature: expect.anything(),
            },
          ],
          publicKey: expect.anything(),
        },
      },
      AccountsTabResponse: [
        {
          principal: {
            __principal__: "7f3jf-ns7yl-tjcdk-fijk6-avi55-g5uyp-orxk6-4pv6p-f6d2c-7nex5-nae",
          },
          subAccount: {
            bytes: expect.any(Object),
          },
        },
      ],
    },
    Anonymous: {
      Initial_ICRC2Approve_RequestState: {
        method: "icrc49_call_canister",
        params: {
          canisterId: "etik7-oiaaa-aaaar-qagia-cai",
          sender: "pyoac-sn7yx-gvu25-p2ni3-tja44-xvrrw-vzwmg-yxfsv-o3ykq-nhu4a-qqe",
          method: "icrc2_approve",
          arg: "RElETAZufW17bgFueGwCs7DawwNorYbKgwUCbAjG/LYCALqJ5cIEAqLelOsGAoLz85EMA9ijjKgNfZGcnL8NAN6n99oNA8uW3LQOBAEFAAAAAICAgMnVm5n4jJ4EAAABHddbvOJ4U2u2S79mR0+xkJBPtwHztu02la8/gFECAA==",
        },
      },
      Initial_ICPTransfer_RequestState: {
        method: "icrc49_call_canister",
        params: {
          canisterId: "ryjl3-tyaaa-aaaaa-aaaba-cai",
          sender: "pyoac-sn7yx-gvu25-p2ni3-tja44-xvrrw-vzwmg-yxfsv-o3ykq-nhu4a-qqe",
          method: "transfer",
          arg: "RElETAZte2wB4KmzAnhuAGwB1vaOgAF4bgNsBvvKAQDG/LYCAbqJ5cIEeKLelOsGAoLz85EMBNijjKgNAQEFIOryWM4M9NaQ7WNXeb3wjbfURB8JbLIb5aI3/N+SxHRgECcAAAAAAAAAAAAAAAAAAAAAAOH1BQAAAAA=",
        },
      },
      Initial_ICRC1Transfer_RequestState: {
        method: "icrc49_call_canister",
        params: {
          canisterId: "etik7-oiaaa-aaaar-qagia-cai",
          sender: "pyoac-sn7yx-gvu25-p2ni3-tja44-xvrrw-vzwmg-yxfsv-o3ykq-nhu4a-qqe",
          method: "icrc1_transfer",
          arg: "RElETAZte24AbAKzsNrDA2ithsqDBQFufW54bAb7ygECxvy2AgO6ieXCBAGi3pTrBgGC8/ORDATYo4yoDX0BBQEdXdZAg85gOc3s6DkTiv7FBn9RDHSPT6rgmlsBGgIAAAAAAICAgPXduOvktWw=",
        },
      },
      Initial_IdentityKitDemoCall_RequestState: {
        method: "icrc49_call_canister",
        params: {
          canisterId: "do25a-dyaaa-aaaak-qifua-cai",
          sender: "pyoac-sn7yx-gvu25-p2ni3-tja44-xvrrw-vzwmg-yxfsv-o3ykq-nhu4a-qqe",
          method: "greet_no_consent",
          arg: "RElETAABcQJtZQ==",
        },
      },
      Initial_LongRunningUpdateCall_RequestState: {
        method: "icrc49_call_canister",
        params: {
          canisterId: "do25a-dyaaa-aaaak-qifua-cai",
          sender: "pyoac-sn7yx-gvu25-p2ni3-tja44-xvrrw-vzwmg-yxfsv-o3ykq-nhu4a-qqe",
          method: "greet_update_call",
          arg: "RElETAABcQJtZQ==",
        },
      },
      DelegationTabResponse: {
        _inner: expect.anything(),
        _delegation: {
          delegations: [
            {
              delegation: {
                expiration: expect.anything(),
                pubkey: expect.anything(),
              },
              signature: expect.anything(),
            },
          ],
          publicKey: expect.anything(),
        },
      },
      AccountsTabResponse: [
        {
          principal: {
            __principal__: "pyoac-sn7yx-gvu25-p2ni3-tja44-xvrrw-vzwmg-yxfsv-o3ykq-nhu4a-qqe",
          },
          subAccount: {
            bytes: expect.any(Object),
          },
        },
      ],
    },
  }

  static readonly NFID = {
    Public: {
      ICRC2ApproveRpcText: [
        "Request from localhost:3002",
        "0.0001 ICP",
        "Transaction details",
        "Proceed with caution. This website can spend up to the spending cap until you revoke this permission.",
      ],
      ICRC2Response: {
        Ok: expect.anything(),
      },
      ICRC1TransferRPCText: ["Request from localhost:3002", "0.0001 ICP", "0.00 USD"],
      ICRC1TransferResponse: {
        Ok: expect.anything(),
      },
      ICPTransferRPCText: ["Request from localhost:3002", "0.0001 ICP", "0.00 USD"],
      ICPTransferResponse: {
        Ok: expect.anything(),
      },
      IdentityKitDemoCallRPCText: [
        "Request from localhost:3002",
        "Canister ID",
        "do25a-dyaaa-aaaak-qifua-cai",
        "Arguments",
        '["me"]',
        "Proceed with caution. Unable to verify the safety of this approval. Please make sure you trust this dapp.",
      ],
      IdentityKitDemoCallResponse: ['"Hello, me!"'],
      LongRunningUpdateCallResponse: ['"Hello, me!"'],
    },
    Anonymous: {
      ICPTransferResponse: {
        Err: {
          InsufficientFunds: {
            balance: {
              e8s: "0",
            },
          },
        },
      },
    },
  }
}
