/**
 * Commitlint Configuration
 *
 * Enforces conventional commit message format.
 * @see https://www.conventionalcommits.org/
 *
 * Format: type(scope): subject
 *
 * Types:
 *   feat     - New feature
 *   fix      - Bug fix
 *   docs     - Documentation only
 *   style    - Code style (formatting, whitespace)
 *   refactor - Code change that neither fixes nor adds
 *   perf     - Performance improvement
 *   test     - Adding or updating tests
 *   build    - Build system or external dependencies
 *   ci       - CI configuration
 *   chore    - Other changes (tooling, etc.)
 *   revert   - Reverts a previous commit
 *
 * Examples:
 *   feat(auth): add OAuth support
 *   fix(api): resolve timeout issue
 *   docs: update README with examples
 */

module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // Type must be lowercase
    'type-case': [2, 'always', 'lower-case'],

    // Type cannot be empty
    'type-empty': [2, 'never'],

    // Subject cannot be empty
    'subject-empty': [2, 'never'],

    // Subject should not end with period
    'subject-full-stop': [2, 'never', '.'],

    // Header max length (type + scope + subject)
    'header-max-length': [2, 'always', 100],
  },
};
