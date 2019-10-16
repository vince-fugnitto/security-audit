/*********************************************************************
* Copyright (c) 2019 Ericsson
*
* This program and the accompanying materials are made
* available under the terms of the Eclipse Public License 2.0
* which is available at https://www.eclipse.org/legal/epl-2.0/
*
* SPDX-License-Identifier: EPL-2.0
**********************************************************************/

import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import * as cp from 'child_process';

/**
 * Representation of a vulnerability scan result.
 */
export interface Result {
    /**
     * The result ID.
     */
    id: number;
    /**
     * The name of the vulnerability (eg: 'Code Injection').
     */
    vulnerabilityName: string;
    /**
     * The name of the dependency.
     */
    moduleName: string;
    /**
     * The current version of the dependency.
     */
    version: string;
    /**
     * The vulnerable versions of the dependency.
     */
    vulnerableVersions: string;
    /**
     * The patched versions of the dependency.
     */
    patchedVersions: string;
    /**
     * The recommended course of action to resolve the vulnerability.
     */
    recommendation: string;
    /**
     * The severity of the vulnerability.
     */
    severity: string;
    /**
     * The internal severity code for the vulnerability (used during sorting).
     */
    severityCode: number;
    /**
     * The dependency path (path in which the dependency is pulled).
     */
    path: string;
    /**
     * Describes if a dependency is a `dependency` or `devDependency`.
     */
    isDev: string;
    /**
     * The URL for additional information.
     */
    url: string;
}

/**
 * Build and run the audit scan, generating the display.
 */
function run(): void {
    build();
    display();
}

/**
 * Build the example application.
 * - Builds the application using `yarn` generating the corresponding `yarn.lock`.
 */
function build(): void {
    console.log('Building....');
    cp.execSync('yarn', { cwd: './theia-application' });
}

/**
 * Perform the security audit scan.
 * - Scans the application using `yarn audit`.
 * - Scans for vulnerabilities with severity `moderate` or higher (`moderate`, `high` and `critical`).
 * - Outputs the results of the scan to `audit.jsonl`.
 */
function audit(): void {
    console.log('Scanning...');
    const command = cp.spawnSync('yarn', ['audit', '--level', 'moderate', '--json'], { cwd: './theia-application', encoding: 'utf8' });
    fs.writeFileSync('./output/audit.jsonl', command.stdout);
}

/**
 * Parse the output results.
 */
function parseResults(): Result[] {
    console.log('Parsing...');
    // Retrieve the content of audit scan.
    const content = fs.readFileSync('./output/audit.jsonl', 'utf8');
    const results: Result[] = [];
    // Extract the lines of the scan. Each line represents a valid JSON object.
    // The last line of the scan defines the scan summary.
    const lines: string[] = content.split('\n');
    for (let i = 0; i < lines.length - 2; i++) {
        // Create the JSON object from the line.
        const json = JSON.parse(lines[i]);
        // Extract the `Result` id.
        const id = json.data.resolution.id;
        // Skip any duplicate results.
        if (results.some((a: Result) => id === a.id)) {
            continue;
        }
        // Extract the relevant scan information.
        const result: Result = {
            id: json.data.resolution.id,
            vulnerabilityName: json.data.advisory.title,
            moduleName: json.data.advisory.module_name,
            vulnerableVersions: json.data.advisory.vulnerable_versions,
            patchedVersions: json.data.advisory.patched_versions,
            recommendation: json.data.advisory.recommendation,
            severity: json.data.advisory.severity,
            path: json.data.resolution.path,
            isDev: json.data.resolution.dev,
            version: json.data.advisory.findings[0].version,
            severityCode: getSeverityCode(json.data.advisory.severity),
            url: json.data.advisory.url,
        };
        results.push(result);
    }
    // Sort the results by descending severity.
    results.sort((a: Result, b: Result) => compareSeverity(a, b));
    return results;
}

function buildResultsTable(): string {
    const results: Result[] = parseResults();
    let markdown: string = '';
    // Build the table header.
    markdown += '| Security Vulnerability | Module Name | Severity | Version | Vulnerable Versions | Patched Versions | Recommendation | Path | Dev | URL |';
    // Build the table header separator.
    markdown += '\n|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|\n';
    // Build the table rows.
    results.forEach((i: Result) => {
        markdown += `| ${i.vulnerabilityName} | ${i.moduleName} | ${i.severity} | ${i.version} | ${i.vulnerableVersions} | ${i.patchedVersions} | ${i.recommendation} | ${i.path} | ${i.isDev} | [Info](${i.url}) |\n`;
    });
    return markdown;
}

/**
 * Parse the result determining the overall summary.
 */
function parseSummary(): Map<number, string> {
    const content = fs.readFileSync('./output/audit.jsonl', 'utf8');
    const lines: string[] = content.split('\n');
    const ids: Map<number, string> = new Map<number, string>();
    for (let i = 0; i < lines.length - 2; i++) {
        const json = JSON.parse(lines[i]);
        const id = json.data.resolution.id;
        const severity = json.data.advisory.severity;
        if (ids.has(id)) {
            continue;
        }
        ids.set(id, severity.toLowerCase());
    }
    return ids;
}

function buildSummaryTable(): string {
    let criticalCount: number = 0;
    let highCount: number = 0;
    let moderateCount: number = 0;
    const summary: Map<number, string> = parseSummary();
    summary.forEach((v: string) => {
        if (v === 'critical') {
            criticalCount++;
        }
        if (v === 'high') {
            highCount++;
        }
        if (v === 'moderate') {
            moderateCount++;
        }
    });
    let markdown: string = '';
    // Build the table header.
    markdown += '| Moderate | High | Critical |';
    // Build the table header separator.
    markdown += '\n|:---|:---|:---|\n';
    // Build the table row.
    markdown += `| ${moderateCount} | ${highCount} | ${criticalCount} |\n`;
    return markdown;
}

function display(): void {
    audit();
    console.log('Preparing the display...');
    const date = new Date();
    const dateStr: string = `${date.getDate()} / ${date.getMonth() + 1} / ${date.getFullYear()}`;
    let content: string = '';
    const summary: string = buildSummaryTable();
    const results: string = buildResultsTable();
    content += `## Security Audit - ${dateStr}\n-- -\n`;
    content += '\n### Scan Summary\n';
    content += `\n${summary}\n`;
    content += '\n### Scan Details\n';
    content += `\n${results}\n`;
    fs.writeFileSync('./docs/README.md', content);
}

/**
 * Get the severity code.
 * - The higher the code the higher the severity.
 * @param severity the vulnerability severity.
 */
function getSeverityCode(severity: string): number {
    const normalized: string = severity.toLowerCase();
    if (normalized === 'critical') {
        return 1;
    } else if (normalized === 'high') {
        return 2;
    } else {
        return 3;
    }
}

/**
 * Compare two `Result` by their severity.
 * @param a the first result.
 * @param b the second result.
 */
function compareSeverity(a: Result, b: Result): number {
    return a.severityCode - b.severityCode;
}

run();