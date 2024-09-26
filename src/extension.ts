import * as vscode from 'vscode';
import { getWebviewContent } from './helpers/webview';
import { FileTypeConst, i18nFiles } from './helpers/constant';
import { handleInputs } from './helpers/template';

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand('add-messages.etms', async () => {
	const firstOptions = [FileTypeConst.TS, FileTypeConst.i18n];
	const selection = await vscode.window.showQuickPick(firstOptions, {
	  placeHolder: 'Choose type of messages to be added'
	});

	if (!selection) {
	  return;
	}

	const panel = vscode.window.createWebviewPanel(
		'inputWebview', // Identifies the type of the webview
		selection === FileTypeConst.TS ? 'Add Messages - TS' : 'Add Messages - i18n',   // Title of the panel displayed to the user
		vscode.ViewColumn.One, // Editor column to show the new webview panel in
		{
		  enableScripts: true // Allow scripts in the webview
		}
	  );

	if(selection === FileTypeConst.TS){
		panel.webview.html = getWebviewContent(selection as any);

		// Handle messages from the webview
		panel.webview.onDidReceiveMessage(
		message => {
			switch (message.command) {
			case 'submit':
				// vscode.window.showInformationMessage(`Received inputs: ${message.firstInput}, ${message.secondInput}`);
				handleInputs(message.id, message.source, message.target, 'language-main.constants.ts');
				handleInputs(message.id, message.source, message.target, 'messages.ts.en.xlf');
				handleInputs(message.id, message.source, message.target, 'messages.ts.vi.xlf');
				return;
			}
		},
		undefined,
		context.subscriptions
		);
	} else {
		panel.webview.html = getWebviewContent(selection as any);

		panel.webview.onDidReceiveMessage(
		message => {
			switch (message.command) {
			case 'submit':
				// vscode.window.showInformationMessage(`Received inputs: ${message.firstInput}, ${message.secondInput}`);
				handleInputs(message.id, message.source, message.target, 'messages.xlf');
				handleInputs(message.id, message.source, message.target, 'messages.en.xlf');
				handleInputs(message.id, message.source, message.target, 'messages.vi.xlf');
				return;
			}
		},
		undefined,
		context.subscriptions
		);
	}
    
  });

  context.subscriptions.push(disposable);
}


export function deactivate() {}
