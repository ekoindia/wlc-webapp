# Internationalization (i18n) Setup Completed

This document provides an overview of the internationalization (i18n) implementation for the WLC-WEBAPP project.

## 🚀 Implementation Summary
## i18n Configuration

This section details the Next.js i18n configuration for next-i18next.

### Configuration File: `next-i18next.config.cjs`
- Contains the complete i18n configuration in CommonJS format
- **MUST remain as .cjs extension** - required for CommonJS compatibility
- Houses all locale settings, translation paths, and i18n options

### Why `.cjs` Extension

Our project uses ES modules (`"type": "module"` in package.json), but next-i18next requires CommonJS configuration:
- **Problem**: `.js` files are treated as ES modules in our project
- **Solution**: Use `.cjs` extension for CommonJS format + explicit imports
- **Error if wrong**: `ERR_REQUIRE_ESM` when next-i18next tries to require ES module

### Usage Pattern

```javascript
import nextI18NextConfig from "../../next-i18next.config.cjs";

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(
        locale,
        ["common", "dashboard"],
        nextI18NextConfig
      )),
    },
  };
}
```

### ⚠️ Important Warnings
- **DO NOT** create `next-i18next.config.js` - it will cause ES module errors
- **DO NOT** change the .cjs file to .js extension
- **ALWAYS** import the config explicitly and pass it to `serverSideTranslations`
- Import path should be relative to your page location

### Examples

For pages in root `/pages/`:
```javascript
import nextI18NextConfig from "../next-i18next.config.cjs";
```
For pages in `/pages/subfolder/`:
```javascript
import nextI18NextConfig from "../../next-i18next.config.cjs";
```

The i18n setup has been successfully implemented with the following features:

### ✅ Completed Tasks

1. **Configuration Files**
   - `next-i18next.config.cjs` - CommonJS configuration for next-i18next
   - `next.config.js` - Updated with i18n settings
   - `middleware.ts` - Locale-based redirect middleware

2. **Context and Providers**
   - `contexts/LocaleContext.tsx` - Locale management with localStorage persistence
   - Updated `_app.tsx` with `LocaleProvider` and `appWithTranslation`

3. **Translation Files**
   - English (`/public/locales/en/`)
   - Hindi (`/public/locales/hi/`)
   - Gujarati (`/public/locales/gu/`)
   - Sample namespaces: `common.json` and `dashboard.json`

4. **Sample Implementation**
   - `/pages/i18n-sample/index.jsx` - Demonstration page with language switching
   - Basic tests in `__tests__/contexts/LocaleContext.test.tsx`

5. **Translation Utility**
   - `utils/withPageTranslations.ts` - Centralized getStaticProps utility
   - Standardized pattern for directory-based pages
   - Type-safe configuration with TypeScript interfaces

## 🛠️ Technical Implementation

### Supported Locales
- **English (en)** - Default locale
- **Hindi (hi)** - Secondary locale
- **Gujarati (gu)** - Secondary locale

### Key Features
- **URL-based localization** with locale prefixes (e.g., `/hi/`, `/gu/`)
- **Persistent language preferences** via localStorage and cookies
- **Fallback to English** for missing translations
- **Middleware-based redirects** based on user preferences
- **Server-side translations** using `getStaticProps`
- **Centralized translation utility** for consistent getStaticProps implementation
- **Directory-based page support** with automatic translation loading

### File Structure
```
public/locales/
├── en/
│   ├── common.json
│   └── dashboard.json
├── hi/
│   ├── common.json
│   └── dashboard.json
└── gu/
    ├── common.json
    └── dashboard.json
```

## 🎯 Usage Examples

### Basic Translation Hook
```tsx
import { useTranslation } from 'next-i18next';

const MyComponent = () => {
  const { t } = useTranslation('common');
  return <h1>{t('welcome')}</h1>;
};
```

### Language Switching
```tsx
import { useLocale } from 'contexts';

const LanguageSelector = () => {
  const { locale, changeLocale } = useLocale();
  
  return (
    <select value={locale} onChange={(e) => changeLocale(e.target.value)}>
      <option value="en">English</option>
      <option value="hi">हिंदी</option>
      <option value="gu">ગુજરાતી</option>
    </select>
  );
};
```

### Page-level Translation Setup

**Traditional Method:**
```tsx
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'dashboard'])),
    },
  };
}
```

**Using Translation Utility (Recommended):**
```tsx
import { withPageTranslations } from 'utils/withPageTranslations';

// For directory-based pages (pages/privacy/index.js)
export { default } from "./privacy";
export const getStaticProps = withPageTranslations({
  namespaces: ["common"],
});
```

**Advanced Configuration:**
```tsx
export const getStaticProps = withPageTranslations({
  namespaces: ["common", "dashboard", "forms"],
  additionalProps: {
    staticData: { version: "1.0" },
  },
});
```

## 🧪 Testing

- **Development Server**: Running on `http://localhost:3002`
- **Sample Page**: `http://localhost:3002/i18n-sample`
- **Language URLs**: 
  - English: `http://localhost:3002/i18n-sample`
  - Hindi: `http://localhost:3002/hi/i18n-sample`
  - Gujarati: `http://localhost:3002/gu/i18n-sample`

## 📋 Next Steps

To extend the i18n implementation:

1. **Add More Translations**: Create additional JSON files for new namespaces
2. **Component Localization**: Update existing components to use translation keys
3. **Apply Translation Utility**: Use `withPageTranslations` for directory-based pages
4. **Date/Number Formatting**: Implement locale-specific formatting
5. **RTL Support**: Add right-to-left language support if needed
6. **Dynamic Imports**: Implement lazy loading for translation files

## 🔧 Development Guidelines

1. **Always use translation keys** instead of hardcoded strings
2. **Organize translations by namespace** (page/component specific)
3. **Use translation utility** for consistent getStaticProps implementation
4. **Keep translation keys descriptive** and consistent
5. **Test across all supported locales** before deployment
6. **Update translation files** when adding new features

## 🏗️ Translation Utility Usage

### For Directory-Based Pages
```javascript
// pages/[pageName]/index.js
import { withPageTranslations } from "../../utils/withPageTranslations";

export { default } from "./[componentName]";
export const getStaticProps = withPageTranslations({
  namespaces: ["common"],
});
```

### Benefits
- **Centralized Logic**: Single source of truth for translation loading
- **Type Safety**: TypeScript interfaces ensure proper configuration
- **Consistent Pattern**: Standardized approach across all directory-based pages
- **Future-Proof**: Ready for App Router migration
- **Maintainable**: Changes to translation logic only require utility updates

## 🚨 Important Notes

- **Middleware excludes API routes** to prevent locale prefixes on API calls
- **Fallback language is English** for missing translations
- **localStorage persistence** maintains user language preferences
- **Server-side rendering** ensures SEO-friendly localized URLs

The i18n setup is now ready for production use and can be extended as needed for additional languages and features.
