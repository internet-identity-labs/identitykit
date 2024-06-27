export const idlFactory = ({ IDL }: any) => {
  const icrc21_consent_message_metadata = IDL.Record({
    utc_offset_minutes: IDL.Opt(IDL.Int16),
    language: IDL.Text,
  })
  const icrc21_consent_message_spec = IDL.Record({
    metadata: icrc21_consent_message_metadata,
    device_spec: IDL.Opt(
      IDL.Variant({
        GenericDisplay: IDL.Null,
        LineDisplay: IDL.Record({
          characters_per_line: IDL.Nat16,
          lines_per_page: IDL.Nat16,
        }),
      })
    ),
  })
  const icrc21_consent_message_request = IDL.Record({
    arg: IDL.Vec(IDL.Nat8),
    method: IDL.Text,
    user_preferences: icrc21_consent_message_spec,
  })
  const icrc21_consent_message = IDL.Variant({
    LineDisplayMessage: IDL.Record({
      pages: IDL.Vec(IDL.Record({ lines: IDL.Vec(IDL.Text) })),
    }),
    GenericDisplayMessage: IDL.Text,
  })
  const icrc21_consent_info = IDL.Record({
    metadata: icrc21_consent_message_metadata,
    consent_message: icrc21_consent_message,
  })
  const icrc21_error_info = IDL.Record({ description: IDL.Text })
  const icrc21_error = IDL.Variant({
    GenericError: IDL.Record({
      description: IDL.Text,
      error_code: IDL.Nat,
    }),
    InsufficientPayment: icrc21_error_info,
    UnsupportedCanisterCall: icrc21_error_info,
    ConsentMessageUnavailable: icrc21_error_info,
  })
  const icrc21_consent_message_response = IDL.Variant({
    Ok: icrc21_consent_info,
    Err: icrc21_error,
  })
  return IDL.Service({
    get_trusted_origins: IDL.Func([], [IDL.Vec(IDL.Text)], []),
    greet: IDL.Func([IDL.Text], [IDL.Text], ["query"]),
    greet_no_consent: IDL.Func([IDL.Text], [IDL.Text], ["query"]),
    icrc10_supported_standards: IDL.Func(
      [],
      [IDL.Vec(IDL.Record({ url: IDL.Text, name: IDL.Text }))],
      ["query"]
    ),
    icrc21_canister_call_consent_message: IDL.Func(
      [icrc21_consent_message_request],
      [icrc21_consent_message_response],
      []
    ),
  })
}
export const init = ({}) => {
  return []
}
