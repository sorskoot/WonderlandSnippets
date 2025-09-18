import * as vscode from 'vscode';
import { WLPEditorLoader } from './wlp-editor-loader';

export class WLPEditorProvider {
    constructor(private _context: vscode.ExtensionContext) {}

    static register(context: vscode.ExtensionContext) {
        const viewType = 'wlpEditor.wlp';
        const providerRegistration = vscode.window.registerCustomEditorProvider(
            viewType,
            new WLPEditorProvider(context)
        );
        return providerRegistration;
    }

    async resolveCustomTextEditor(
        document: vscode.TextDocument,
        webviewPanel: vscode.WebviewPanel,
        token: vscode.CancellationToken
    ) {
        const editor = new WLPEditorLoader(
            document,
            webviewPanel,
            this._context
        );

        webviewPanel.onDidDispose(() => {
            editor.cleanup();
        });
    }
}
