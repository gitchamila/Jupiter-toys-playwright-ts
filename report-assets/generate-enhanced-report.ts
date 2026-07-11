import * as fs from 'fs';
import * as path from 'path';



type Attachment = {
    name: string;
    path?: string;
    type?: string;
};

type StepInfo = {
    title: string;
    status: string;
    duration?: number;
    error?: string;
    attachments?: Attachment[];
    steps?: StepInfo[];
};

type TestCase = {
    title: string;
    file: string;
    status: string;
    duration?: number;
    error?: string;
    project?: string;
    steps?: StepInfo[];
    attachments?: Attachment[];
};

const rootDir = process.cwd();
const assetsDir = path.join(rootDir, 'report-assets');
const outputFile = path.join(rootDir, 'reports', 'enhanced-report.html');
const styleFile = path.join(assetsDir, 'qa-report-style.css');
const logoFile = path.join(assetsDir, 'Jupiter_logo.png');

function escapeHtml(value = ''): string {
    return String(value)
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#039;');
}

function formatDuration(ms?: number): string {
    if (!ms || ms < 0) return '0ms';
    if (ms < 1000) return `${Math.round(ms)}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
}

function normalizeStatus(status?: string): string {
    const value = (status || 'unknown').toLowerCase();
    if (value === 'passed' || value === 'pass') return 'passed';
    if (value === 'failed' || value === 'fail' || value === 'failure') return 'failed';
    if (value === 'skipped' || value === 'skip' || value === 'pending') return 'skipped';
    return 'unknown';
}

function toRelativePath(targetPath: string): string {
    const rel = path.relative(rootDir, targetPath).split(path.sep).join('/');
    return rel.startsWith('.') ? rel : `./${rel}`;
}

function readJson(filePath: string): any | null {
    try {
        return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    } catch {
        return null;
    }
}

function collectJsonFiles(dir: string): string[] {
    if (!fs.existsSync(dir)) return [];
    const files: string[] = [];

    const walk = (current: string) => {
        for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
            const fullPath = path.join(current, entry.name);
            if (entry.isDirectory()) {
                walk(fullPath);
            } else if (entry.isFile() && entry.name.endsWith('.json')) {
                files.push(fullPath);
            }
        }
    };

    walk(dir);
    return files.sort();
}

function parseAttachments(rawAttachments: any[] = []): Attachment[] {
    return rawAttachments
        .map((item) => {
            const name = item?.name || item?.title || 'Attachment';
            const filePath = item?.path || item?.attachment?.path || item?.filePath;
            return {
                name,
                path: filePath ? toRelativePath(path.resolve(rootDir, filePath)) : undefined,
                type: item?.contentType || item?.type || undefined,
            };
        })
        .filter((item) => item.name);
}

function parseSteps(rawSteps: any[] = []): StepInfo[] {
    return (rawSteps || []).map((step) => ({
        title: step?.title || step?.name || 'Step',
        status: normalizeStatus(step?.status || step?.result?.status),
        duration: typeof step?.duration === 'number' ? step.duration : undefined,
        error: step?.error?.message || step?.error || undefined,
        attachments: parseAttachments(step?.attachments || []),
        steps: parseSteps(step?.steps || []),
    }));
}

function extractTestsFromObject(value: any, fileName: string, projectName = ''): TestCase[] {
    if (!value || typeof value !== 'object') return [];

    if (Array.isArray(value)) {
        return value.flatMap((item) => extractTestsFromObject(item, fileName, projectName));
    }

    const tests: TestCase[] = [];

    if (Array.isArray(value.tests)) {
        for (const test of value.tests) {
            const title = test?.title || test?.name || 'Unnamed test';
            tests.push({
                title,
                file: value?.file || fileName,
                status: normalizeStatus(test?.status || test?.outcome),
                duration: typeof test?.duration === 'number' ? test.duration : undefined,
                error: test?.error?.message || test?.errors?.[0]?.message || undefined,
                project: test?.projectName || projectName || value?.projectName || undefined,
                steps: parseSteps(test?.steps || []),
                attachments: parseAttachments(test?.attachments || []),
            });
        }
    }

    if (Array.isArray(value.suites)) {
        for (const suite of value.suites) {
            tests.push(...extractTestsFromObject(suite, fileName, projectName));
        }
    }

    if (Array.isArray(value.specs)) {
        for (const spec of value.specs) {
            tests.push(...extractTestsFromObject(spec, fileName, projectName));
        }
    }

    if (Array.isArray(value.specs)) {
        for (const spec of value.specs) {
            const specTests = extractTestsFromObject(spec, fileName, projectName);
            tests.push(...specTests);
        }
    }

    if (value?.title && (value?.status || value?.steps || value?.attachments)) {
        tests.push({
            title: value.title,
            file: value?.file || fileName,
            status: normalizeStatus(value?.status),
            duration: typeof value?.duration === 'number' ? value.duration : undefined,
            error: value?.error?.message || undefined,
            project: value?.projectName || projectName || undefined,
            steps: parseSteps(value?.steps || []),
            attachments: parseAttachments(value?.attachments || []),
        });
    }

    return tests;
}

function buildSummary(tests: TestCase[]) {
    const total = tests.length;
    const passed = tests.filter((t) => t.status === 'passed').length;
    const failed = tests.filter((t) => t.status === 'failed').length;
    const skipped = tests.filter((t) => t.status === 'skipped').length;
    const unknown = tests.filter((t) => t.status === 'unknown').length;
    const passPercent = total ? ((passed / total) * 100).toFixed(1) : '0.0';
    const failPercent = total ? ((failed / total) * 100).toFixed(1) : '0.0';
    const totalDuration = tests.reduce((sum, t) => sum + (t.duration || 0), 0);

    return { total, passed, failed, skipped, unknown, passPercent, failPercent, totalDuration };
}

function renderEvidence(attachments: Attachment[] = []): string {
    if (!attachments.length) return '<span class="muted">No evidence attached</span>';

    return attachments
        .map((attachment) => {
            const name = escapeHtml(attachment.name);
            const href = attachment.path ? escapeHtml(attachment.path) : '#';

            if (attachment.type?.includes('image')) {
                return `<a class="evidence-link" href="${href}" target="_blank"><img src="${href}" alt="${name}" class="thumbnail" /></a>`;
            }

            if (attachment.type?.includes('video') || attachment.name.toLowerCase().includes('video')) {
                return `<a class="evidence-pill" href="${href}" target="_blank">Video</a>`;
            }

            if (attachment.name.toLowerCase().includes('trace') || attachment.path?.toLowerCase().includes('.zip')) {
                return `<a class="evidence-pill" href="${href}" target="_blank">Trace</a>`;
            }

            return `<a class="evidence-pill" href="${href}" target="_blank">${name}</a>`;
        })
        .join('');
}

function renderSteps(steps: StepInfo[] = []): string {
    if (!steps.length) {
        return '<p class="muted">No step details available.</p>';
    }

    return `
    <ul class="qa-step-list">
      ${steps
            .map((step) => {
                const badge = `<span class="badge ${step.status}">${escapeHtml(step.status)}</span>`;
                const details = step.error ? `<div class="error">${escapeHtml(step.error)}</div>` : '';
                const evidence = renderEvidence(step.attachments || []);
                return `
            <li>
              <strong>${escapeHtml(step.title)}</strong>
              <div class="step-meta">${badge} • ${formatDuration(step.duration)} </div>
              ${details}
              ${evidence ? `<div class="evidence-block">${evidence}</div>` : ''}
              ${renderSteps(step.steps || [])}
            </li>
          `;
            })
            .join('')}
    </ul>
  `;
}

function buildHtml(tests: TestCase[]): string {
    const summary = buildSummary(tests);
    const css = fs.existsSync(styleFile) ? fs.readFileSync(styleFile, 'utf-8') : '';
    const logoHtml = fs.existsSync(logoFile) ? `<img src="${toRelativePath(logoFile)}" alt="Jupiter logo" />` : '';

    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Enhanced Playwright QA Report</title>
  <style>${css}</style>
</head>
<body>
  <header class="qa-summary-header">
    <div class="qa-brand">
      ${logoHtml}
      <div>
        <h1>Enhanced Playwright QA Report</h1>
        <p>Real execution data from Playwright artifacts, screenshots, traces, and test steps.</p>
      </div>
    </div>
  </header>

  <section class="qa-summary-cards">
    <div><span>Total Tests</span><strong>${summary.total}</strong></div>
    <div><span>Passed</span><strong>${summary.passed}</strong></div>
    <div><span>Failed</span><strong>${summary.failed}</strong></div>
    <div><span>Skipped</span><strong>${summary.skipped}</strong></div>
    <div><span>Pass %</span><strong>${summary.passPercent}%</strong></div>
    <div><span>Fail %</span><strong>${summary.failPercent}%</strong></div>
    <div><span>Total Duration</span><strong>${formatDuration(summary.totalDuration)}</strong></div>
    <div><span>Unknown</span><strong>${summary.unknown}</strong></div>
  </section>

  <h2 class="qa-section-title">Test Case Details</h2>

  <div class="qa-table-wrap">
    <table width="100%" cellpadding="8" cellspacing="0">
      <thead>
        <tr>
          <th>Test Case</th>
          <th>Spec</th>
          <th>Status</th>
          <th>Duration</th>
          <th>Evidence</th>
        </tr>
      </thead>
      <tbody>
        ${tests.length ? tests.map((test) => `
          <tr>
            <td><strong>${escapeHtml(test.title)}</strong></td>
            <td>${escapeHtml(test.file)}</td>
            <td><span class="badge ${test.status}">${escapeHtml(test.status)}</span></td>
            <td>${formatDuration(test.duration)}</td>
            <td>${renderEvidence(test.attachments || [])}</td>
          </tr>
        `).join('') : `
          <tr>
            <td colspan="5">
              <p class="muted">No detailed Playwright execution data was found. Run the tests first and ensure result artifacts exist under test-results/.</p>
            </td>
          </tr>
        `}
      </tbody>
    </table>
  </div>

  ${tests.map((test) => `
    <section class="qa-table-wrap">
      <div class="qa-section-title">${escapeHtml(test.title)}</div>
      <div style="padding: 0 16px 16px;">
        <p class="muted">
          Spec: ${escapeHtml(test.file)} |
          Status: <span class="badge ${test.status}">${escapeHtml(test.status)}</span> |
          Duration: ${formatDuration(test.duration)}
        </p>
        ${test.error ? `<div class="error">${escapeHtml(test.error)}</div>` : ''}
        ${renderSteps(test.steps || [])}
      </div>
    </section>
  `).join('')}
</body>
</html>
`;
}

function main(): void {
    const searchRoots = [
        path.join(rootDir, 'test-results'),
        path.join(rootDir, 'playwright-report'),
        path.join(rootDir, 'allure-results')
    ];
    const jsonFiles = searchRoots.flatMap((dir) => collectJsonFiles(dir));

    const tests: TestCase[] = [];

    const lastRunFile = path.join(rootDir, 'test-results', '.last-run.json');
    if (fs.existsSync(lastRunFile)) {
        const lastRun = readJson(lastRunFile);
        if (lastRun?.status) {
            tests.push({
                title: 'Latest run summary',
                file: '.last-run.json',
                status: normalizeStatus(lastRun.status),
                error: lastRun.failedTests?.length ? 'Failed tests recorded in last run.' : undefined,
            });
        }
    }

    for (const file of jsonFiles) {
        const data = readJson(file);
        if (!data) continue;
        tests.push(...extractTestsFromObject(data, file));
    }

    fs.mkdirSync(path.dirname(outputFile), { recursive: true });
    fs.writeFileSync(outputFile, buildHtml(tests), 'utf-8');
    console.log(`Enhanced report generated: ${outputFile}`);
}

main();