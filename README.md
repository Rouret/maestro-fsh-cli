# Maestro FSH CLI

![NPM Downloads](https://img.shields.io/npm/dw/maestro-fsh-cli)
![Version](https://img.shields.io/github/package-json/v/rouret/maestro-fsh-cli)
![CD Status](https://img.shields.io/github/actions/workflow/status/Rouret/maestro-fsh-cli/cd.yml?branch=master)

The FSH (Flow, Subflow, Helper) method adds a layer of responsibility for actions performed during tests by structuring test files in a modular and reusable way.

- **Flow:** The starting file for any test. It's the one launched with the command maestro test flow.yaml. It defines the logic of the tests using helpers and subflows.
- **SubFlow:** A subset of a flow, allowing multiple actions to be chained together. It is used to group reusable sequences of logical actions.
- **Helper:** Simple actions for navigation or content verification. They encapsulate atomic interactions with the application.

The idea of the FSH method is to approach functional programming to improve the maintainability and reusability of tests.

# An article is being written to fully understand the FSH model.

## Installation

```
npm install -g maestro-fsh-cli
bun add global maestro-fsh-cli
pnpm add -g maestro-fsh-cli
yarn global add maestro-fsh-cli
```

## Usage

### Init

Init the folder structure like:

- maestro or .maestro or e2e
  - flows
  - subflows
  - helpers
  - config.yaml

```bash
$ maestro-fsh init
```

### Doctor

The `doctor` command checks the integrity of your Maestro project setup by verifying the existence of required folders.

```bash
$ maestro-fsh-cli doctor
```

### Create

Create file:

```bash
$ maestro-fsh-cli create flows fileName
$ maestro-fsh-cli create helpers fileName
$ maestro-fsh-cli create subflows fileName
```

## Contributing

## License

[MIT](LICENSE.md)
