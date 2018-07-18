/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
'use strict';

//import { readFileSync } from 'fs';
import { EventEmitter } from 'events';
//import * as vscode from 'vscode';
//import { OutputChannel, window } from 'vscode';

const Net  = require("net");

export class CscsRepl extends EventEmitter {

	private _debugger    = new Net.Socket();
	private _connectType = "sockets";
	private _host        = "127.0.0.1";
	private _port        = 13337;

	private _connected   = false;
	//private _finished    = false;
	private _init        = true;

	private _queuedCommands = new Array<string>();

	private _sourceFile = "";
	public get sourceFile() {
		return this._sourceFile;
	}

	constructor() {
		super();
	}

	public start(connectType: string, host: string, port: number) {
		if (this._connected) {
			return;
		}
		this._connectType = connectType;
		this._host = host;
		this._port = port;

		this.connectToDebugger();
	}
	public connectToDebugger() : void {
		this._connected = false;

		if (this._connectType === "sockets") {
			console.log('Connecting to ' + this._port + " on  " + this._host + "...");

			this._debugger.connect(this._port, this._host, () => {
				if (this._init) {
					this.printInfoMsg('Connected to the server at ' + this._host + ":" + this._port);
					this.printInfoMsg('Check out the results in the Output CSCS Window');
				}
				this._connected = true;
				this._init = false;

				for (let i = 0; i < this._queuedCommands.length; i++) {
					this.sendToServer(this._queuedCommands[i]);
				}
				this._queuedCommands.length = 0;
			});

			this._debugger.on('data', (data : string) => {
				this.processFromDebugger(data.toString().trim());
			});

			this._debugger.on('close', () => {
				if (!this._connected) { 
					this.printErrorMsg("Couldn't connect to " + this._host + ":" + this._port);
				} else {
					this.printWarningMsg('Connection closed');
				}
				this._connected = false;
			});
		}
	}
	public sendToServer(cmd : string, data = "") {
		//if (this._finished) {
		//	return;
		//}
		let lines = data.split('\n');
		let load = "";
		for (let i = 0; i < lines.length; i++) {
			let lineData = lines[i].trim();
			if (lineData === "") {
				continue;
			}
			let lines2 = lineData.split('\r');
		  	load = load + lines2[0];
		}
		if (load !== "" || !cmd.includes('|')) {
			cmd = cmd + "|" + load;
		}
		if (!this._connected) {
			this.connectToDebugger();
			this.printDebugMsg('No connection. Queueing [' + cmd + '] when connected.');
			this._queuedCommands.push(cmd);
			return;
		}
		this.printDebugMsg('sending to debugger: ' + cmd);
		this._debugger.write(cmd + "\n");
	}
	public printDebugMsg(msg : string) {
		//console.info('    _' + msg);		
	}
	public printInfoMsg(msg : string) {
		this.sendEvent('onInfoMessage', msg);
	}
	public printWarningMsg(msg : string) {
		this.sendEvent('onWarningMessage', msg);
	}
	public printErrorMsg(msg : string) {
		this.sendEvent('onErrorMessage', msg);
	}
	protected processFromDebugger(msg : string) {
		this.sendEvent('onReplMessage', msg);
		//this.disconnectFromDebugger();
	}

	protected disconnectFromDebugger() {
		this.sendToServer('bye');
		console.error('Finished debugging');
		this._connected = false;
		//this._finished = true;
		this._debugger.end();
	}

	private sendEvent(event: string, ... args: any[]) {
		setImmediate(_ => {
			this.emit(event, ...args);
		});
	}
}
