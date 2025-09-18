import path from 'path';
import * as vscode from 'vscode';

export class WLPEditorLoader {
    private _changeDocumentSubscription: vscode.Disposable;
    private _onDidReceiveMessage: vscode.Disposable;
    private _extensionPath: string;

    constructor(
        private _document: vscode.TextDocument,
        private _webviewPanel: vscode.WebviewPanel,
        private _context: vscode.ExtensionContext
    ) {
        this._extensionPath = this._context.extensionPath;

        // Setup initial content for the webview
        this._webviewPanel.webview.options = {
            enableScripts: true,
        };

        this._webviewPanel.webview.html = this._getHtml();

        // Create document change listener to update the webview
        this._changeDocumentSubscription =
            vscode.workspace.onDidChangeTextDocument((e) => {
                if (
                    e.document.uri.toString() === this._document.uri.toString()
                ) {
                    this.updateWebview();
                }
            });

        // Create listener to process messages from the webview
        this._onDidReceiveMessage =
            this._webviewPanel.webview.onDidReceiveMessage((msg) => {
                switch (msg.type) {
                    case 'ready':
                        this.updateWebview();
                        break;
                }
            });
    }

    private _getHtml() {
        const manifest = require(path.join(
            this._extensionPath,
            'build',
            'asset-manifest.json'
        ));

        const scriptPathOnDisk = vscode.Uri.file(
            path.join(this._extensionPath, 'build', 'wlp-editor.js')
        );
        const scriptUri = scriptPathOnDisk.with({ scheme: 'vscode-resource' });
        const stylePathOnDisk = vscode.Uri.file(
            path.join(this._extensionPath, 'build', 'wlp-editor.css')
        );
        const styleUri = stylePathOnDisk.with({ scheme: 'vscode-resource' });

        
        // Use a nonce to whitelist which scripts can be run
        const nonce = this._getNonce();

        return `<!DOCTYPE html>
			<html lang="en">
			<head>
				<meta charset="utf-8">
				<meta name="viewport" content="width=device-width,initial-scale=1,shrink-to-fit=no">
				<meta name="theme-color" content="#000000">
				<title>React App</title>
				<link rel="stylesheet" type="text/css" href="${styleUri}">
				<meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src vscode-resource: https:; script-src 'nonce-${nonce}';style-src vscode-resource: 'unsafe-inline' http: https: data:;">
				<base href="${vscode.Uri.file(path.join(this._extensionPath, 'build')).with({
                    scheme: 'vscode-resource',
                })}/">
			</head>

			<body>
				<noscript>You need to enable JavaScript to run this app.</noscript>
				<div id="root"></div>

				<script nonce="${nonce}" src="${scriptUri}"></script>
			</body>
			</html>`;
    }

    private _getNonce() {
        let text = '';
        const possible =
            'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < 32; i++) {
            text += possible.charAt(
                Math.floor(Math.random() * possible.length)
            );
        }
        return text;
    }

    // Hook up event handlers so that we can synchronize the webview with the text document.
    updateWebview() {
        let doc;
        try {
            doc = JSON.parse(this._document.getText());
        } catch (error) {
            return;
        }
        this._webviewPanel.webview.postMessage({
            type: 'update',
            doc,
        });
    }

    // remove any listeners
    cleanup() {
        this._changeDocumentSubscription.dispose();
        this._onDidReceiveMessage.dispose();
    }
}
