# Contributing to QQQ Frontend Core

Thank you for your interest in contributing to the QQQ Frontend Core! This repository contains the **core frontend components and utilities** that form the foundation of the QQQ framework's user interface.

## 🎯 What This Repository Is

This repository is a **core frontend library** of the QQQ framework that provides:
- Reusable React components and hooks
- Core UI utilities and helpers
- Shared TypeScript types and interfaces
- Common styling and theming utilities
- Frontend state management utilities
- Authentication and routing utilities

## 🚫 What This Repository Is NOT

This repository does NOT contain:
- The QQQ server or backend
- Core framework functionality
- Business logic or process engine
- Database operations or API endpoints

## 🔄 Contribution Types

### ✅ Frontend Core Changes (This Repository)

- **Core component library** improvements
- **New reusable React components** and hooks
- **TypeScript type definitions** and interfaces
- **Utility functions** and helpers
- **Core styling and theming** updates
- **Frontend performance** optimizations
- **Client-side bug fixes** in core utilities
- **Documentation updates** for core frontend code

### ❌ Backend/Core Changes (Main QQQ Repository)

- **Server-side functionality**
- **Core framework features**
- **Database schema changes**
- **API endpoint modifications**
- **Business logic changes**
- **Process engine updates**

## 🚀 Getting Started

### Prerequisites

- **Node.js**: LTS version (18.x or higher)
- **npm**: 8.x or higher
- **Git**: For version control
- **QQQ Server**: Running instance for testing

### Development Setup

1. **Fork this repository**
2. **Clone your fork**
   ```bash
   git clone https://github.com/YOUR_USERNAME/qqq-frontend-core.git
   cd qqq-frontend-core
   ```
3. **Install dependencies**
   ```bash
   npm install --legacy-peer-deps
   ```
4. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

## 📝 Development Guidelines

### Code Style

- **TypeScript**: Use strict typing
- **ESLint**: Follow the configured rules
- **Prettier**: Maintain consistent formatting
- **React**: Use functional components with hooks
- **Material-UI**: Follow MUI design patterns

### Component Structure

```typescript
// Example component structure
import React from 'react';
import { Box, Typography } from '@mui/material';

interface Props {
  title: string;
  children: React.ReactNode;
}

export default function ExampleComponent({ title, children }: Props): JSX.Element {
  return (
    <Box>
      <Typography variant="h6">{title}</Typography>
      {children}
    </Box>
  );
}
```

### Testing

- **Unit tests**: Test individual components
- **Integration tests**: Test component interactions
- **Browser testing**: Test in multiple browsers
- **Responsive testing**: Test on different screen sizes

## 🔄 Pull Request Process

1. **Ensure your changes are frontend core library focused**
2. **Follow the existing code patterns**
3. **Add tests for new functionality**
4. **Update documentation if needed**
5. **Test thoroughly in the browser**
6. **Submit a pull request**

### PR Checklist

- [ ] Changes are frontend core library focused
- [ ] Code follows existing patterns
- [ ] Tests are included and passing
- [ ] Documentation is updated
- [ ] No breaking changes introduced
- [ ] Cross-browser compatibility verified

## 🚨 For Major Changes

If your contribution involves:
- **Core framework functionality**
- **Backend integration changes**
- **Major architectural decisions**
- **Breaking changes to the QQQ API**

Please submit to the **main QQQ repository** instead:
👉 **[https://github.com/Kingsrook/qqq](https://github.com/Kingsrook/qqq)**

## 🐛 Reporting Issues

**All issues should be reported to the main QQQ repository:**
👉 **[https://github.com/Kingsrook/qqq/issues](https://github.com/Kingsrook/qqq/issues)**

When reporting frontend-specific issues, include:
- Browser and version
- Operating system
- Steps to reproduce
- Screenshots if applicable
- Console errors
- QQQ server version

## 💬 Getting Help

- **Documentation**: [QQQ Wiki](https://github.com/Kingsrook/qqq.wiki)
- **Discussions**: [QQQ Discussions](https://github.com/Kingsrook/qqq/discussions)
- **Main Repository**: [https://github.com/Kingsrook/qqq](https://github.com/Kingsrook/qqq)

## 📄 License

By contributing to this project, you agree that your contributions will be licensed under the same license as the project (Apache License, Version 2.0).

## 🙏 Thank You

Thank you for contributing to the QQQ Frontend Core! Your contributions help make the QQQ framework's core frontend library better for everyone.

---

**Remember**: This is a frontend core library. For complete QQQ functionality, use the main repository: https://github.com/Kingsrook/qqq
