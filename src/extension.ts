'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
const vscode = require('vscode');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "replcscs" is now active!');

    const getCode = (textEditor) => {
        if (!textEditor.selection) {
            return;
        } else if (
            textEditor.selection.start.line === textEditor.selection.end.line
            && textEditor.selection.start.character === textEditor.selection.end.character
        ) {
            return textEditor.document.lineAt(textEditor.selection.start.line).text;
        } else {
            return textEditor.document.getText(textEditor.selection);
        }
    };
}

// this method is called when your extension is deactivated
export function deactivate() {
}