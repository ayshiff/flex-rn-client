# flex-rn-client

Simple mobile client in React-Native for flex-server project

# Project Structure

```
├── App.js
├── Components
│   ├── Home
│   │   ├── HomeScreen.js
│   │   └── HomeScreenStyles.js
│   ├── Leave
│   │   ├── LeaveScreen.js
│   │   └── LeaveScreenStyles.js
│   ├── Login
│   │   ├── LoginScreen.js
│   │   └── LoginScreenStyles.js
│   ├── Profile
│   │   ├── ProfileScreen.js
│   │   └── ProfileScreenStyles.js
│   └── Scan
│       ├── ScanScreen.js
│       └── ScanScreenStyles.js
├── Navigation
│   └── NavigationApp.js
├── README.md
├── android
├── app.json
├── config
│   ├── api.js
│   └── server.js
├── index.js
├── ios
├── package-lock.json
├── package.json
└── yarn.lock
```

# List of commands

- start: "node node_modules/react-native/local-cli/cli.js start",
- test: "jest",
- lint: "eslint Components",
- pretty: "prettier --semi false --print-width 100 --single-quote--trailing-comma all --write \"Components/\*_/_.js\"",
- flow: "flow",
- lint:fix: "eslint Components/ --fix"

# Current State

| Screens components | State                                                                | Props      | API routes         | Flow support |
| ------------------ | -------------------------------------------------------------------- | ---------- | ------------------ | ------------ |
| Home               |                                                                      | navigation |                    | []           |
| Login              | `name:string ,fname:string, id: string, place: string, debug: array` | navigation | /login_user        | []           |
| Profile            | `name:string ,fname:string, id: string, place: string, debug: array` | navigation | GET /places POST / | []           |
| Scan               | `name:string ,fname:string, id: string, place: string, debug: array` | navigation | GET /places        | []           |
| Leave              | `name:string ,fname:string, id: string, place: string, debug: array` | navigation | POST /             | []           |
