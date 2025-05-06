# Android Communication

This document describes the communication mechanism between the Eloka web application and the Android wrapper app, used to create a native Android app experience for Eloka.

## Overview

The Eloka web app can be deployed as a standalone web application or embedded within an Android wrapper application using WebView. The Android communication feature enables seamless interaction between the web application and the native Android environment.

## Communication Architecture

### Android Wrapper App
- The Android app loads the web application in a `WebView` component
- The Android app exposes a `JavascriptInterface` which provides a `doAction` method to the web app
- The interface is available as a global variable named `Android` in the web app's JavaScript environment

### Web Application
- The web app can call the `doAction` method to send messages to the Android app
- The Android app can call JavaScript functions in the web app to send messages back

## Communication Flow

### Web App to Android
1. Web app detects if it's running inside the Android wrapper using the `isAndroidApp()` utility
2. Web app sends messages using the `doAndroidAction(action, data)` utility
3. Android app processes the action and responds as needed

### Android to Web App
1. Android app calls JavaScript functions in the web app
2. The web app sets up a callback function `callFromAndroid` in the Layout component to receive and handle these messages

## Implementation

### Initial Setup

In the [Layout component](layout-components/Layout/Layout.tsx), the following one-time setup is performed:

1. When the web app loads, it sends a `connect_ready` message to notify the Android app that the web app is ready to receive messages
2. The web app sets up a callback function `callFromAndroid` to handle incoming messages from the Android app

### Available Utility Functions

The [AndroidUtils.ts](utils/AndroidUtils.ts) file provides the following utility functions:

- `isAndroidApp()`: Determines if the web app is running inside the Android wrapper
- `doAndroidAction(action, data)`: Sends a message to the Android app with the specified action and data

### Supported Actions

The Android wrapper app supports various actions including:

- Authentication (Google/Facebook login, logout)
- Permission management (location, camera, storage)
- Geolocation services
- File operations
- Payment processing (UPI, Razorpay)
- E-signing documents (Leegality)
- Push notifications (FCM)
- Analytics tracking
- Custom URL handling

### Example Usage

```typescript
import { doAndroidAction, isAndroidApp, ANDROID_ACTION } from 'utils/AndroidUtils';

// Check if running inside Android app
if (isAndroidApp()) {
  // Request location permission
  doAndroidAction(ANDROID_ACTION.CHECK_ANDROID_PERMISSION, {
    permission: ANDROID_PERMISSION.LOCATION
  });

  // Share content
  doAndroidAction(ANDROID_ACTION.SHARE, {
    title: 'Share Example',
    text: 'Content to share',
    url: 'https://example.com'
  });
}
```

## Handling Responses

When the Android app responds to an action, it calls back to the web app with data. These responses are handled by the callback function set up in the Layout component.

## Android Permissions

The following permissions can be requested from the Android app:

- `LOCATION`: Access device location
- `CAMERA`: Access device camera
- `STORAGE`: Access device storage

## Best Practices

1. Always check if running in the Android environment before attempting Android-specific actions
2. Handle cases where the Android interface might not support certain actions
3. Implement graceful fallbacks for web-only environments
4. Use the pre-defined action constants from `ANDROID_ACTION` for consistency
5. Handle errors appropriately when communication fails