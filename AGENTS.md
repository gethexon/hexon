# Repository Guidelines

## Project Structure & Module Organization

Hexon is a pnpm TypeScript monorepo. The Vue 3/Vite frontend lives in `client/`, with views, components, composables, and Jest tests under `client/src/`. The Koa/Node backend is in `server/`; application bootstrap, routes, middleware, services, and utilities are under `server/src/`. Shared types and constants are in `shared/src/` and `server-shared/src/`. Installation and maintenance CLI commands are implemented in `server-scripts/src/`, while reusable shell checks are in `scripts/`. Static screenshots and other project imagery belong in `images/`.

## Build, Test, and Development Commands

Run these commands from the repository root:

- `pnpm install` installs workspace dependencies.
- `pnpm build` builds every workspace package; the client also runs type-checking and tests first.
- `pnpm dev` starts the backend watcher and Vite development server together.
- `pnpm start` runs the built backend in production mode.
- `pnpm test:fresh-install` executes the clean-install smoke test in `scripts/`.
- `pnpm --filter client test` or `pnpm --filter server test` runs one package’s Jest suite.

For a first-time local setup, use `pnpm dev-init`; copy `.env.sample` to the appropriate environment file and review values before starting services.

## Coding Style & Naming Conventions

Use TypeScript with two-space indentation, semicolons, and the repository’s Prettier settings in `.prettierrc`. Run ESLint before submitting changes. Use PascalCase for Vue components and classes (for example, `HViewerToolbar.vue`), camelCase for functions and variables, and kebab-case for route or asset names. Keep frontend code in `client/src/` and backend code in the relevant `server/src/` layer.

## Testing Guidelines

Tests use Jest with `ts-jest`; frontend tests use the configured jsdom environment. Name tests with `.test.ts` or `.test.tsx` and place them near the code they cover. Add or update tests for behavior changes, and run the affected package tests before the full build.

## Commit & Pull Request Guidelines

Recent history follows Conventional Commit prefixes such as `feat:`, `fix:`, `chore:`, and `docs:`; use an imperative, focused subject and add `!` for breaking changes. Pull requests should explain the user-visible impact, link related issues, describe validation performed, and include screenshots for UI changes. Keep generated release commits and unrelated refactors out of feature changes.
