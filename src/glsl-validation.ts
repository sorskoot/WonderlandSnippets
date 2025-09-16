import * as vscode from 'vscode';

/**
 Wonderland Shader Findings

 In `struct Material`:
 - WL doesn't support full/highp float. Should either be lowp or mediump
 - it's 1 byte per float or uint, if it's `mediump` it's 2 bytes and `highp` is 4. `vec3` are 3 floats and vec4 are 4 floats. Now the trick is to create an order where we make them all fit in blocks of 4 bytes


 */

enum Precision {
    Lowp = 'lowp',
    Mediump = 'mediump',
    Highp = 'highp',
}

enum GLSLType {
    Float = 'float',
    Uint = 'uint',
    Vec2 = 'vec2',
    Vec3 = 'vec3',
    Vec4 = 'vec4',
}

export function validateGLSL(
    doc: vscode.TextDocument,
    diagnosticCollection: vscode.DiagnosticCollection
) {
    if (doc.languageId !== 'glsl') {
        return;
    }

    const diagnostics: vscode.Diagnostic[] = [];
    const text = doc.getText();

    // Match struct definitions
    const structRegex = /struct\s+(\w+)\s*{([^}]+)}/g;
    let match;
    while ((match = structRegex.exec(text)) !== null) {
        const structName = match[1];
        const structBody = match[2];

        // Parse properties
        const properties = parseStructProperties(structBody);

        // Validate packing
        const {isOptimal, suggestedOrder} = validatePacking(properties);

        if (!isOptimal) {
            const range = new vscode.Range(
                doc.positionAt(match.index),
                doc.positionAt(match.index + match[0].length)
            );
            diagnostics.push(
                new vscode.Diagnostic(
                    range,
                    `Properties in struct '${structName}' are not optimally packed. Suggested order: ${suggestedOrder.join(
                        ', '
                    )}`,
                    vscode.DiagnosticSeverity.Warning
                )
            );
        }
    }

    diagnosticCollection.set(doc.uri, diagnostics);
}

function parseStructProperties(structBody: string) {
    const propertyRegex = /(lowp|mediump|highp)?\s*(\w+)\s+(\w+);/g;
    const properties: {precision: Precision; type: GLSLType; name: string}[] = [];
    let match;
    while ((match = propertyRegex.exec(structBody)) !== null) {
        properties.push({
            precision: (match[1] as Precision) || Precision.Highp, // Default to highp if not specified
            type: match[2] as GLSLType,
            name: match[3],
        });
    }
    return properties;
}

function validatePacking(
    properties: {precision: Precision; type: GLSLType; name: string}[]
) {
    const sizes: Record<Precision, number> = {
        [Precision.Lowp]: 1,
        [Precision.Mediump]: 2,
        [Precision.Highp]: 4,
    };

    const typeSizes: Record<GLSLType, number> = {
        [GLSLType.Float]: 1,
        [GLSLType.Uint]: 1,
        [GLSLType.Vec2]: 2,
        [GLSLType.Vec3]: 3, // vec3 is treated as 3 floats without padding
        [GLSLType.Vec4]: 4,
    };

    const blocks: number[] = [];
    let currentBlock = 0;
    const blockSize = 4; // Start with 4-byte blocks

    const orderedProperties: string[] = [];

    // Sort properties by size (large to small)
    const sortedProperties = properties.sort((a, b) => {
        const sizeA = sizes[a.precision] * typeSizes[a.type];
        const sizeB = sizes[b.precision] * typeSizes[b.type];
        return sizeB - sizeA; // Descending order
    });

    // Simulate packing with dynamic block sizes
    sortedProperties.forEach((prop) => {
        const precisionSize = sizes[prop.precision];
        const typeSize = typeSizes[prop.type];
        const totalSize = precisionSize * typeSize;

        // If a single property exceeds the current block size, use an 8-byte block
        if (totalSize > blockSize) {
            if (currentBlock > 0) {
                blocks.push(currentBlock);
                currentBlock = 0;
            }
            blocks.push(totalSize); // Add the oversized property as its own block
        } else {
            // Otherwise, try to fit it into the current block
            if (currentBlock + totalSize > blockSize) {
                blocks.push(currentBlock);
                currentBlock = 0;
            }
            currentBlock += totalSize;
        }

        orderedProperties.push(prop.name);
    });

    if (currentBlock > 0) {
        blocks.push(currentBlock);
    }

    // Check if packing is optimal
    const isOptimal = blocks.every((block) => block === blockSize || block <= 8);

    return {
        isOptimal,
        suggestedOrder: orderedProperties,
    };
}
