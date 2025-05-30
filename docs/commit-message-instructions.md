# Commit Message Instructions

Follow these guidelines to help maintain a clean, traceable commit history and facilitate automated changelog generation.


## Format

```
<prefix>: <concise summary>

[optional body]

[optional footer]
```
- Start with a semantic prefix (see below)
- Use lowercase, imperative mood, no period at end of summary
- Body: detailed what/why (not how), wrap at 72 chars. Separate with blank line
- Footer: issues, breaking changes, or references. separate with blank line


## Prefixes

| Prefix     | Use for                       | Example                                      |
|------------|-------------------------------|----------------------------------------------|
| fix:       | Bug fixes                     | fix: prevent duplicate transaction submits   |
| feat:      | New features                  | feat: add agent commission config            |
| perf:      | Performance                   | perf: optimize wallet history loading        |
| docs:      | Documentation                 | docs: update KYC integration guide           |
| style:     | Formatting only               | style: format dashboard components           |
| ui:        | UI changes                    | ui: improve responsive table layout          |
| refactor:  | Refactoring                   | refactor: centralize auth logic              |
| test:      | Tests                         | test: add commission calculation tests       |
| build:     | Build/config                  | build: update next.js image config           |
| chore:     | Maintenance                   | chore: update dependencies                   |
| ci:        | CI/CD                         | ci: add staging deploy workflow              |
| wip:       | Work in progress              | wip: initial analytics dashboard             |


## Example

```
feat: add wallet top-up notification system

- Implement real-time notifications for when agents successfully
  complete wallet top-up operations.
- This improves user experience by providing immediate feedback on
  transaction status.
```


## Best Practices
- One logical change per commit (atomic)
- Reference issues/tickets if relevant
- Explain impact for major changes
- Run `npm run test` before commit
- Avoid vague messages ("fixes", "updates")
- Split large changes into focused commits


## Pre-commit Checklist
- `npm run lint` passes
- Docs up-to-date
- Repo structure docs accurate
- All tests pass (`npm run test`)


## For Coding Agents
- Always use a valid prefix
- Keep summary concise and imperative
- Add body/footer only if needed
- Be extremely detailed with the file changes and the reason for the change.


## Tools
- Commitlint (Config: `commitlint.config.js`)
