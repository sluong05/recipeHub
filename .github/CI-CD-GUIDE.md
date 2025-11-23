# CI/CD Guide for RecipeHub

## Overview

This project uses **GitHub Actions** for Continuous Integration (CI) and Continuous Deployment (CD). Our workflows automatically test, lint, and validate code changes to ensure quality and consistency.

## Workflows

### 1. CI Workflow (`ci.yml`)

**Triggers:**
- Push to `main` or `develop` branches
- Pull requests targeting `main` or `develop`

**Jobs:**

#### Test Job
- Runs on multiple Node.js versions (18.x and 20.x) to ensure compatibility
- Installs dependencies using `npm ci` (faster and more reliable than `npm install`)
- Executes all Jest tests with coverage reporting
- Uploads coverage data to Codecov (optional integration)

#### Lint & Type Check Job
- Validates TypeScript code for type errors
- Runs `tsc --noEmit` to check types without generating output files
- Ensures code adheres to TypeScript standards

#### Build Check Job
- Validates that the Expo app can build successfully
- Exports the web platform build
- Catches build-time errors before deployment

**When it runs:** Every push to main/develop branches and on all pull requests

---

### 2. PR Validation Workflow (`pr-validation.yml`)

**Triggers:**
- When a PR is opened, synchronized (new commits pushed), or reopened

**Jobs:**

#### PR Quality Checks
- **Full test suite**: Runs all tests with coverage
- **Type checking**: Validates TypeScript types
- **Console.log detection**: Warns if `console.log` statements are found in the diff (helps keep production code clean)
- **PR title validation**: Ensures PR titles follow conventional commit format:
  - `feat:` - New features
  - `fix:` - Bug fixes
  - `docs:` - Documentation changes
  - `style:` - Code style changes (formatting, etc.)
  - `refactor:` - Code refactoring
  - `perf:` - Performance improvements
  - `test:` - Adding or updating tests
  - `chore:` - Maintenance tasks
- **Coverage report**: Automatically comments on the PR with test coverage metrics

**When it runs:** On every pull request activity

---

## How CI/CD Works

### Continuous Integration (CI)

```
Developer pushes code → GitHub Actions triggered → Tests run → Type check → Build validation
                                                      ↓
                                            Pass ✓ or Fail ✗
```

1. **Code Push**: You push commits to GitHub
2. **Automatic Trigger**: GitHub Actions detects the push/PR
3. **Workflow Execution**:
   - Sets up Node.js environment
   - Installs dependencies
   - Runs tests, linting, and builds
4. **Results**: You see green checkmarks ✓ (pass) or red X's ✗ (fail) on your commits/PRs

### Benefits

- **Early Bug Detection**: Catches issues before they reach production
- **Code Quality**: Ensures all code passes tests and type checks
- **Consistency**: Every change is validated the same way
- **Confidence**: Merge with confidence knowing tests pass
- **Collaboration**: Team members can see test results on PRs

---

## Workflow Status

Check the status of your workflows:

1. **On GitHub**:
   - Go to your repository
   - Click the "Actions" tab
   - View all workflow runs, logs, and results

2. **On Commits**:
   - Green checkmark ✓ = All checks passed
   - Yellow dot ● = Checks in progress
   - Red X ✗ = Checks failed

3. **On Pull Requests**:
   - Scroll to the bottom of the PR
   - See all required checks
   - View detailed logs by clicking "Details"

---

## Common Scenarios

### Scenario 1: Creating a Pull Request

1. You create a PR from `develop` to `main`
2. Both `ci.yml` and `pr-validation.yml` run automatically
3. Tests, type checks, and build validation execute
4. A bot comments with coverage report
5. PR shows "All checks have passed" or "Some checks failed"
6. Fix any failures, push new commits
7. Workflows re-run automatically on new commits

### Scenario 2: Pushing to Develop

1. You push commits directly to `develop`
2. `ci.yml` workflow runs
3. All jobs (test, lint, build) execute
4. You receive email notification if checks fail

### Scenario 3: Merging to Main

1. PR is approved and all checks pass
2. You merge to `main`
3. `ci.yml` runs on `main` branch
4. Ensures merged code still passes all checks

---

## Understanding Test Coverage

Coverage metrics show how much of your code is tested:

- **Lines**: Percentage of code lines executed during tests
- **Statements**: Percentage of statements executed
- **Functions**: Percentage of functions called
- **Branches**: Percentage of conditional branches tested (if/else)

**Good coverage targets:**
- 80%+ is excellent
- 60-80% is good
- Below 60% needs improvement

---

## Troubleshooting

### Tests Fail in CI but Pass Locally

**Possible causes:**
- Missing environment variables
- Different Node.js versions
- Uncommitted files
- Platform-specific issues

**Solution:**
- Check the workflow logs in GitHub Actions
- Ensure your local Node.js version matches CI (18.x or 20.x)
- Run `npm ci` instead of `npm install` locally

### Build Fails

**Common causes:**
- TypeScript errors
- Missing dependencies
- Configuration issues

**Solution:**
- Run `npx tsc --noEmit` locally
- Check `tsconfig.json` settings
- Review build logs in Actions tab

### Workflow Doesn't Trigger

**Check:**
- Workflow file is in `.github/workflows/` directory
- File has `.yml` or `.yaml` extension
- YAML syntax is valid
- Branch name matches trigger configuration

---

## Customization

### Adding New Checks

Edit workflow files to add steps:

```yaml
- name: Your custom check
  run: npm run your-script
```

### Changing Node.js Versions

Update the matrix in `ci.yml`:

```yaml
strategy:
  matrix:
    node-version: [18.x, 20.x, 22.x]  # Add more versions
```

### Adding Environment Variables

Add secrets in GitHub repository settings, then reference:

```yaml
env:
  API_KEY: ${{ secrets.API_KEY }}
```

---

## Best Practices

1. **Keep tests fast**: CI runs on every push, slow tests slow down development
2. **Write meaningful test names**: Helps understand failures quickly
3. **Fix failing tests immediately**: Don't let CI stay red
4. **Review coverage reports**: Aim to maintain or improve coverage
5. **Use conventional commit messages**: Helps with PR title validation
6. **Don't skip CI**: Even "small" changes should pass checks

---

## Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Jest Testing Documentation](https://jestjs.io/docs/getting-started)
- [Expo Build Documentation](https://docs.expo.dev/build/introduction/)
- [Conventional Commits](https://www.conventionalcommits.org/)

---

## Summary

Your CI/CD pipeline ensures:
- ✓ All tests pass
- ✓ Code is properly typed
- ✓ App builds successfully
- ✓ Code quality standards are met
- ✓ Team collaboration is smooth

Every commit is automatically validated, giving you confidence in your codebase!
