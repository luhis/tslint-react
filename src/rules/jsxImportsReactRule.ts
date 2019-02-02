/**
 * @license
 * Copyright 2019 Palantir Technologies, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import * as Lint from "tslint";
import * as ts from "typescript";

const jsxExtensions = [".tsx", ".jsx"];

const importsReact = (source: ts.SourceFile) => {
    const imports = source.statements.filter(ts.isImportDeclaration);
    const reactImports = imports.filter((imp) =>
        ts.isLiteralExpression(imp.moduleSpecifier) &&
        imp.moduleSpecifier.text === "react");

    return reactImports.length !== 0;
};

const isReactFileExtension = (source: ts.SourceFile) => {
    return jsxExtensions.filter((ext) => source.fileName.endsWith(ext)).length !== 0;
};

const isValid = (sourceFile: ts.SourceFile): boolean => {
    return !isReactFileExtension(sourceFile) || importsReact(sourceFile);
};

export class Rule extends Lint.Rules.AbstractRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "jsx-imports-react",
        description: "Enforces a consistent file naming convention",
        rationale: "All TSX files should import React, otherwise they should be TS files",
        optionsDescription: "",
        options: null,
        optionExamples: ["true"],
        hasFix: false,
        type: "functionality",
        typescriptOnly: false,
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING = "TSX files must import React";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        const validation = isValid(sourceFile);
        return validation === true
            ? []
            : [
                new Lint.RuleFailure(
                    sourceFile,
                    0,
                    0,
                    Rule.FAILURE_STRING,
                    this.ruleName,
                ),
            ];
    }
}
