# Publishing Guide

This guide explains how to publish the bugtracker-cli package to npm.

## Prerequisites

1. **npm Account**: You need an npm account. Create one at https://www.npmjs.com/signup
2. **npm Login**: Login to npm on your local machine:
   ```bash
   npm login
   ```

## Before Publishing

### 1. Update Version Number

Before each publish, update the version in `package.json`:

```bash
# For patch updates (bug fixes): 1.0.0 -> 1.0.1
npm version patch

# For minor updates (new features): 1.0.0 -> 1.1.0
npm version minor

# For major updates (breaking changes): 1.0.0 -> 2.0.0
npm version major
```

### 2. Test Locally

Test the package locally before publishing:

```bash
# Build the project
npm run build

# Test the CLI
npx . setup --help

# Or link it globally to test
npm link
bugtracker --help
npm unlink
```

### 3. Check Package Contents

Preview what will be published:

```bash
npm pack --dry-run
```

This shows you exactly which files will be included in the package.

## Publishing

### First Time Publication

For the first publication:

```bash
npm publish
```

### Subsequent Publications

1. Update version number (see above)
2. Build and test
3. Publish:

```bash
npm publish
```

## Package Scope (Optional)

If you want to publish under a scope (e.g., `@yourname/bugtracker-cli`):

1. Update `package.json`:

   ```json
   {
     "name": "@yourname/bugtracker-cli"
   }
   ```

2. Publish with public access:
   ```bash
   npm publish --access public
   ```

## For Your Team

After publishing, your teammates can install the package:

```bash
# Install globally
npm install -g bugtracker-cli

# Or use with npx
npx bugtracker-cli setup
```

## Automated Publishing with GitHub Actions (Optional)

Create `.github/workflows/publish.yml`:

```yaml
name: Publish to npm

on:
  release:
    types: [created]

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: "18"
          registry-url: "https://registry.npmjs.org"
      - run: npm ci
      - run: npm run build
      - run: npm publish
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

Then create a GitHub release to trigger automatic publishing.

## Version Guidelines

Follow [Semantic Versioning](https://semver.org/):

- **MAJOR** (1.0.0 -> 2.0.0): Breaking changes
- **MINOR** (1.0.0 -> 1.1.0): New features, backward compatible
- **PATCH** (1.0.0 -> 1.0.1): Bug fixes, backward compatible

## Troubleshooting

### Package Name Already Exists

If the name `bugtracker-cli` is taken, you can:

1. Choose a different name (e.g., `@yourname/bugtracker-cli`)
2. Or use your organization scope

### Permission Denied

Make sure you're logged in:

```bash
npm whoami
npm login
```

### Check Package Name Availability

```bash
npm search bugtracker-cli
```

## Quick Publish Checklist

- [ ] Update version in `package.json`
- [ ] Run `npm run build`
- [ ] Test the CLI locally
- [ ] Check `npm pack --dry-run`
- [ ] Commit and push changes
- [ ] Run `npm publish`
- [ ] Create a git tag: `git tag v1.0.0 && git push --tags`
- [ ] Test installation: `npm install -g bugtracker-cli`
