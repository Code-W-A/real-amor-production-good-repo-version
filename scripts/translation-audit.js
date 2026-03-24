const fs = require("fs");
const path = require("path");

const ROOT = process.cwd();
const SEARCH_DIRS = ["app", "components", "data"];
const FILE_EXTENSIONS = new Set([".js", ".jsx", ".ts", ".tsx"]);
const EXCLUDED_PATH_PATTERNS = [
  `${path.sep}app${path.sep}api${path.sep}`,
  `${path.sep}data${path.sep}quiz.js`,
  `${path.sep}data${path.sep}quizNL.js`,
  `${path.sep}data${path.sep}quiz copy.js`,
];

const TEXT_NODE_REGEX = />\s*([^<{][^<>{}]*[A-Za-zÀ-ÖØ-öø-ÿ][^<>{}]*)\s*</g;
const ATTRIBUTE_REGEX =
  /\b(placeholder|title|alt|aria-label|label|text)\s*=\s*"([^"{][^"]*[A-Za-zÀ-ÖØ-öø-ÿ][^"]*)"/g;
const DATA_TEXT_REGEX = /\b(text|label|title|heading|question)\s*:\s*"([^"]*[A-Za-zÀ-ÖØ-öø-ÿ][^"]*)"/g;

function walk(dirPath, files = []) {
  if (!fs.existsSync(dirPath)) return files;

  fs.readdirSync(dirPath, { withFileTypes: true }).forEach((entry) => {
    if (entry.name.startsWith(".")) return;
    if (entry.name === "node_modules") return;
    if (entry.name === ".next") return;

    const fullPath = path.join(dirPath, entry.name);
    if (EXCLUDED_PATH_PATTERNS.some((fragment) => fullPath.includes(fragment))) {
      return;
    }

    if (entry.isDirectory()) {
      walk(fullPath, files);
      return;
    }

    if (FILE_EXTENSIONS.has(path.extname(entry.name))) {
      files.push(fullPath);
    }
  });

  return files;
}

function shouldIgnoreLine(line) {
  return (
    line.includes("fetchTranslation(") ||
    line.includes("useTranslate(") ||
    line.includes("translateTextQuiz(") ||
    line.includes("translatedLinks.") ||
    line.includes("translatedTexts.") ||
    line.includes("//") ||
    line.includes("http://") ||
    line.includes("https://")
  );
}

function collectMatches(line, regex, kind, filePath, lineNumber, out) {
  regex.lastIndex = 0;
  let match = regex.exec(line);
  while (match) {
    const text = String(match[2] || match[1] || "").replace(/\s+/g, " ").trim();
    if (text && !shouldIgnoreLine(line)) {
      out.push({
        file: path.relative(ROOT, filePath),
        line: lineNumber,
        kind,
        text,
      });
    }
    match = regex.exec(line);
  }
}

function auditFile(filePath) {
  const lines = fs.readFileSync(filePath, "utf8").split("\n");
  const matches = [];

  lines.forEach((line, index) => {
    const lineNumber = index + 1;
    collectMatches(line, TEXT_NODE_REGEX, "jsx_text", filePath, lineNumber, matches);
    collectMatches(line, ATTRIBUTE_REGEX, "jsx_attribute", filePath, lineNumber, matches);
    collectMatches(line, DATA_TEXT_REGEX, "data_text", filePath, lineNumber, matches);
  });

  return matches;
}

const results = SEARCH_DIRS.flatMap((dir) => walk(path.join(ROOT, dir))).flatMap(auditFile);

const summaryByFile = results.reduce((acc, item) => {
  acc[item.file] = (acc[item.file] || 0) + 1;
  return acc;
}, {});

const sortedFiles = Object.entries(summaryByFile)
  .sort((a, b) => b[1] - a[1])
  .map(([file, count]) => ({ file, count }));

const report = {
  generatedAt: new Date().toISOString(),
  totalMatches: results.length,
  filesWithMatches: sortedFiles.length,
  topFiles: sortedFiles.slice(0, 50),
  matches: results.slice(0, 1000),
};

console.log(JSON.stringify(report, null, 2));
