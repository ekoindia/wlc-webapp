# **🌐 Internationalization (i18n) Implementation Guide for WLC-WEBAPP**

This guide outlines how to set up and maintain internationalization (i18n) for the WLC-WEBAPP project using next-i18next with Next.js (Pages Router), locale-prefixed URLs, and English as the default locale.

---

## **1\. 🧰 Libraries Used**

Install:

npm install next-i18next i18next react-i18next  
\# or  
yarn add next-i18next i18next react-i18next

---

## **2\. 📁 Folder Structure**

Translation files reside in:

/public/locales/  
  ├─ en/  
  │   ├─ common.json  
  │   └─ dashboard.json  
  └─ hi/  
      ├─ common.json  
      └─ dashboard.json

Each page/component uses its own namespace (e.g., "dashboard") with a shared "common" namespace.

To colocate translation files with page or component files:

/page-components/Dashboard/  
  ├─ Dashboard.tsx  
  └─ locales/  
        ├─ en.json  
        └─ hi.json

---

## **3\. ⚙️ Configuration**

### **next-i18next.config.js**

const path \= require('path');

module.exports \= {  
  i18n: {  
    defaultLocale: 'en',  
    locales: \['en', 'hi', 'es'\],  
  },  
  fallbackLng: 'en',  
  localePath: path.resolve('./public/locales'),  
  reloadOnPrerender: process.env.NODE\_ENV \=== 'development',  
  react: { useSuspense: false }  
};

---

## **4\. 🌐 Language Preference Context**

Create: `contexts/LocaleContext.tsx`

import React, { createContext, useContext, useEffect, useState } from 'react';  
import { useRouter } from 'next/router';

const LocaleContext \= createContext({  
  locale: 'en',  
  changeLocale: (lng: string) \=\> {},  
});

export const LocaleProvider \= ({ children }) \=\> {  
  const router \= useRouter();  
  const \[locale, setLocale\] \= useState(router.locale || 'en');

  useEffect(() \=\> {  
    const saved \= localStorage.getItem('preferredLocale');  
    if (saved && saved \!== locale) {  
      setLocale(saved);  
      router.replace(router.asPath, undefined, { locale: saved });  
    }  
  }, \[\]);

  const changeLocale \= (lng) \=\> {  
    setLocale(lng);  
    localStorage.setItem('preferredLocale', lng);  
    document.cookie \= \`NEXT\_LOCALE=${lng}; path=/; max-age=31536000\`;  
    router.push(router.asPath, undefined, { locale: lng });  
  };

  return (  
    \<LocaleContext.Provider value={{ locale, changeLocale }}\>  
      {children}  
    \</LocaleContext.Provider\>  
  );  
};

export const useLocale \= () \=\> useContext(LocaleContext);

Update `pages/_app.tsx`:

import { appWithTranslation } from 'next-i18next';  
import nextI18NextConfig from '../next-i18next.config';  
import { LocaleProvider } from 'contexts/LocaleContext';

function MyApp({ Component, pageProps }) {  
  return (  
    \<LocaleProvider\>  
      \<Component {...pageProps} /\>  
    \</LocaleProvider\>  
  );  
}

export default appWithTranslation(MyApp, nextI18NextConfig);

---

## **5\. 🧠 Middleware Redirects**

Create `middleware.ts`:

import { NextResponse } from 'next/server';  
import type { NextRequest } from 'next/server';

const PUBLIC\_FILE \= /\\.(.\*)$/;

export function middleware(req: NextRequest) {  
  const { pathname, locale } \= req.nextUrl;

  if (pathname.startsWith('/\_next') || pathname.startsWith('/api') || PUBLIC\_FILE.test(pathname)) {  
    return NextResponse.next();  
  }

  if (locale \=== 'en') {  
    const preferred \= req.cookies.get('NEXT\_LOCALE')?.value;  
    if (preferred && preferred \!== 'en') {  
      const redirectUrl \= new URL(\`/${preferred}${pathname}\`, req.url);  
      return NextResponse.redirect(redirectUrl);  
    }  
  }

  return NextResponse.next();  
}

---

## **6\. 🌍 Translation Files**

Colocated translation example: `page-components/Dashboard/locales/en.json`

{  
  "welcome\_title": "Welcome to your Dashboard (Component)",  
  "balance\_label": "Your Balance (Component)"  
}

Fallback translation in public: `public/locales/en/dashboard.json`

{  
  "welcome\_title": "Welcome to your Dashboard",  
  "balance\_label": "Your Balance"  
}

---

## **7\. 🧩 Component/Page Integration**

In the page:

import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export async function getStaticProps({ locale }) {  
  return {  
    props: {  
      ...(await serverSideTranslations(locale, \['dashboard', 'common'\])),  
    },  
  };  
}

In the component:

import { useTranslation } from 'next-i18next';

export default function Dashboard() {  
  const { t } \= useTranslation('dashboard');  
  return \<h1\>{t('welcome\_title')}\</h1\>;  
}

---

## **8\. 🚫 API Route Safety**

* Middleware excludes all /api/\* routes automatically.

* Avoid using useTranslation inside any file under /pages/api.

* Translation should not affect APIs and APIs should not include any locale-prefixed URLs.

---

## **9\. 🔁 App Router Future Migration**

When migrating to the App Router:

* ✅ Your translation files and namespace structure remain unchanged.

* 🛠 Replace getStaticProps/serverSideTranslations with server-only translation loaders in layout.tsx.

* 🛠 Replace appWithTranslation and \_app.tsx with I18nextProvider wrapped around children inside app/\[locale\]/layout.tsx.

* ✅ Your component-level useTranslation('namespace') usage remains the same.

---

## **10\. ✅ Developer Checklist**

* Create next-i18next.config.js and configure locales

* Extend next.config.js with i18n and localeDetection: false

* Create LocaleProvider and useLocale hook in contexts/

* Wrap \_app.tsx with LocaleProvider and appWithTranslation

* Organize translation files in /public/locales/{lang}/{namespace}.json

* Use getStaticProps or getServerSideProps \+ serverSideTranslations in pages

* Use useTranslation('namespace') in components

* Set NEXT\_LOCALE cookie and localStorage on language switch

* Add middleware.ts to redirect based on NEXT\_LOCALE cookie

* Ensure middleware skips /api and static routes

* Use locale-aware routing via router.push/asPath with locale option

* Confirm fallbackLng: 'en' and defaultNS: 'common' are configured

* Dynamically load only the needed namespaces per page

* Avoid locale-prefixed API calls (use /api/*, not /hi/api/*)

* Ensure translation keys are consistent across locales

* Allow colocated JSON locale files in component folders

---



