# i18n Configuration

This directory contains the configuration for next-i18next internationalization.

## File

### `next-i18next.config.cjs` (Configuration)
- Contains the complete i18n configuration in CommonJS format
- **MUST remain as .cjs extension** - required for CommonJS compatibility
- Houses all locale settings, translation paths, and i18n options

## Why .cjs Extension

Our project uses ES modules (`"type": "module"` in package.json), but next-i18next requires CommonJS configuration. This creates a compatibility issue:

- **Problem**: `.js` files are treated as ES modules in our project
- **Solution**: Use `.cjs` extension for CommonJS format + explicit imports
- **Error if wrong**: `ERR_REQUIRE_ESM` when next-i18next tries to require ES module

## Usage Pattern

Since the library's automatic config discovery causes ES module conflicts, use explicit imports:

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

## ⚠️ Important Warnings

- **DO NOT** create `next-i18next.config.js` - it will cause ES module errors
- **DO NOT** change the .cjs file to .js extension
- **ALWAYS** import the config explicitly and pass it to `serverSideTranslations`
- Import path should be relative to your page location

## Examples

### For pages in root `/pages/`:
```javascript
import nextI18NextConfig from "../next-i18next.config.cjs";
```

### For pages in `/pages/subfolder/`:
```javascript
import nextI18NextConfig from "../../next-i18next.config.cjs";
```
