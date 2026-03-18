# Pascal-Case Class Naming

> Auto-generate class templates from your filename — just like Dart/Flutter does.

## How It Works

When you create a new TypeScript or JavaScript file, the extension reads the filename, converts it to PascalCase, and inserts a ready-to-use class template automatically.

```
hello-world.ts     →  export class HelloWorld {}
hello_world.ts     →  export class HelloWorld {}
user-profile-dto.ts →  export class UserProfileDto {}
my_http_service.ts →  export class MyHttpService {}
```

Both **kebab-case** (`-`) and **snake_case** (`_`) are supported — and they can even be mixed.

---

## Features

| Feature                       | Description                                                  |
| ----------------------------- | ------------------------------------------------------------ |
| 🚀 Auto-insert on new file    | Opens an empty `.ts`/`.js` file? Class is inserted instantly |
| 🔤 kebab + snake → PascalCase | Handles `-`, `_`, `.` separators and mixed forms             |
| 🧩 4 template types           | `class`, `interface`, `abstract class`, `enum`               |
| ⌨️ Keyboard shortcut          | `Ctrl+Shift+Alt+C` (Cmd on Mac)                              |
| 🖱️ Right-click context menu   | "Insert from Filename" submenu in the editor                 |
| ✂️ Snippets                   | `dclass`, `diface`, `dabstract`, `denum`                     |
| ⚙️ Configurable               | Export prefix, constructor, default template, on/off toggle  |

---

## Auto-Insert

The moment you open a **new, empty** `.ts`, `.js`, `.tsx`, or `.jsx` file, the extension inserts the default template at the cursor.

```
# You create: src/services/user-auth-service.ts
# You get:
export class UserAuthService {

}
```

The cursor is placed inside the class body, ready to type.

---

## Manual Commands

Open the **Command Palette** (`Ctrl+Shift+P`) and search for `Pascal-Case`:

| Command                                            | Description                                         |
| -------------------------------------------------- | --------------------------------------------------- |
| `Pascal-Case: Insert Class from Filename`          | Inserts a `class`                                   |
| `Pascal-Case: Insert Interface from Filename`      | Inserts an `interface` (TS) or `@typedef` (JS)      |
| `Pascal-Case: Insert Abstract Class from Filename` | Inserts an `abstract class` (TS) or base class (JS) |
| `Pascal-Case: Insert Enum from Filename`           | Inserts an `enum` (TS) or `Object.freeze` enum (JS) |

Or **right-click** in the editor → **Insert from Filename** submenu.

---

## Keyboard Shortcut

| Platform        | Shortcut                 |
| --------------- | ------------------------ |
| Windows / Linux | `Ctrl + Shift + Alt + C` |
| macOS           | `Cmd + Shift + Alt + C`  |

Inserts a `class` template. For other types, use the Command Palette or context menu.

---

## Snippets

Type the prefix and press `Tab`:

| Prefix      | Inserts                                                   |
| ----------- | --------------------------------------------------------- |
| `dclass`    | `export class FileName {}`                                |
| `diface`    | `export interface FileName {}` _(TS only)_                |
| `dabstract` | `export abstract class FileName {}` _(TS only)_           |
| `denum`     | `export enum FileName {}` _(TS)_ / `Object.freeze` _(JS)_ |

> **Note:** Snippets use VS Code's built-in `TM_FILENAME_BASE` variable with a regex transform. They work in the same way but are independent of the auto-insert setting.

---

## Settings

Go to **Settings** → search `pascalCaseClassNaming`:

| Setting                                     | Default   | Description                                                                          |
| ------------------------------------------- | --------- | ------------------------------------------------------------------------------------ |
| `pascalCaseClassNaming.autoInsertOnNewFile` | `true`    | Auto-insert template when a new empty file opens                                     |
| `pascalCaseClassNaming.defaultTemplate`     | `"class"` | Template type for auto-insert: `class`, `interface`, `abstractClass`, `enum`, `none` |
| `pascalCaseClassNaming.addConstructor`      | `false`   | Include an empty constructor in generated classes                                    |
| `pascalCaseClassNaming.exportByDefault`     | `true`    | Prefix templates with `export`                                                       |

**Example `settings.json`:**

```jsonc
{
  // Always insert an interface instead of a class
  "pascalCaseClassNaming.defaultTemplate": "interface",

  // Don't auto-insert; I'll use the shortcut manually
  "pascalCaseClassNaming.autoInsertOnNewFile": false,

  // Include a constructor stub
  "pascalCaseClassNaming.addConstructor": true,

  // Don't export by default (module-private classes)
  "pascalCaseClassNaming.exportByDefault": false,
}
```

---

## Naming Conversion Reference

| Filename                 | PascalCase class name |
| ------------------------ | --------------------- |
| `hello-world.ts`         | `HelloWorld`          |
| `hello_world.ts`         | `HelloWorld`          |
| `my-http-service.ts`     | `MyHttpService`       |
| `user_profile_dto.ts`    | `UserProfileDto`      |
| `hello-world_service.ts` | `HelloWorldService`   |
| `index.service.ts`       | `IndexService`        |
| `repository.ts`          | `Repository`          |

---

## Generated Templates

### TypeScript — Class

```ts
export class UserAuthService {}
```

### TypeScript — Class with Constructor

```ts
export class UserAuthService {
  constructor() {
    // TODO: initialise UserAuthService
  }
}
```

### TypeScript — Interface

```ts
export interface UserAuthService {
  // TODO: define UserAuthService shape
}
```

### TypeScript — Abstract Class

```ts
export abstract class UserAuthService {
  abstract execute(): void;
}
```

### TypeScript — Enum

```ts
export enum UserAuthService {
  // TODO: add UserAuthService members
  Example = "Example",
}
```

### JavaScript — Class

```js
export class UserAuthService {}
```

### JavaScript — Abstract Base Class

```js
/** @abstract */
export class UserAuthService {
  /**
   * @abstract
   * @returns {void}
   */
  execute() {
    throw new Error('Method "execute" must be implemented.');
  }
}
```

### JavaScript — Enum (frozen object)

```js
/** @enum {string} */
export const UserAuthService = Object.freeze({
  // TODO: add UserAuthService values
  EXAMPLE: "EXAMPLE",
});
```

---

## Installation

### From the `.vsix` file

```bash
code --install-extension pascal-case-class-naming-1.0.0.vsix
```

Or in VS Code: **Extensions** → `···` menu → **Install from VSIX…**

### From source

```bash
git clone <repo>
cd pascal-case-class-naming
npm install
npm run compile

# Package it
npx vsce package
code --install-extension pascal-case-class-naming-1.0.0.vsix
```

---

## License

MIT
