export const idlFactory = ({ IDL }: any) => {
  const Icrc21ConsentMessageMetadata = IDL.Record({ language: IDL.Text })
  const Icrc21DeviceSpec = IDL.Variant({
    GenericDisplay: IDL.Null,
    LineDisplay: IDL.Record({
      characters_per_line: IDL.Nat16,
      lines_per_page: IDL.Nat16,
    }),
  })
  const Icrc21ConsentMessageSpec = IDL.Record({
    metadata: Icrc21ConsentMessageMetadata,
    device_spec: IDL.Opt(Icrc21DeviceSpec),
  })
  const Icrc21ConsentMessageRequest = IDL.Record({
    arg: IDL.Vec(IDL.Nat8),
    method: IDL.Text,
    user_preferences: Icrc21ConsentMessageSpec,
  })
  const Icrc21LineDisplayPage = IDL.Record({ lines: IDL.Vec(IDL.Text) })
  const Icrc21ConsentMessage = IDL.Variant({
    LineDisplayMessage: IDL.Record({
      pages: IDL.Vec(Icrc21LineDisplayPage),
    }),
    GenericDisplayMessage: IDL.Text,
  })
  const Icrc21ConsentInfo = IDL.Record({
    metadata: Icrc21ConsentMessageMetadata,
    consent_message: Icrc21ConsentMessage,
  })
  const Icrc21ErrorInfo = IDL.Record({ description: IDL.Text })
  const Icrc21Error = IDL.Variant({
    GenericError: IDL.Record({
      description: IDL.Text,
      error_code: IDL.Nat,
    }),
    InsufficientPayment: Icrc21ErrorInfo,
    UnsupportedCanisterCall: Icrc21ErrorInfo,
    ConsentMessageUnavailable: Icrc21ErrorInfo,
  })
  const Result = IDL.Variant({ Ok: Icrc21ConsentInfo, Err: Icrc21Error })
  return IDL.Service({
    greet: IDL.Func([IDL.Text], [IDL.Text], ["query"]),
    greet_no_consent: IDL.Func([IDL.Text], [IDL.Text], ["query"]),
    icrc21_canister_call_consent_message: IDL.Func([Icrc21ConsentMessageRequest], [Result], []),
  })
}
export const init = () => {
  return []
}
