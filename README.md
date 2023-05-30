# Nextjs Setup Project

Guide - [https://dev.to/alexeagleson/how-to-build-scalable-architecture-for-your-nextjs-project-2pb7](https://dev.to/alexeagleson/how-to-build-scalable-architecture-for-your-nextjs-project-2pb7)

## Prepare Development Envoirnment:
- Run `npm i`
- Run `npm run prepare`
- Make sure the _.husky/pre-commit_ file is executable by running: `chmod +x pre-commit`

## Icon Library:
- View available icons (open in incognito window where user is not logged-in): `localhost:3000/icons_demo`
- To add new icons, see the file: `constants/IconLibrary.ts`
- There are duplicate icon-names as well, same icons with different names (for backward compatibility). Such icons are shown in red background with the pointer to the actual icon name.

## Features:
- Top Navbar - [components/NavBar/NavBar.jsx](components/NavBar/NavBar.jsx)
- Left Sidebar - [components/SideBar/SideBar.jsx](components/SideBar/SideBar.jsx)
  - Menu items configuration: [constants/SidebarMenu.ts](constants/SidebarMenu.ts)

## Admin
- Dashboard
  - _Business Dashboard_: Divided into 4 part i.e. TopPanel, EarningOverview, SuccessRate & TopMerchants with there config in there respective file - [page-components/Admin/Dashboard/BusinessDashboard](page-components/Admin/Dashboard/BusinessDashboard)