# Code Architecture

## Layered Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     CLI Layer                           │
│                      (cli.ts)                           │
│          Command definitions and routing                │
└─────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│                  Command Layer                          │
│         (commands/assignIssue.ts, projects.ts)          │
│     High-level orchestration & business logic           │
└─────────────────────────────────────────────────────────┘
                           │
                ┌──────────┴──────────┐
                ▼                     ▼
┌──────────────────────┐    ┌──────────────────────┐
│   Service Layer      │    │   Utility Layer      │
│ (services/apiService)│    │  (utils/*)           │
│  API communication   │    │  Helpers, Validators │
│                      │    │  Prompts, Logging    │
└──────────────────────┘    └──────────────────────┘
                │                     │
                └──────────┬──────────┘
                           ▼
                ┌─────────────────────┐
                │  Config & Constants │
                │   (config.ts,       │
                │   constants.ts)     │
                └─────────────────────┘
```

## Data Flow: Assign Issue Command

```
User runs: npx bugtracker assign-issues
    │
    ├─> CLI (cli.ts)
    │       └─> Routes to assignIssueCommand
    │
    ├─> Command (assignIssue.ts)
    │       ├─> loadProjects()
    │       │       └─> loadConfig() → fetchProjects()
    │       │
    │       ├─> promptForProject() [utils/prompts]
    │       │       └─> Uses helpers: filterByName, moveToTop
    │       │
    │       ├─> promptForIssueDetails() [utils/prompts]
    │       │       └─> Uses validators: validateIssueUrls, validateVersion
    │       │
    │       ├─> loadProjectMembers()
    │       │       └─> Uses cached or fetches via API service
    │       │
    │       ├─> promptForAssignee() [utils/prompts]
    │       │
    │       ├─> resolveVersionId()
    │       │       └─> apiService.fetchProjectVersions()
    │       │
    │       └─> bulkUpdateIssues()
    │               └─> apiService.updateIssue()
    │
    └─> Service (apiService.ts)
            └─> Makes HTTP requests to Bugtracker API
```

## File Responsibilities

### Core Files

- **cli.ts**: Command registration and CLI configuration
- **config.ts**: Configuration file management (load/save)
- **constants.ts**: All hardcoded values and configuration
- **types.ts**: TypeScript type definitions

### Commands

- **assignIssue.ts**: Orchestrates issue assignment workflow
- **projects.ts**: Manages project fetching and caching

### Services

- **apiService.ts**: Encapsulates all Bugtracker API calls

### Utilities

- **helpers.ts**: Generic utility functions (parse, filter, sort)
- **logger.ts**: Consistent logging with colors
- **prompts.ts**: User interaction prompts
- **validators.ts**: Input validation functions
- **index.ts**: Utility barrel export

## Design Patterns Used

1. **Service Layer Pattern**: API calls isolated in service class
2. **Single Responsibility**: Each file/function has one purpose
3. **Dependency Injection**: Services receive config, not global state
4. **Separation of Concerns**: UI, logic, and data clearly separated
5. **DRY (Don't Repeat Yourself)**: Common code extracted to utilities
6. **Type Safety**: Comprehensive TypeScript types throughout

## Benefits Summary

| Aspect          | Before         | After                       |
| --------------- | -------------- | --------------------------- |
| Files           | 6 files        | 12 files (better organized) |
| Largest file    | ~230 lines     | ~120 lines                  |
| API calls       | Scattered      | Centralized in service      |
| Validation      | Inline         | Reusable validators         |
| Logging         | Inconsistent   | Unified logger              |
| Testability     | Difficult      | Easy to test                |
| Maintainability | Mixed concerns | Clear separation            |
| Type safety     | Basic          | Comprehensive               |
