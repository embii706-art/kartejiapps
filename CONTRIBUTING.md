# Contributing to KARTEJI

Terima kasih atas minat Anda untuk berkontribusi pada KARTEJI! 🎉

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Coding Guidelines](#coding-guidelines)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)

## 🤝 Code of Conduct

Proyek ini mengikuti prinsip keterbukaan dan saling menghormati. Semua kontributor diharapkan:

- Bersikap ramah dan profesional
- Menghargai sudut pandang dan pengalaman yang berbeda
- Menerima kritik konstruktif dengan baik
- Fokus pada yang terbaik untuk komunitas

## 🚀 How Can I Contribute?

### Reporting Bugs

Jika menemukan bug:

1. **Cek** apakah bug sudah dilaporkan di [Issues](https://github.com/embii706-art/kartejiapps/issues)
2. Jika belum, **buat issue baru** dengan informasi:
   - Deskripsi jelas tentang bug
   - Langkah-langkah untuk mereproduksi
   - Perilaku yang diharapkan vs aktual
   - Screenshot jika memungkinkan
   - Browser dan versi OS

### Suggesting Enhancements

Untuk saran fitur baru:

1. **Cek** apakah saran sudah ada di Issues
2. Buat issue baru dengan label `enhancement`
3. Jelaskan fitur yang diinginkan dan use case-nya
4. Diskusikan dengan maintainer sebelum implementasi

### Code Contributions

Kami menerima pull request untuk:

- Bug fixes
- New features
- Documentation improvements
- Performance improvements
- Code refactoring
- Test additions

## 💻 Development Setup

### Prerequisites

```bash
# Install Node.js (v16 or higher)
# Install Firebase CLI
npm install -g firebase-tools

# Clone repository
git clone https://github.com/embii706-art/kartejiapps.git
cd kartejiapps

# Install dependencies
cd functions
npm install
cd ..

# Login to Firebase
firebase login
```

### Running Locally

```bash
# Serve the app
firebase serve

# Or use emulators
firebase emulators:start
```

### Project Structure

```
kartejiapps/
├── src/
│   ├── pages/          # Page components
│   ├── components/     # Reusable components
│   ├── lib/           # Utilities
│   ├── main.js        # Entry point
│   └── router.js      # Router
├── functions/         # Cloud Functions
├── docs/             # Documentation
└── firestore.rules   # Security rules
```

## 📝 Coding Guidelines

### JavaScript Style

- Use ES6+ features (const/let, arrow functions, destructuring)
- Use async/await instead of promises chains
- Add JSDoc comments for functions
- Keep functions small and focused
- Use meaningful variable names

**Example:**

```javascript
/**
 * Load user profile from Firestore
 * @param {string} uid - User ID
 * @returns {Promise<Object|null>} User profile or null
 */
export async function loadProfile(uid) {
  if (!uid) return null;
  try {
    const snap = await getDoc(doc(db, 'profiles', uid));
    return snap.exists() ? snap.data() : null;
  } catch (error) {
    console.error('Error loading profile:', error);
    return null;
  }
}
```

### CSS/Tailwind

- Use Tailwind utility classes
- Follow mobile-first approach
- Use CSS variables for theme colors
- Keep custom CSS minimal

### File Organization

- One component per file
- Keep files under 300 lines
- Group related files together
- Use clear, descriptive filenames

## 📌 Commit Guidelines

Kami menggunakan [Conventional Commits](https://www.conventionalcommits.org/):

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting, etc.)
- **refactor**: Code refactoring
- **perf**: Performance improvements
- **test**: Adding/updating tests
- **chore**: Maintenance tasks

### Examples

```bash
# Good commits
git commit -m "feat(feed): add image upload to posts"
git commit -m "fix(auth): resolve password reset email issue"
git commit -m "docs: update installation guide"
git commit -m "refactor(profile): simplify role check logic"

# Bad commits (avoid these)
git commit -m "fix stuff"
git commit -m "update"
git commit -m "wip"
```

## 🔄 Pull Request Process

### Before Submitting

1. **Create a branch** from `main`
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Write clean, documented code
   - Follow coding guidelines
   - Test your changes locally

3. **Test thoroughly**
   - Manual testing
   - Check on different screen sizes
   - Verify no console errors

4. **Update documentation** if needed

### Submitting PR

1. **Push your branch**
   ```bash
   git push origin feature/your-feature-name
   ```

2. **Create Pull Request** on GitHub
   - Use descriptive title
   - Reference related issues
   - Describe what changed and why
   - Add screenshots for UI changes

3. **PR Template**
   ```markdown
   ## Description
   Brief description of changes

   ## Type of Change
   - [ ] Bug fix
   - [ ] New feature
   - [ ] Breaking change
   - [ ] Documentation update

   ## Testing
   - [ ] Tested locally
   - [ ] Tested on mobile
   - [ ] No console errors

   ## Screenshots (if applicable)
   [Add screenshots here]

   ## Related Issues
   Closes #123
   ```

### Review Process

- Maintainer akan review dalam 1-3 hari
- Respond to feedback dan update PR jika perlu
- Setelah approved, PR akan di-merge

## 🧪 Testing

Sebelum submit PR, test:

- [ ] Auth flow (login, register, reset password)
- [ ] Create operations (post, activity, transaction)
- [ ] Read operations (view data)
- [ ] Update operations (edit data)
- [ ] Delete operations
- [ ] Role-based access control
- [ ] Real-time updates
- [ ] Image uploads
- [ ] Mobile responsive
- [ ] Dark mode

## 📚 Additional Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Cloudinary Documentation](https://cloudinary.com/documentation)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Project Documentation](docs/)

## ❓ Questions?

Jika ada pertanyaan:

- Check [Documentation](docs/)
- Search [existing issues](https://github.com/embii706-art/kartejiapps/issues)
- Create new issue dengan label `question`
- Email maintainer

## 🎉 Thank You!

Terima kasih telah berkontribusi ke KARTEJI! Setiap kontribusi, sekecil apapun, sangat berarti. 

Happy coding! 🚀
