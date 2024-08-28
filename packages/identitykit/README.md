# NFID IdentityKit

NFID IdentityKit is a React library designed to simplify adding a wallet connection to your
decentralized application (dApp). With intuitive, responsive, and customizable components,
developers can easily select which ICP-compatible wallets to support in their apps for
authentication, signatures, and transfers.

## ✨ Features

- **Easy Integration:** Quickly add wallet connection functionality to your dApp.
- **Customizable:** Tailor the look and feel to match your application's design.
- **Responsive:** Optimized for different screen sizes and devices.

## 🛠 Prerequisites

Before using NFID IdentityKit, ensure that you have:

- An ICP project with a frontend canister.

## 📦 Installation

To install IdentityKit, you'll need the following libraries:

- `@nfid/identitykit` - A library to integrate compatible ICP wallets into your application.
- `@nfid/identitykit/react` - A library containing React-specific components for integrating
  compatible ICP wallets into your application.

Install both with the following command:

```sh npm2yarn
npm install @nfid/identitykit @nfid/identitykit/react
```

### 🔗 Peer Dependencies

IdentityKit requires certain peer dependencies to function correctly. Ensure the following packages
are installed in your project:

```sh npm2yarn
npm install @dfinity/ledger-icp @dfinity/identity @dfinity/agent @dfinity/candid @dfinity/principal @dfinity/utils
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

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

Contributions are welcome! To get started, please submit a pull request or open an issue on
[GitHub](https://github.com/internet-identity-labs/identitykit).

## 💬 Support

If you encounter any issues or have questions, feel free to reach out to the team directly on
[Discord](https://discord.gg/bJK5HE6KDn).
