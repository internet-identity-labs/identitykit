# NFID IdentityKit

**The best way to connect an ICP wallet**

IdentityKit is a React library that makes it easy to add wallet connection to your dapp.

🔥 Out-of-the-box wallet management\
✅ Easily customizable\
🦄 Built on top of ICRC standards

## Quick start

Import IdentityKit into an existing ICP react project.

```
npm i @nfid/identitykit
```

Wrap your app in the `IdentityKitProvider`. Feel free to put the `ConnectWalletButton` component
elsewhere in your app's codebase.

```
import { IdentityKitProvider, ConnectWalletButton } from "@nfid/identitykit/react"

const App = () => {
  return (
    <IdentityKitProvider>

      {/* Your App */}
      <ConnectWalletButton />

    </IdentityKitProvider>
  );
};
```

## Documentation

For full documentation, visit [identitykit.xyz](https://identitykit.xyz).

### Try it out

This is a short list of live IdentityKit implementations:

- https://demo.identitykit.xyz
- https://standards.identitykit.xyz (to view low-level ICRC standards implementations)

## Contributing

We will write out a more comprehensive guide to making contributions, but until then please connect
with the team directly in [Discord](https://discord.gg/bJK5HE6KDn).
