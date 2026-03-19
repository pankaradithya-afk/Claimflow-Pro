# Android Studio Setup

This project is now configured with Capacitor so the existing React/Vite app can run as an Android app.

## Open in Android Studio

1. Open Android Studio.
2. Choose `Open`.
3. Select the `android` folder in this project.
4. Let Gradle sync finish.
5. Run the app on an emulator or connected Android device.

## Web app update workflow

When you change the React code, run:

```sh
npm run android:build
```

That rebuilds the web app and copies the latest files into the Android project.

## Useful commands

```sh
npm run build
npm run cap:sync
npm run cap:open:android
```

## Notes

- Supabase environment values still come from the web build process.
- The current web app passes `build` and `test`.
- `lint` still reports many existing TypeScript issues in the codebase, mostly `any` types.
