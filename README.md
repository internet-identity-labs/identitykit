# NFID Open Source Software

## Overview

This monorepo is managed with [Turborepo](https://turbo.build/repo/docs/). It hosts identity related
open source software developed by Internet Identity Labs.

## What's inside?

This repo includes the following packages/apps:

### Docs

`docs`: [Next.js Docs site](https://docs-dev.nfid.one/) hosted on
[vercel](https://vercel.com/internet-identity-labs/nfid-identity-kit-docs)

### Packages

#### `packages/identitykit`: source code deployed to [@nfid/identitykit](https://www.npmjs.com/package/@nfid/identitykit)

### Config

#### `config/eslint-config-custom`: `eslint` configurations

- **`eslint-config-next`** - Next.js configuration
- **`eslint-config-prettier`** - Prettier configuration

#### `config/tsconfig`: Shared TypeScript configuration files

- **`base.json`** - Base TypeScript configuration
- **`nextjs.json`** - Next.js TypeScript configuration
- **`react-library.json`** - React Library TypeScript configuration

## Usage

### Test

```
npm run test
```

### Build

To build all apps and packages, run the following command:

```
npm run build
```

### Develop

To develop all apps and packages, run the following command:

```
npm run dev
```
