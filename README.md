# NFID IdentityKit

NFID IdentityKit is a React library designed to simplify adding a wallet connection to your
decentralized application (dApp). With intuitive, responsive, and customizable components,
developers can easily select which ICP-compatible wallets to support in their apps for
authentication, signatures, and transfers.

## 📚 Table of Contents

- [✨ Features](#-features)
- [🛠 Prerequisites](#-prerequisites)
- [📦 Installation](#-installation)
  - [🔗 Peer Dependencies](#-peer-dependencies)
- [🚀 Usage](#-usage)
  - [🎨 Import Styles](#-import-styles)
  - [🧩 Wrap Your Application with `IdentityKitProvider`](#-wrap-your-application-with-identitykitprovider)
  - [🔗 Add the Connect Button](#-add-the-connect-button)
- [🔬 Playground](#-playground)
- [📄 License](#-license)
- [🤝 Contributing](#-contributing)
- [💬 Support](#-support)
- [📘 Documentation](#-documentation)
- [🎉 Try it out](#-try-it-out)

## ✨ Features

- **Easy Integration:** Quickly add wallet connection functionality to your dApp.
- **Customizable:** Tailor the look and feel to match your application's design.
- **Responsive:** Optimized for different screen sizes and devices.

## 🛠 Prerequisites

Before using NFID IdentityKit, ensure that you have:

- An ICP project with a frontend canister.

## 📦 Installation

A library to integrate compatible ICP wallets into your application, which contains React-specific
components for integrating compatible ICP wallets into your application.

Install library with the following command:

```sh npm2yarn
npm install @nfid/identitykit
```

### 🔗 Peer Dependencies

IdentityKit requires certain peer dependencies to function correctly. Ensure the following packages
are installed in your project:

```sh npm2yarn
npm install @dfinity/ledger-icp @dfinity/identity @dfinity/agent @dfinity/candid @dfinity/principal @dfinity/utils @dfinity/auth-client
```

**Note:** IdentityKit is a React library and exports styles that need to be imported into your
project.

## 🚀 Usage

### 🎨 Import Styles

Begin by importing the necessary styles in your project:

```javascript
import "@nfid/identitykit/react/styles.css"
```

### 🧩 Wrap Your Application with `IdentityKitProvider`

Next, wrap your entire application with the `IdentityKitProvider` to enable wallet connections:

```javascript
import { IdentityKitProvider } from "@nfid/identitykit/react"

const App = () => {
  return (
    <IdentityKitProvider>
      <YourApp />
    </IdentityKitProvider>
  )
}
```

### 🔗 Add the Connect Button

Finally, import and render the `ConnectWallet` component in your application to allow users to
connect their wallets:

```javascript
import { ConnectWallet } from "@nfid/identitykit/react"

export const YourApp = () => {
  return <ConnectWallet />
}
```

Once integrated, IdentityKit will handle your user's wallet selection, display wallet information,
and manage wallet switching.

## 🔬 Playground

IdentityKit comes with its own playground where you can try things out locally.

There are three applications included:

1. `dApp` (react-dapp) - Built for signer developers, this app provides a web-based interface to
   visually explore the API documentation for IdentityKit standards. It runs on port 3001. (dev:
   https://mquaw-4yaaa-aaaap-abwlq-cai.icp0.io, prod: https://vehwg-aiaaa-aaaag-aciuq-cai.icp0.io)
2. `Demo` (react-demo) - This app is for application developers. It's a simple frontend app with
   IdentityKit integrated. It runs on port 3002 and lets you sign in with IdentityKit and make
   canister calls. (dev: https://rawyr-oqaaa-aaaal-ajlxa-cai.icp0.io, prod:
   https://qzjsg-qiaaa-aaaam-acupa-cai.icp0.io)
3. `Signer` (react-signer) - This is a sample signer app that demonstrates the basics of signer
   functionality. It helps to understand what’s happening on the signer side. It runs on port 3003.
   (dev: https://uimp7-mqaaa-aaaag-qc5ka-cai.icp0.io, prod:
   https://vdgqs-nqaaa-aaaag-aciua-cai.icp0.io)

To get the playground up and running, use the following command:

```sh
npm i && npm run playground
```

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

Contributions are welcome! To get started, please submit a pull request or open an issue on
[GitHub](https://github.com/internet-identity-labs/identitykit).

## 💬 Support

If you encounter any issues or have questions, feel free to reach out to the team directly on
[Discord](https://discord.gg/bJK5HE6KDn).

## 📘 Documentation

For full documentation, visit [identitykit docs](https://2juva-miaaa-aaaag-ald5a-cai.icp0.io).

## 🎉 Try it out

Here is a short list of live IdentityKit implementations:

- [Demo App](https://qzjsg-qiaaa-aaaam-acupa-cai.icp0.io)
- [ICRC Standards Implementation](https://vehwg-aiaaa-aaaag-aciuq-cai.icp0.io) (view low-level ICRC
  standards implementations)
