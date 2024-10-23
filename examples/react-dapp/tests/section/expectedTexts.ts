import { expect } from "@playwright/test"

export class ExpectedTexts {
  static readonly General = {
    InitialPermissionsRequestState: {
      method: "icrc25_request_permissions",
      params: {
        scopes: [
          {
            method: "icrc27_accounts",
          },
          {
            method: "icrc34_delegation",
          },
          {
            method: "icrc49_call_canister",
          },
        ],
      },
    },
    ListOfSupportedStandards: [
      {
        name: "ICRC-25",
        url: "https://github.com/dfinity/ICRC/blob/main/ICRCs/ICRC-25/ICRC-25.md",
      },
      {
        name: "ICRC-27",
        url: "https://github.com/dfinity/ICRC/blob/main/ICRCs/ICRC-27/ICRC-27.md",
      },
      {
        name: "ICRC-29",
        url: "https://github.com/dfinity/ICRC/blob/main/ICRCs/ICRC-29/ICRC-29.md",
      },
      {
        name: "ICRC-34",
        url: "https://github.com/dfinity/ICRC/blob/main/ICRCs/ICRC-34/ICRC-34.md",
      },
      {
        name: "ICRC-49",
        url: "https://github.com/dfinity/ICRC/blob/main/ICRCs/ICRC-49/ICRC-49.md",
      },
    ],
    InitialDelegationRequestState: {
      method: "icrc34_delegation",
      params: {
        publicKey: "MCowBQYDK2VwAyEAbK2m/DMYZ4FOpBH5IQnH0WX+L1+it1Yko204OSSQrVA=",
        targets: ["do25a-dyaaa-aaaak-qifua-cai"],
        maxTimeToLive: "28800000000000",
      },
    },
    NoConsentCaseInitialCanisterCallState: {
      method: "icrc49_call_canister",
      params: {
        canisterId: "do25a-dyaaa-aaaak-qifua-cai",
        sender: "gohz6-e6xlo-6oe6c-tno3e-xp3gi-5h3de-eqj63-qd45w-5u3jl-lz7qb-iqe",
        method: "greet_no_consent",
        arg: "RElETAABcQJtZQ==",
      },
    },
    ConsentCaseInitialCanisterCallState: {
      method: "icrc49_call_canister",
      params: {
        canisterId: "do25a-dyaaa-aaaak-qifua-cai",
        sender: "gohz6-e6xlo-6oe6c-tno3e-xp3gi-5h3de-eqj63-qd45w-5u3jl-lz7qb-iqe",
        method: "greet",
        arg: "RElETAABcQJtZQ==",
      },
    },
  }

  static readonly Mocked = {
    GetCurrentPermissionsResponse: [
      {
        scope: {
          method: "icrc27_accounts",
        },
        state: "granted",
      },
      {
        scope: {
          method: "icrc34_delegation",
        },
        state: "granted",
      },
      {
        scope: {
          method: "icrc49_call_canister",
        },
        state: "granted",
      },
    ],
    GrantedPermissions: [
      {
        scope: {
          method: "icrc27_accounts",
        },
        state: "granted",
      },
      {
        scope: {
          method: "icrc34_delegation",
        },
        state: "granted",
      },
      {
        scope: {
          method: "icrc49_call_canister",
        },
        state: "granted",
      },
    ],
    ListOfAccountsResponse: {
      accounts: [
        {
          owner: "gohz6-e6xlo-6oe6c-tno3e-xp3gi-5h3de-eqj63-qd45w-5u3jl-lz7qb-iqe",
          subaccount: "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=",
        },
        {
          owner: "6pfju-rc52z-aihtt-ahhg6-z2bzc-ofp5r-igp5i-qy5ep-j6vob-gs3ae-nae",
          subaccount: "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAE=",
        },
      ],
    },
    DelegationWithTargetsResponse: {
      signerDelegation: [
        {
          delegation: {
            expiration: expect.anything(),
            pubkey: "MCowBQYDK2VwAyEAbK2m/DMYZ4FOpBH5IQnH0WX+L1+it1Yko204OSSQrVA=",
            targets: ["do25a-dyaaa-aaaak-qifua-cai"],
          },
          signature: expect.anything(),
        },
      ],
      publicKey: "MCowBQYDK2VwAyEAq24mMq2DrldUMLxC8PFielFi+DphaUGDLrMYeUGHoOc=",
    },
    NoTargetsDelegationResponse: {
      signerDelegation: [
        {
          delegation: {
            expiration: expect.anything(),
            pubkey: "MCowBQYDK2VwAyEAbK2m/DMYZ4FOpBH5IQnH0WX+L1+it1Yko204OSSQrVA=",
          },
          signature: expect.anything(),
        },
      ],
      publicKey: "MCowBQYDK2VwAyEAMAityFffzQR3p6qgGmV8ppI852wHZFcEsehy3rElO6o=",
    },
    ConsentCaseCanisterCallRequest: [
      "Request from http://localhost:3001",
      "Canister ID",
      "do25a-dyaaa-aaaak-qifua-cai",
      "Sender",
      "gohz6-e6xlo-6oe6c-tno3e-xp3gi-5h3de-eqj63-qd45w-5u3jl-lz7qb-iqe",
      "Arguments",
      '["me"]',
      "Produce the following greeting text: > Hello, me!",
    ],
    ConsentCaseCanisterCallResponse: {
      contentMap: expect.anything(),
      certificate: expect.anything(),
    },
    NoConsentCaseCanisterCallRequest: [
      "Request from http://localhost:3001",
      "Canister ID",
      "do25a-dyaaa-aaaak-qifua-cai",
      "Sender",
      "gohz6-e6xlo-6oe6c-tno3e-xp3gi-5h3de-eqj63-qd45w-5u3jl-lz7qb-iqe",
      "Arguments",
      '["me"]',
    ],
    NoConsentCaseCanisterCallResponse: {
      contentMap: expect.anything(),
      certificate: expect.anything(),
    },
    CanisterCallIcrc2ApproveRequest: [
      "Request from http://localhost:3001",
      "Canister ID",
      "etik7-oiaaa-aaaar-qagia-cai",
      "Sender",
      "gohz6-e6xlo-6oe6c-tno3e-xp3gi-5h3de-eqj63-qd45w-5u3jl-lz7qb-iqe",
      "Arguments",
      '[{"fee":[],"memo":[],"from_subaccount":[],"created_at_time":[],"amount":"5000000000000000000000","expected_allowance":[],"expires_at":[],"spender":{"owner":{"__principal__":"535yc-uxytb-gfk7h-tny7p-vjkoe-i4krp-3qmcl-uqfgr-cpgej-yqtjq-rqe"},"subaccount":[]}}]',
      "# Authorize another address to withdraw from your account **The following address is allowed to withdraw from your account:** 535yc-uxytb-gfk7h-tny7p-vjkoe-i4krp-3qmcl-uqfgr-cpgej-yqtjq-rqe **Your account:** gohz6-e6xlo-6oe6c-tno3e-xp3gi-5h3de-eqj63-qd45w-5u3jl-lz7qb-iqe **Requested withdrawal allowance:** 5000 ckPEPE ⚠ The allowance will be set to 5000 ckPEPE independently of any previous allowance. Until this transaction has been executed the spender can still exercise the previous allowance (if any) to it's full amount. **Expiration date:** No expiration. **Approval fee:** 1000 ckPEPE **Transaction fees to be paid by:** gohz6-e6xlo-6oe6c-tno3e-xp3gi-5h3de-eqj63-qd45w-5u3jl-lz7qb-iqe",
    ],
    CanisterCallIcrc2ApproveResponse: {
      contentMap: expect.anything(),
      certificate: expect.anything(),
    },
  }

  static readonly NFID = {
    GrantedPermissions: [
      {
        scope: {
          method: "icrc27_accounts",
        },
        state: "granted",
      },
      {
        scope: {
          method: "icrc34_delegation",
        },
        state: "granted",
      },
      {
        scope: {
          method: "icrc49_call_canister",
        },
        state: "granted",
      },
    ],
    GetCurrentPermissionsResponse: [
      {
        scope: {
          method: "icrc27_accounts",
        },
        state: "granted",
      },
      {
        scope: {
          method: "icrc34_delegation",
        },
        state: "granted",
      },
      {
        scope: {
          method: "icrc49_call_canister",
        },
        state: "granted",
      },
    ],
    ListOfAccountsResponse: {
      accounts: [
        {
          owner: "7f3jf-ns7yl-tjcdk-fijk6-avi55-g5uyp-orxk6-4pv6p-f6d2c-7nex5-nae",
          subaccount: "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=",
        },
      ],
    },
    NoTargetsDelegationResponse: {
      signerDelegation: [
        {
          delegation: {
            expiration: expect.anything(),
            pubkey: "MCowBQYDK2VwAyEAbK2m/DMYZ4FOpBH5IQnH0WX+L1+it1Yko204OSSQrVA=",
          },
          signature: expect.anything(),
        },
      ],
      publicKey: "MCowBQYDK2VwAyEALHdjGe0ciJb8Kmq4Xsc2/hn760QS+QgdJh7LUPc/wn0=",
    },
    ConsentCaseCanisterCall: [
      "Request from localhost:3001",
      "Canister ID",
      "do25a-dyaaa-aaaak-qifua-cai",
      "Method",
      "greet",
      "Arg",
      "RElETAABcQJtZQ==",
    ],
    NoConsentCaseCanisterCall: [
      "Request from localhost:3001",
      "Canister ID",
      "do25a-dyaaa-aaaak-qifua-cai",
      "Method",
      "greet_no_consent",
      "Arg",
      "RElETAABcQJtZQ==",
    ],
  }
}
