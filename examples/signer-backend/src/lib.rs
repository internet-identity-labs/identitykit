use crate::types::{
    Icrc21ConsentInfo, Icrc21ConsentMessage, Icrc21ConsentMessageMetadata,
    Icrc21ConsentMessageRequest, Icrc21DeviceSpec, Icrc21Error, Icrc21ErrorInfo,
    Icrc21LineDisplayPage, Icrc21SupportedStandard, Icrc28TrustedOriginsResponse
};
use ic_cdk::{query, update};
use itertools::Itertools;
use Icrc21DeviceSpec::GenericDisplay;
use Icrc21Error::UnsupportedCanisterCall;

mod types;

#[update]
fn icrc28_trusted_origins() -> Icrc28TrustedOriginsResponse {
    let trusted_origins = vec![
        String::from("http://localhost:3001"),
        String::from("http://localhost:3002"),
        String::from("https://rawyr-oqaaa-aaaal-ajlxa-cai.icp0.io"),
        String::from("https://rawyr-oqaaa-aaaal-ajlxa-cai.icp0.io"),
        String::from("https://mquaw-4yaaa-aaaap-abwlq-cai.icp0.io"),
        String::from("https://qzjsg-qiaaa-aaaam-acupa-cai.icp0.io"),
    ];

    return Icrc28TrustedOriginsResponse { trusted_origins }
}

#[query]
fn greet_no_consent(name: String) -> String {
    format!("Hello, {}!", name)
}

#[update]
async fn greet_update_call(name: String) -> String {
    let canister_id = ic_cdk::id();

    for _ in 0..150 {
        let _ = ic_cdk::call::<(), ()>(canister_id, "wait", ()).await;
    }

    format!("Hello, {}!", name)
}

#[update]
async fn wait() -> () {
    ()
}

#[query]
fn greet(name: String) -> String {
    format!("Hello, {}!", name)
}

#[query]
fn icrc10_supported_standards() -> Vec<Icrc21SupportedStandard> {
    vec![
        Icrc21SupportedStandard {
            url: "https://github.com/dfinity/ICRC/blob/main/ICRCs/ICRC-10/ICRC-10.md".to_string(),
            name: "ICRC-10".to_string(),
        },
        Icrc21SupportedStandard {
            url: "https://github.com/dfinity/ICRC/blob/main/ICRCs/ICRC-21/ICRC-21.md".to_string(),
            name: "ICRC-21".to_string(),
        },
        Icrc21SupportedStandard {
            url: "https://github.com/dfinity/wg-identity-authentication/blob/main/topics/icrc_28_trusted_origins.md".to_string(),
            name: "ICRC-28".to_string(),
        },
    ]
}

#[update]
fn icrc21_canister_call_consent_message(
    consent_msg_request: Icrc21ConsentMessageRequest,
) -> Result<Icrc21ConsentInfo, Icrc21Error> {
    if consent_msg_request.method != "greet" {
        return Err(UnsupportedCanisterCall(Icrc21ErrorInfo {
            description: "Only the 'greet' method is supported".to_string(),
        }));
    }

    let Ok(name) = candid::decode_one::<String>(&consent_msg_request.arg) else {
        return Err(UnsupportedCanisterCall(Icrc21ErrorInfo {
            description: "Failed to decode the argument".to_string(),
        }));
    };

    let metadata = Icrc21ConsentMessageMetadata {
        language: "en".to_string(),
        utc_offset_minutes: None,
    };

    match consent_msg_request.user_preferences.device_spec {
        Some(Icrc21DeviceSpec::LineDisplay {
            characters_per_line,
            lines_per_page,
        }) => Ok(Icrc21ConsentInfo {
            metadata,
            consent_message: Icrc21ConsentMessage::LineDisplayMessage {
                pages: consent_msg_text_pages(
                    &greet(name.clone()),
                    characters_per_line,
                    lines_per_page,
                ),
            },
        }),
        Some(GenericDisplay) | None => Ok(Icrc21ConsentInfo {
            metadata,
            consent_message: Icrc21ConsentMessage::GenericDisplayMessage(consent_msg_text_md(
                &greet(name.clone()),
            )),
        }),
    }
}

fn consent_msg_text_md(greeting: &str) -> String {
    format!("Produce the following greeting text:\n> {}", greeting)
}

fn consent_msg_text_pages(
    greeting: &str,
    characters_per_line: u16,
    lines_per_page: u16,
) -> Vec<Icrc21LineDisplayPage> {
    let full_text = format!("Produce the following greeting text:\n \"{}\"", greeting);

    // Split text into word chunks that fit on a line (breaking long words)
    let words = full_text
        .split_whitespace()
        .flat_map(|word| {
            word.chars()
                .collect::<Vec<_>>()
                .into_iter()
                .chunks(characters_per_line as usize)
                .into_iter()
                .map(|chunk| chunk.collect::<String>())
                .collect::<Vec<String>>()
        })
        .collect::<Vec<String>>();

    // Add words to lines until the line is full
    let mut lines = vec![];
    let mut current_line = "".to_string();
    for word in words {
        if current_line.is_empty() {
            // all words are guaranteed to fit on a line
            current_line = word.to_string();
            continue;
        }
        if current_line.len() + word.len() < characters_per_line as usize {
            current_line.push(' ');
            current_line.push_str(word.as_str());
        } else {
            lines.push(current_line);
            current_line = word.to_string();
        }
    }
    lines.push(current_line);

    // Group lines into pages
    lines
        .into_iter()
        .chunks(lines_per_page as usize)
        .into_iter()
        .map(|page| Icrc21LineDisplayPage {
            lines: page.collect(),
        })
        .collect()
}