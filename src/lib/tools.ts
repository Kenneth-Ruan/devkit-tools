export interface Tool {
  slug: string;
  name: string;
  description: string;
  category: string;
  keywords: string[];
  emoji: string;
  family?: string;
}

export const FAMILY_LABELS: Record<string, string> = {
  'json-utils':   'JSON Utilities',
  'json-convert': 'JSON Converters',
  'xml':          'XML Tools',
  'yaml':         'YAML Tools',
  'html':         'HTML Tools',
  'encode':       'Encoders',
  'text':         'Text & Dev',
  'css':          'CSS Tools',
};

export const TOOLS: Tool[] = [
  // Top 3
  { slug: 'json-formatter',    family: 'json-utils',   name: 'JSON Formatter',        description: 'Format, validate, and minify JSON.',                          category: 'Format',   emoji: '{}',  keywords: ['json formatter', 'json prettifier', 'json validator', 'json beautifier'] },
  { slug: 'markdown-preview',                          name: 'Markdown Preview',      description: 'Live preview Markdown as rendered HTML.',                    category: 'AI',       emoji: '📝',  keywords: ['markdown preview', 'markdown editor', 'markdown renderer online'] },
  { slug: 'html-preview',      family: 'html',         name: 'HTML Preview',          description: 'Render and preview HTML in real time.',                      category: 'AI',       emoji: '🌐',  keywords: ['html preview', 'html renderer online', 'html live preview'] },

  // High-volume — universally searched by devs
  { slug: 'base64',            family: 'encode',       name: 'Base64',                description: 'Encode and decode Base64 strings.',                          category: 'Encode',   emoji: '🔐',  keywords: ['base64 encoder', 'base64 decoder', 'base64 encode decode'] },
  { slug: 'url-encode',        family: 'encode',       name: 'URL Encode / Decode',   description: 'Percent-encode and decode URLs.',                            category: 'Encode',   emoji: '🔗',  keywords: ['url encoder', 'url decoder', 'percent encode', 'urlencode'] },
  { slug: 'timestamp',                                 name: 'Timestamp Converter',   description: 'Convert Unix epoch timestamps to readable dates.',           category: 'Convert',  emoji: '🕐',  keywords: ['epoch converter', 'unix timestamp converter', 'epoch to datetime', 'timestamp to date'] },
  { slug: 'word-counter',      family: 'text',         name: 'Word Counter',          description: 'Count words, characters, lines, and reading time.',         category: 'Text',     emoji: '📏',  keywords: ['word counter', 'character counter', 'word count tool'] },
  { slug: 'regex-tester',      family: 'text',         name: 'Regex Tester',          description: 'Test and debug regular expressions.',                       category: 'Text',     emoji: '🔍',  keywords: ['regex tester', 'regex checker', 'regular expression tester online'] },
  { slug: 'jwt-decoder',       family: 'encode',       name: 'JWT Decoder',           description: 'Decode and inspect JWT tokens.',                             category: 'Encode',   emoji: '🪙',  keywords: ['jwt decoder', 'jwt parser', 'json web token decoder'] },
  { slug: 'uuid-generator',                            name: 'UUID Generator',        description: 'Generate v4 UUIDs instantly.',                              category: 'Generate', emoji: '🆔',  keywords: ['uuid generator', 'guid generator', 'random uuid'] },
  { slug: 'text-diff',         family: 'text',         name: 'Text Diff',             description: 'Compare two texts and highlight differences.',              category: 'Text',     emoji: '↔️',  keywords: ['text diff', 'text compare', 'diff checker online', 'string diff'] },
  { slug: 'hash-generator',    family: 'encode',       name: 'Hash Generator',        description: 'Generate MD5, SHA-1, SHA-256, SHA-512 hashes.',             category: 'Encode',   emoji: '#',   keywords: ['hash generator', 'md5 generator', 'sha256 generator', 'sha1'] },
  { slug: 'color-converter',                           name: 'Color Converter',       description: 'Convert between HEX, RGB, HSL, and HSV colors.',            category: 'Convert',  emoji: '🎨',  keywords: ['color converter', 'hex to rgb', 'rgb to hex', 'color picker', 'hsl converter'] },
  { slug: 'lorem-ipsum',                               name: 'Lorem Ipsum',           description: 'Generate lorem ipsum placeholder text.',                    category: 'Generate', emoji: '📰',  keywords: ['lorem ipsum generator', 'placeholder text', 'dummy text generator'] },

  // AI-focused tools
  { slug: 'token-estimator',   family: 'text',         name: 'Token Estimator',       description: 'Estimate GPT / Claude token count for any text.',           category: 'AI',       emoji: '🤖',  keywords: ['token estimator', 'token counter', 'gpt token count', 'claude tokens'] },
  { slug: 'mermaid-preview',                           name: 'Mermaid Preview',       description: 'Render Mermaid diagrams from text.',                         category: 'AI',       emoji: '🧜',  keywords: ['mermaid preview', 'mermaid diagram', 'mermaid renderer online'] },

  // Mid-volume — popular among devs
  { slug: 'html-formatter',    family: 'html',         name: 'HTML Formatter',        description: 'Beautify and minify HTML.',                                   category: 'Format',   emoji: '🌐',  keywords: ['html formatter', 'html beautifier', 'html minifier'] },
  { slug: 'case-converter',                            name: 'Case Converter',        description: 'Convert text between camelCase, snake_case, kebab-case.',   category: 'Convert',  emoji: 'Aa',  keywords: ['case converter', 'camelcase', 'snake_case', 'kebab-case', 'pascalcase'] },
  { slug: 'json-to-yaml',      family: 'json-convert', name: 'JSON ↔ YAML',           description: 'Convert between JSON and YAML formats.',                    category: 'Convert',  emoji: '🔄',  keywords: ['json to yaml', 'yaml to json', 'json yaml converter'] },
  { slug: 'html-entities',     family: 'encode',       name: 'HTML Entities',         description: 'Encode and decode HTML entities.',                           category: 'Encode',   emoji: '&lt;', keywords: ['html entity encoder', 'html entities', 'html encode decode'] },
  { slug: 'image-to-base64',   family: 'encode',       name: 'Image → Base64',        description: 'Convert images to Base64 data URIs.',                       category: 'Encode',   emoji: '🖼️',  keywords: ['image to base64', 'image base64 converter', 'base64 image'] },
  { slug: 'json-to-csv',       family: 'json-convert', name: 'JSON ↔ CSV',            description: 'Convert between JSON arrays and CSV.',                      category: 'Convert',  emoji: '📊',  keywords: ['json to csv', 'csv to json', 'json csv converter'] },
  { slug: 'sql-formatter',                             name: 'SQL Formatter',         description: 'Beautify and format SQL queries.',                            category: 'Format',   emoji: '🗄️',  keywords: ['sql formatter', 'sql beautifier', 'sql prettifier'] },
  { slug: 'yaml-formatter',    family: 'yaml',         name: 'YAML Formatter',        description: 'Validate and format YAML.',                                   category: 'Format',   emoji: '📄',  keywords: ['yaml formatter', 'yaml validator', 'yaml linter'] },
  { slug: 'http-status',       family: 'text',         name: 'HTTP Status Codes',     description: 'Quick reference for all HTTP status codes.',                category: 'Text',     emoji: '📡',  keywords: ['http status codes', 'http status reference', '404 meaning', '200 status code'] },
  { slug: 'number-base',                               name: 'Number Base',           description: 'Convert between decimal, hex, binary, and octal.',          category: 'Convert',  emoji: '🔢',  keywords: ['number base converter', 'decimal to hex', 'hex to binary', 'base converter'] },

  // Niche / developer-specific
  { slug: 'curl-to-fetch',                             name: 'cURL → Fetch',          description: 'Convert cURL commands to JavaScript fetch().',              category: 'Convert',  emoji: '⚡',  keywords: ['curl to fetch', 'curl to javascript', 'curl converter'] },
  { slug: 'json-schema',       family: 'json-utils',   name: 'JSON Schema Generator', description: 'Generate a JSON Schema from a JSON example.',               category: 'Generate', emoji: '🧬',  keywords: ['json schema generator', 'json to schema', 'generate json schema'] },
  { slug: 'cron-parser',       family: 'text',         name: 'Cron Parser',           description: 'Parse and explain cron expressions in plain English.',      category: 'Text',     emoji: '⏰',  keywords: ['cron parser', 'cron expression', 'cron explainer', 'cron validator'] },
  { slug: 'dotenv-parser',     family: 'text',         name: '.env Parser',           description: 'Parse .env files into a clean key-value table.',            category: 'Text',     emoji: '⚙️',  keywords: ['.env parser', 'env file parser', 'dotenv viewer'] },

  // JSON Converters
  { slug: 'json-to-xml',   family: 'json-convert', name: 'JSON → XML',         description: 'Convert JSON to XML format.',                              category: 'Convert',  emoji: '📋',  keywords: ['json to xml', 'json xml converter', 'convert json to xml online'] },
  { slug: 'json-to-tsv',   family: 'json-convert', name: 'JSON ↔ TSV',         description: 'Convert between JSON arrays and tab-separated values.',   category: 'Convert',  emoji: '📊',  keywords: ['json to tsv', 'tsv to json', 'json tsv converter', 'tab separated'] },

  // XML Tools
  { slug: 'xml-formatter', family: 'xml',          name: 'XML Formatter',      description: 'Format, minify, and validate XML.',                       category: 'Format',   emoji: '📋',  keywords: ['xml formatter', 'xml beautifier', 'xml minifier', 'xml validator'] },
  { slug: 'xml-to-json',   family: 'xml',          name: 'XML → JSON',         description: 'Convert XML to JSON format.',                             category: 'Convert',  emoji: '🔄',  keywords: ['xml to json', 'xml json converter', 'convert xml to json online'] },
  { slug: 'xml-to-csv',    family: 'xml',          name: 'XML → CSV',          description: 'Convert XML to CSV (comma-separated values).',            category: 'Convert',  emoji: '📊',  keywords: ['xml to csv', 'xml csv converter', 'convert xml to csv'] },
  { slug: 'xml-to-yaml',   family: 'xml',          name: 'XML → YAML',         description: 'Convert XML to YAML format.',                             category: 'Convert',  emoji: '🔄',  keywords: ['xml to yaml', 'xml yaml converter', 'convert xml to yaml'] },

  // CSS Tools
  { slug: 'css-formatter', family: 'css',          name: 'CSS Formatter',      description: 'Beautify and minify CSS stylesheets.',                    category: 'Format',   emoji: '🎨',  keywords: ['css formatter', 'css beautifier', 'css minifier', 'css prettifier'] },

  // YAML Converters
  { slug: 'yaml-to-xml',   family: 'yaml',         name: 'YAML → XML',         description: 'Convert YAML to XML format.',                             category: 'Convert',  emoji: '🔄',  keywords: ['yaml to xml', 'yaml xml converter', 'convert yaml to xml'] },
  { slug: 'yaml-to-csv',   family: 'yaml',         name: 'YAML → CSV',         description: 'Convert YAML to CSV (comma-separated values).',           category: 'Convert',  emoji: '📊',  keywords: ['yaml to csv', 'yaml csv converter', 'convert yaml to csv'] },

  // JSON Utilities
  { slug: 'json-compare',  family: 'json-utils',   name: 'JSON Compare',       description: 'Compare two JSON objects and highlight differences.',     category: 'Text',     emoji: '↔️',  keywords: ['json compare', 'json diff', 'compare json online', 'json difference checker'] },
  { slug: 'json-sorter',   family: 'json-utils',   name: 'JSON Sorter',        description: 'Sort JSON object keys alphabetically.',                   category: 'Format',   emoji: '🔢',  keywords: ['json sorter', 'sort json keys', 'json key sorter', 'alphabetize json'] },

  // Escape Utilities
  { slug: 'json-escape',   family: 'encode',       name: 'JSON Escape',        description: 'Escape and unescape JSON string values.',                 category: 'Encode',   emoji: '🔐',  keywords: ['json escape', 'json unescape', 'json string escape', 'escape json characters'] },
  { slug: 'xml-escape',    family: 'encode',       name: 'XML Escape',         description: 'Escape and unescape XML special characters.',             category: 'Encode',   emoji: '🔐',  keywords: ['xml escape', 'xml unescape', 'xml entity escape', 'escape xml characters'] },
];

const allCategories = [...new Set(TOOLS.map((t) => t.category))];
export const CATEGORIES = ['AI', ...allCategories.filter((c) => c !== 'AI')];

export function getToolBySlug(slug: string) {
  return TOOLS.find((t) => t.slug === slug);
}

export function getSiblings(slug: string): Tool[] {
  const tool = TOOLS.find((t) => t.slug === slug);
  if (!tool?.family) return [];
  return TOOLS.filter((t) => t.family === tool.family && t.slug !== slug);
}
