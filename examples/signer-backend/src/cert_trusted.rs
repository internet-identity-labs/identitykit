use std::cell::RefCell;

use candid::CandidType;
use ic_cdk::api::set_certified_data;
use serde::Serialize;
use ic_certified_map::{AsHashTree, RbTree};


thread_local! {
    static ORIGIN_STORAGE_CERTIFIED: RefCell<Vec<String>> = RefCell::new(Default::default());
    static TREE: RefCell<RbTree<String, Vec<u8>>> = RefCell::new(RbTree::new());
}

#[derive(CandidType)]
pub struct CertifiedResponse {
    pub response: Vec<String>,
    pub certificate: Vec<u8>,
    pub witness: Vec<u8>,
}

pub fn get_trusted_origins_cert() -> CertifiedResponse {
    let witness = match get_count_witness("origins".to_string()) {
        Ok(tree) => tree,
        Err(_) => {
            Vec::default()
        }
    };
    let origins = ORIGIN_STORAGE_CERTIFIED.with(|storage| {
        storage.borrow().clone()
    });

    let certificate = ic_cdk::api::data_certificate().expect("No data certificate available");

    CertifiedResponse {
        response: origins,
        certificate,
        witness,
    }
}

pub fn update_trusted_origins(a: Vec<String>) -> Vec<String> {
    update_certify_keys("origins".to_string(), a.clone());
    ORIGIN_STORAGE_CERTIFIED.with(|storage| {
        storage.replace(a);
        storage.borrow().clone()
    })
}


fn get_count_witness(key: String) -> anyhow::Result<Vec<u8>> {
    TREE.with(|tree| {
        let tree = tree.borrow();
        let mut witness = vec![];
        let mut witness_serializer = serde_cbor::Serializer::new(&mut witness);

        witness_serializer.self_describe()?;

        tree.witness(key.as_bytes())
            .serialize(&mut witness_serializer)
            .unwrap();

        Ok(witness)
    })
}

fn update_certify_keys(key: String, origins: Vec<String>) -> String {
    TREE.with(|k| {
        let mut keys = k.borrow_mut();
        let concatenated_string: String = origins.join("");
        let b = hex::decode(sha256::digest(concatenated_string)).unwrap();
        keys.insert(key.clone(), b);
        set_certified_data(&keys.root_hash());
        key
    })
}