'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { CscsRepl } from './cscsRepl';
//import { SignalRConfiguration, SignalR } from 'ng2-signalr';
//import { SignalRModule, SignalRConnection } from 'ng2-signalr';
//import { Resolve, Route } from '@angular/router';
//import { Injectable } from '@angular/core';

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

    cscsRepl.on('onInfoMessage', (msg : string) => {
        vscode.window.showInformationMessage('REPL: ' + msg);
    });
    cscsRepl.on('onWarningMessage', (msg : string) => {
        vscode.window.showWarningMessage('REPL: ' + msg);
    });
    cscsRepl.on('onErrorMessage', (msg : string) => {
        vscode.window.showErrorMessage('REPL: ' + msg);
    });

    cscsRepl.on('onReplMessage', (data : string) => {
        outputChannel.append('REPL> ');
        let lines = data.split('\\n');
        if (lines.length === 1) {
            lines = data.split('\n');
        }
        let counter = 0;
        for (let i = 0; i < lines.length; i++) {
            let line = lines[i].trim();
            //if (line === "") {
            //    continue;
            //}
            outputChannel.appendLine(line);
            counter++;
        }
        if (counter === 0) {
            outputChannel.appendLine("");
        }
    });

    const getCode = () => {
        let textEditor = vscode.window.activeTextEditor;
        if (!textEditor) {
            return "";
        }
        let selection = textEditor.selection;
        let text = textEditor.document.getText(selection);
        if (textEditor.selection.start.line === textEditor.selection.end.line &&
            textEditor.selection.start.character === textEditor.selection.end.character) {
            text = textEditor.document.lineAt(textEditor.selection.start.line).text;
        }
        return text;
    };

    let disposable = vscode.commands.registerCommand('extension.cscs.repl', () => {
        let code = getCode();
        if (code === '') {
            return;
        }
        cscsRepl.sendToServer('repl', code);
    });
    context.subscriptions.push(disposable);
}
/*const config = new SignalRConfiguration();
config.hubName = 'Ng2SignalRHub';
config.qs = { user: 'donald' };
config.url = 'http://ng2-signalr-backend.azurewebsites.net/';

let _signalR: SignalR;*/

// this method is called when your extension is deactivated
export function deactivate() {
}