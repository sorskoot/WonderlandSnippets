import * as vscode from 'vscode';
import { spawn, exec } from 'child_process';
import { WLPEditorProvider } from './wlp-editor/wlp-editor';

export function activate(context: vscode.ExtensionContext) {
    const openWlpInWonderland = vscode.commands.registerCommand(
        'sorskoot.openWlpInWonderland',
        (file: vscode.Uri) => {
            let filePath = vscode.window.activeTextEditor?.document.fileName;
            if (file) {
                filePath = file.fsPath;
            }

            if (!filePath?.endsWith('.wlp')) {
                vscode.window.showErrorMessage(
                    'Please select a .wlp file to open in Wonderland Editor'
                );
                return;
            }
            const config =
                vscode.workspace.getConfiguration('WonderlandSnippets');
            const WLEPath = config.get<string>('execPath');
            if (!WLEPath) {
                vscode.window.showErrorMessage(
                    'Please set the path to the Wonderland Editor executable in the settings'
                );
                return;
            }

            exec(
                `"${WLEPath}" --project "${filePath}"`,
                (error, stdout, stderr) => {
                    if (error) {
                        vscode.window.showErrorMessage(
                            `Error opening file: ${stderr}`
                        );
                        return;
                    }
                    console.log(`stdout: ${stdout}`);
                    console.error(`stderr: ${stderr}`);
                }
            );
        }
    );
    context.subscriptions.push(openWlpInWonderland);

    const buildWlpInWonderland = vscode.commands.registerCommand(
        'sorskoot.buildWlpInWonderland',
        (file: vscode.Uri) => {
            let filePath = vscode.window.activeTextEditor?.document.fileName;
            if (file) {
                filePath = file.fsPath;
            }

            if (!filePath?.endsWith('.wlp')) {
                vscode.window.showErrorMessage(
                    'Please select a .wlp file to open in Wonderland Editor'
                );
                return;
            }
            const config =
                vscode.workspace.getConfiguration('WonderlandSnippets');
            const WLEPath = config.get<string>('execPath');
            if (!WLEPath) {
                vscode.window.showErrorMessage(
                    'Please set the path to the Wonderland Editor executable in the settings'
                );
                return;
            }

            const output = vscode.window.createOutputChannel(
                'Wonderland Editor',
                { log: true }
            );
            output.show();

            const buildContainer = spawn(WLEPath, [
                '--windowless',
                '--package',
                '--project',
                filePath,
            ]);

            let buffer = '';

            buildContainer.stdout.on('data', (data) => {
                buffer += data.toString();

                // Split the buffer at newlines and process complete messages
                let lines = buffer.split('\n');

                // Save the incomplete part (last element) back to buffer
                buffer = lines.pop() || '';

                lines.forEach((line) => {
                    const processedMessage = line
                        .replace(/^.*\[(?:info|error|warn)\]\s*/, '')
                        .replace('\r', '');
                    if (processedMessage.trim()) {
                        // Check if the line has content
                        output.info(processedMessage);
                    }
                });
            });
            let errBuffer = '';
            buildContainer.stderr.on('data', (data) => {
                errBuffer += data.toString();
                let lines = errBuffer.split('\n');
                errBuffer = lines.pop() || '';
                lines.forEach((line) => {
                    const processedMessage = line
                        .replace(/^.*\[(?:info|error|warn)\]\s*/, '')
                        .replace('\r', '');
                    if (processedMessage.trim()) {
                        // Check if the line has content
                        if (line.includes('[error]')) {
                            output.error(processedMessage);
                        } else {
                            output.warn(processedMessage);
                        }
                    }
                });

                if (data.toString().includes('[error] Packaging failed.')) {
                    vscode.window
                        .showErrorMessage(`Packging failed`)
                        .then(() => {
                            output.show();
                        });
                }
            });
        }
    );
    context.subscriptions.push(buildWlpInWonderland);
    context.subscriptions.push(WLPEditorProvider.register(context));
}
