# Bugtracker CLI

A command-line tool for automating Bugtracker (Redmine) issue management.

## Features

- Bulk assign issues to team members
- Update issue status and target versions
- Cache projects and team members for faster workflow
- Interactive prompts with search functionality

## Installation

### Install globally via npm

```bash
npm install -g bugtracker-cli
```

### Or use with npx (no installation required)

```bash
npx bugtracker-cli <command>
```

### For development

```bash
git clone https://github.com/LinhNguyen1059/bugtracker-cli.git
cd bugtracker-cli
npm install
npm run build
```

## Usage

### Setup API Key

```bash
npx bugtracker setup
```

### Load Projects

Fetch and cache available projects:

```bash
npx bugtracker load-projects
```

### Assign Issues

Bulk update multiple issues:

```bash
npx bugtracker assign-issues
```

This command will prompt you for:

- Project selection
- Issue URLs (comma-separated)
- Status
- Target version
- Assignee

### Clear Configuration

Remove saved API key and cached data:

```bash
npx bugtracker clear-config
```

## Project Structure

```
src/
├── cli.ts                      # Main CLI entry point
├── config.ts                   # Configuration management
├── constants.ts                # Application constants
├── types.ts                    # TypeScript type definitions
├── commands/                   # Command implementations
│   ├── assignIssue.ts         # Issue assignment command
│   └── projects.ts            # Project management commands
├── services/                   # API services
│   └── apiService.ts          # Bugtracker API client
└── utils/                      # Utility functions
    ├── helpers.ts             # General helper functions
    ├── logger.ts              # Logging utilities
    ├── prompts.ts             # User prompt utilities
    └── validators.ts          # Input validation functions
```

## Architecture

### Separation of Concerns

- **Commands**: High-level command orchestration
- **Services**: API communication layer
- **Utils**: Reusable utility functions
- **Config**: Configuration and persistence management

### Key Improvements

1. **API Service Layer**: All HTTP requests are centralized in `BugtrackerApiService`
2. **Constants**: Hardcoded values moved to a single constants file
3. **Type Safety**: Comprehensive TypeScript types for better IDE support
4. **Logging**: Consistent, color-coded logging utilities
5. **Validators**: Reusable input validation functions
6. **Helpers**: Common operations extracted into utility functions
7. **Prompts**: User interaction logic separated from business logic

### Benefits

- **Maintainability**: Clear separation makes it easy to locate and modify code
- **Testability**: Services and utilities can be easily unit tested
- **Readability**: Smaller, focused functions with clear responsibilities
- **Reusability**: Common functionality extracted into utilities
- **Type Safety**: Comprehensive types catch errors at compile time
- **Extensibility**: New commands can easily reuse existing services and utilities

## Development

### Build

```bash
npm run build
```

### Run Locally

```bash
node bin/bugtracker <command>
```

## License

ISC
