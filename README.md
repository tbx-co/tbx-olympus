# TBX Syndicate Franklin Build

Adobe Franklin site build for the TBX Syndicate.

## Do this first

[Franklin Tutorial](https://www.hlx.live/developer/tutorial "Adobe Franklin Tutorial")
[Franklin FAQ](https://www.hlx.live/docs/faq "Adobe Franklin FAQ")

## Environments

- Your-branch Preview: https://<branchname>--tbx-olympus--solomon71.hlx.live/
- Preview: https://main--tbx-olympus--solomon71.hlx.page/
- Live: https://main--tbx-olympus--solomon71.hlx.live/

## Installation

```sh
npm i
```

## Tests

```sh
npm tst
```

## Local development

1. Create a new repository based on the `helix-project-boilerplate` template and add a mountpoint in the `fstab.yaml`
1. Add the [helix-bot](https://github.com/apps/helix-bot) to the repository
1. Install the [Helix CLI](https://github.com/adobe/helix-cli): `npm install -g @adobe/helix-cli`
1. Start Helix Pages Proxy: `hlx up` (opens your browser at `http://localhost:3000`)
1. Open the `{repo}` directory in your favorite IDE and start coding :)

## Before submitting code 
- run `npm run lint:fix` to fix the fixable errors with --fix option
- run `npm run lint` to ensure that no eslint error exists
- run `npm run test` to double-check & avoid failing tests
