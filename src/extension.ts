'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { CscsRepl } from './cscsRepl';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    console.log('Extension "cscs-repl" is now active.');

    const config          = vscode.workspace.getConfiguration('cscs');
    let connectTypeConfig = config.get('connectType');
    let hostConfig        = config.get('serverHost');
    let portConfig        = config.get('serverPort');

    let connectType       = connectTypeConfig ? connectTypeConfig.toString() : '';
    let host              = hostConfig ? hostConfig.toString() : '';
    let port              = portConfig ? parseInt(portConfig.toString()) : 0;

    let cscsRepl = new CscsRepl();
    cscsRepl.start(connectType, host, port);

    let outputChannel = vscode.window.createOutputChannel('CSCS');

    cscsRepl.on('onMessage', (data : string) => {
        outputChannel.append('REPL> ');
        let lines = data.toString().split('\n');
        let counter = 0;
        for (let i = 0; i < lines.length; i++) {
            let line = lines[i].trim();
            if (line === "") {
                continue;
            }
            outputChannel.appendLine(line);
            counter++;
        }
        if (counter === 0) {
            outputChannel.appendLine("");
        }
        //vscode.window.showInformationMessage('REPL> ' + msg);
    });

    const getCode = () => {
        let textEditor = vscode.window.activeTextEditor;
        if (!textEditor) {
            return "";
        }
        let selection = textEditor.selection;
        let text = textEditor.document.getText(selection);
        //return text;
        if (textEditor.selection.start.line === textEditor.selection.end.line &&
            textEditor.selection.start.character === textEditor.selection.end.character) {
            text = textEditor.document.lineAt(textEditor.selection.start.line).text;
        }
        return text;
    };

    let disposable = vscode.commands.registerCommand('extension.cscs.repl', () => {
        // The code you place here will be executed every time your command is executed
        let code = getCode();
        if (code === '') {
            return;
        }
        cscsRepl.sendToServer('repl', code);
    });
    context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {
}