import * as vscode from "vscode";
import * as path from "path";

// ─── Naming Utilities ────────────────────────────────────────────────────────

/**
 * Converts kebab-case or snake_case (or mixed) filename base to PascalCase.
 *
 * Examples:
 *   hello-world      → HelloWorld
 *   hello_world      → HelloWorld
 *   my-http-service  → MyHttpService
 *   user_profile_dto → UserProfileDto
 *   alreadyPascal    → AlreadyPascal  (passthrough, capitalises first letter)
 */
export function toPascalCase(filenameBase: string): string {
  // Split on hyphens, underscores, dots, or camelCase boundaries
  return filenameBase
    .split(/[-_.]+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("");
}

// ─── Template Builders ───────────────────────────────────────────────────────

interface TemplateOptions {
  className: string;
  isTypeScript: boolean;
  addConstructor: boolean;
  exportKeyword: string;
}

function buildClassTemplate(opts: TemplateOptions): string {
  const { className, isTypeScript, addConstructor, exportKeyword } = opts;

  const constructorBlock = addConstructor
    ? isTypeScript
      ? `\n  constructor() {\n    // TODO: initialise ${className}\n  }\n`
      : `\n  constructor() {\n    // TODO: initialise ${className}\n  }\n`
    : "";

  return `${exportKeyword}class ${className} {${constructorBlock}\n}\n`;
}

function buildInterfaceTemplate(opts: TemplateOptions): string {
  const { className, isTypeScript, exportKeyword } = opts;

  if (!isTypeScript) {
    // JS doesn't have interfaces; insert a JSDoc typedef instead
    return (
      `/**\n` +
      ` * @typedef {Object} ${className}\n` +
      ` * @property {*} - TODO: add properties\n` +
      ` */\n`
    );
  }

  return `${exportKeyword}interface ${className} {\n  // TODO: define ${className} shape\n}\n`;
}

function buildAbstractClassTemplate(opts: TemplateOptions): string {
  const { className, isTypeScript, exportKeyword } = opts;

  if (!isTypeScript) {
    // JS: use a base class convention with JSDoc
    return (
      `/** @abstract */\n` +
      `${exportKeyword}class ${className} {\n` +
      `  /**\n` +
      `   * @abstract\n` +
      `   * @returns {void}\n` +
      `   */\n` +
      `  execute() {\n` +
      `    throw new Error('Method "execute" must be implemented.');\n` +
      `  }\n` +
      `}\n`
    );
  }

  return (
    `${exportKeyword}abstract class ${className} {\n` +
    `  abstract execute(): void;\n` +
    `}\n`
  );
}

function buildEnumTemplate(opts: TemplateOptions): string {
  const { className, isTypeScript, exportKeyword } = opts;

  if (!isTypeScript) {
    return (
      `/** @enum {string} */\n` +
      `${exportKeyword}const ${className} = Object.freeze({\n` +
      `  // TODO: add ${className} values\n` +
      `  EXAMPLE: 'EXAMPLE',\n` +
      `});\n`
    );
  }

  return (
    `${exportKeyword}enum ${className} {\n` +
    `  // TODO: add ${className} members\n` +
    `  Example = 'Example',\n` +
    `}\n`
  );
}

// ─── Core Insert Logic ───────────────────────────────────────────────────────

type TemplateKind = "class" | "interface" | "abstractClass" | "enum";

async function insertTemplate(
  kind: TemplateKind,
  editor: vscode.TextEditor,
): Promise<void> {
  const document = editor.document;
  const langId = document.languageId;
  const isTypeScript = langId === "typescript" || langId === "typescriptreact";

  // Derive class name from the file name (without extension)
  const filenameBase = path.basename(
    document.fileName,
    path.extname(document.fileName),
  );
  const className = toPascalCase(filenameBase);

  // Read user settings
  const config = vscode.workspace.getConfiguration("pascalCaseClassNaming");
  const addConstructor = config.get<boolean>("addConstructor", false);
  const exportByDefault = config.get<boolean>("exportByDefault", true);
  const exportKeyword = exportByDefault ? "export " : "";

  const opts: TemplateOptions = {
    className,
    isTypeScript,
    addConstructor,
    exportKeyword,
  };

  let template: string;
  switch (kind) {
    case "interface":
      template = buildInterfaceTemplate(opts);
      break;
    case "abstractClass":
      template = buildAbstractClassTemplate(opts);
      break;
    case "enum":
      template = buildEnumTemplate(opts);
      break;
    default:
      template = buildClassTemplate(opts);
  }

  // Insert at cursor position (or beginning of file when auto-triggered)
  const position = editor.selection.active;
  await editor.edit((editBuilder) => {
    editBuilder.insert(position, template);
  });

  // Move cursor inside the body
  const insertedLines = template.split("\n").length - 1;
  const bodyLine = position.line + insertedLines - 2;
  const newPosition = new vscode.Position(Math.max(0, bodyLine), 2);
  editor.selection = new vscode.Selection(newPosition, newPosition);

  vscode.window.setStatusBarMessage(
    `$(symbol-class) Inserted ${kind} "${className}"`,
    3000,
  );
}

// ─── Auto-insert on New File ─────────────────────────────────────────────────

const SUPPORTED_LANGS = new Set([
  "typescript",
  "javascript",
  "typescriptreact",
  "javascriptreact",
]);

/**
 * Returns true if the document is brand-new (empty or only whitespace).
 */
function isEmptyDocument(doc: vscode.TextDocument): boolean {
  return doc.getText().trim().length === 0;
}

async function handleNewDocument(doc: vscode.TextDocument): Promise<void> {
  const config = vscode.workspace.getConfiguration("pascalCaseClassNaming");
  const autoInsert = config.get<boolean>("autoInsertOnNewFile", true);
  const defaultTemplate = config.get<string>("defaultTemplate", "class");

  if (!autoInsert || defaultTemplate === "none") {
    return;
  }

  if (!SUPPORTED_LANGS.has(doc.languageId)) {
    return;
  }

  if (!isEmptyDocument(doc)) {
    return;
  }

  // Wait briefly so the editor is fully ready
  await new Promise<void>((resolve) => setTimeout(resolve, 100));

  const editor = vscode.window.visibleTextEditors.find(
    (e) => e.document.uri.toString() === doc.uri.toString(),
  );

  if (!editor) {
    return;
  }

  await insertTemplate(defaultTemplate as TemplateKind, editor);
}

// ─── Extension Lifecycle ─────────────────────────────────────────────────────

export function activate(context: vscode.ExtensionContext): void {
  // Register manual commands
  const commands: Array<[string, TemplateKind]> = [
    ["pascalCaseClassNaming.insertClass", "class"],
    ["pascalCaseClassNaming.insertInterface", "interface"],
    ["pascalCaseClassNaming.insertAbstractClass", "abstractClass"],
    ["pascalCaseClassNaming.insertEnum", "enum"],
  ];

  for (const [commandId, kind] of commands) {
    context.subscriptions.push(
      vscode.commands.registerCommand(commandId, async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
          vscode.window.showWarningMessage(
            "Pascal-Case Class Naming: No active editor found.",
          );
          return;
        }
        await insertTemplate(kind, editor);
      }),
    );
  }

  // Auto-insert when a new document opens
  context.subscriptions.push(
    vscode.workspace.onDidOpenTextDocument(handleNewDocument),
  );

  // Also handle the case where the file was already open when the extension activated
  const activeEditor = vscode.window.activeTextEditor;
  if (activeEditor) {
    handleNewDocument(activeEditor.document);
  }
}

export function deactivate(): void {}
