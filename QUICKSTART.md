# Quick Start Guide for Team

## Installation

Install the package globally:

```bash
npm install -g bugtracker-cli
```

## First Time Setup

1. **Get your API key** from Bugtracker:

   - Log in to https://bugtracker.i3international.com
   - Go to My Account → API Access Key
   - Copy your API key

2. **Configure the CLI**:

   ```bash
   bugtracker setup
   ```

   Paste your API key when prompted.

3. **Load projects** (optional, for faster workflow):
   ```bash
   bugtracker load-projects
   ```

## Daily Usage

### Assign Issues

```bash
bugtracker assign-issues
```

You'll be prompted for:

- **Project**: Select from your projects
- **Issue URLs**: Paste comma-separated URLs like:
  ```
  https://bugtracker.i3international.com/issues/12345, https://bugtracker.i3international.com/issues/12346
  ```
  Or just issue numbers: `12345, 12346`
- **Status**: Choose from available statuses
- **Target Version**: Enter version name (e.g., `1.0.0`) or leave empty
- **Assignee**: Select team member

### Update Configuration

If you need to change your API key:

```bash
bugtracker setup
```

### Clear All Settings

To remove all saved configuration:

```bash
bugtracker clear-config
```

## Tips

- The CLI remembers your last selected project and assignee for faster workflow
- You can use arrow keys or type to search in selection prompts
- Issue URLs can be full URLs or just issue numbers
- Press Ctrl+C to cancel any operation

## Common Issues

### "API key not found"

Run `bugtracker setup` to configure your API key.

### "No projects found"

Run `bugtracker load-projects` to fetch your accessible projects.

### Version not found

Make sure the version name exactly matches the version in the project (case-sensitive).

## Using with npx (No Installation)

If you don't want to install globally, use npx:

```bash
npx bugtracker-cli setup
npx bugtracker-cli assign-issues
```

## Help

For help with any command:

```bash
bugtracker --help
bugtracker <command> --help
```

## Available Commands

- `bugtracker setup` - Configure API key
- `bugtracker load-projects` - Fetch and cache projects
- `bugtracker assign-issues` - Bulk assign/update issues
- `bugtracker clear-config` - Clear configuration
