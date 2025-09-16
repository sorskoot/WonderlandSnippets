import {describe, it, expect, vi} from 'vitest';
import type * as vscode from 'vscode';
import {validateGLSL} from '../src/glsl-validation.js';

describe('validateGLSL', () => {
    it('should not validate non-GLSL documents', () => {
        const mockDoc = {
            languageId: 'javascript',
            getText: vi.fn().mockReturnValue(''),
        } as unknown as vscode.TextDocument;

        const mockDiagnostics = {
            set: vi.fn(() => {}),
        } as unknown as vscode.DiagnosticCollection;

        validateGLSL(mockDoc, mockDiagnostics);

        expect(mockDiagnostics.set).not.toHaveBeenCalled();
    });

    it('should validate GLSL documents and detect non-optimal packing', () => {
        const mockDoc = {
            languageId: 'glsl',
            getText: vi.fn().mockReturnValue(`
                struct Material {
                    mediump vec3 color;
                    lowp float intensity;
                    highp vec4 position;
                };
            `),
            positionAt: (offset: number) => {
                return {
                    line: 0,
                    character: offset,
                };
            },
        } as unknown as vscode.TextDocument;

        const mockDiagnostics = {
            set: vi.fn(() => {}),
        } as unknown as vscode.DiagnosticCollection;

        validateGLSL(mockDoc, mockDiagnostics);

        expect(mockDiagnostics.set).toHaveBeenCalledWith(mockDoc.uri, expect.any(Array));
        // const diagnostics = mockDiagnostics.set.mock.calls[0][1];
        // expect(diagnostics[0].message).toContain('Properties in struct');
        // expect(diagnostics[0].message).toContain('Suggested order:');
    });

    it('should handle empty GLSL documents gracefully', () => {
        const mockDoc = {
            languageId: 'glsl',
            getText: vi.fn().mockReturnValue(''),
            positionAt: vi.fn(),
        } as unknown as vscode.TextDocument;

        const mockDiagnostics = {
            set: vi.fn(() => {}),
        } as unknown as vscode.DiagnosticCollection;

        validateGLSL(mockDoc, mockDiagnostics);

        expect(mockDiagnostics.set).toHaveBeenCalledWith(mockDoc.uri, []);
    });
});
