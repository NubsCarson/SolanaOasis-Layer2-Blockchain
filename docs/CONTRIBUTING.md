# 🤝 Contributing to Solana Oasis

First off, thank you for considering contributing to Solana Oasis! We're excited to have you join our community.

## 🌟 Code of Conduct

By participating in this project, you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md). Please read it before contributing.

## 🚀 How Can I Contribute?

### 🐛 Reporting Bugs

1. **Check Existing Issues** - Search through our [issue tracker](https://github.com/NubsCarson/SolanaOasis-Layer2/issues) to make sure your issue hasn't already been reported.
2. **Use the Bug Report Template** - When creating a new issue, use our bug report template to provide all necessary information.
3. **Include Details** - The more information you can provide, the better we can help:
   - Steps to reproduce
   - Expected behavior
   - Actual behavior
   - Environment details (OS, Rust version, etc.)
   - Relevant logs or screenshots

### ✨ Suggesting Enhancements

1. **Check Existing Suggestions** - Review existing feature requests before making a new one.
2. **Use the Feature Request Template** - This helps us understand your suggestion better.
3. **Be Detailed** - Explain:
   - Why this enhancement would be useful
   - How it should work
   - Any potential drawbacks

### 💻 Pull Requests

1. **Fork the Repository**
2. **Create a Branch**:
   ```bash
   git checkout -b feature/amazing-feature
   # or
   git checkout -b fix/bug-fix
   ```
3. **Make Your Changes**:
   - Follow our coding style
   - Add tests if applicable
   - Update documentation as needed

4. **Commit Your Changes**:
   ```bash
   git commit -m "✨ Add amazing feature"
   # or
   git commit -m "🐛 Fix critical bug"
   ```

5. **Push and Create PR**:
   ```bash
   git push origin feature/amazing-feature
   ```

## 🎨 Style Guidelines

### 💫 Rust Code Style

- Follow [Rust style guidelines](https://doc.rust-lang.org/1.0.0/style/README.html)
- Use `cargo fmt` before committing
- Run `cargo clippy` and address warnings
- Add documentation for public APIs
- Keep functions focused and small

### 📝 Commit Messages

Use semantic emoji prefixes:
- ✨ `:sparkles:` for new features
- 🐛 `:bug:` for bug fixes
- 📚 `:books:` for documentation
- ♻️ `:recycle:` for refactoring
- 🎨 `:art:` for formatting
- ⚡ `:zap:` for performance improvements

## 🧪 Testing

- Write unit tests for new code
- Ensure all tests pass locally
- Add integration tests for new features
- Run the full test suite:
  ```bash
  ./tests/run_local_tests.sh
  ```

## 📚 Documentation

- Update README.md if needed
- Add inline documentation
- Update API documentation
- Include examples for new features

## 🔄 Development Workflow

1. **Setup Environment**:
   ```bash
   # Install dependencies
   sudo apt-get update
   sudo apt-get install -y librocksdb-dev clang

   # Setup Python environment
   python3 -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   ```

2. **Build and Test**:
   ```bash
   cargo build
   cargo test
   ```

3. **Run Local Tests**:
   ```bash
   ./tests/run_local_tests.sh
   ```

## 🌟 Recognition

Contributors will be:
- Added to our Contributors list
- Recognized in release notes
- Eligible for maintainer status

## ❓ Questions?

- Open a [Discussion](https://github.com/NubsCarson/SolanaOasis-Layer2/discussions)
- Contact maintainers:
  - X: [@MoneroSolana](https://twitter.com/MoneroSolana)
  - Discord: @1gig
  - Telegram: @ChillWeb3Dev

## 📄 License

By contributing, you agree that your contributions will be licensed under the Apache License 2.0. 