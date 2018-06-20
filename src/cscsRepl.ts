/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
'use strict';

//import { readFileSync } from 'fs';
import { EventEmitter } from 'events';
//import * as vscode from 'vscode';
//import { OutputChannel, window } from 'vscode';

const Net  = require("net");
//const Path = require('path');

export interface StackEntry {
	id: number;
	line: number;
	name: string;
	file: string;
}

export class CscsRepl extends EventEmitter {

	private _debugger    = new Net.Socket();
	private _connectType = "sockets";
	private _host        = "127.0.0.1";
	private _port        = 13337;

	private _connected    = false;
	private _finished     = false;
	private _init         = false;

	private _queuedCommands = new Array<string>();

	private _sourceFile = "";
	public get sourceFile() {
		return this._sourceFile;
	}

	constructor() {
		super();
		//this._debugSession = debugSession;
	}

	public start(connectType: string, host: string, port: number) {
		if (this._init) {
			return;
		}
		this._init = true;
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
				this._connected = true;
				console.log('Connected!');

				for (let i = 0; i < this._queuedCommands.length; i++) {
					this.sendToServer(this._queuedCommands[i]);
				}
				this._queuedCommands.length = 0;
			});

			this._debugger.on('data', (data : string) => {
				this.processFromDebugger(data.toString().trim());
			});

			this._debugger.on('close', () => {
				this._connected = false;
				console.info('Connection closed');
			});
		}
	}
	public sendToServer(cmd : string, data = "") {
		if (this._finished) {
			return;
		}
		let lines = data.split('\n');
		let load = "";
		for (let i = 0; i < lines.length; i++) {
		  let lineData = lines[i].trim();
		  let lines2 = lineData.split('\r');
		  if (lineData === "") {
			  continue;
		  }
		  load = load + lines2[0];
		}
		//data = data.replace('\n', ' ');
		//data = data.replace('\r', ' ');
		//data = data.trim();
		if (load !== "" || !cmd.includes('|')) {
			cmd = cmd + "|" + load;
		}
		if (!this._connected) {
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
	public printCSCSOutput(msg : string, file = "", line = -1) {
		//console.error('CSCS> ' + msg + ' \r\n');
		//console.error();
		this.sendEvent('onMessage', msg);
	}
	protected processFromDebugger(data : string) {
		this.printCSCSOutput(data);
	}

	protected disconnectFromDebugger() {
		console.error('Finished debugging');
		this._connected = false;
		this._finished = true;
		this._debugger.destroy();
	}

	private sendEvent(event: string, ... args: any[]) {
		setImmediate(_ => {
			this.emit(event, ...args);
		});
	}
}