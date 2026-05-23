export interface Tool {
  slug: string;
  name: string;
  description: string;
  category: string;
  keywords: string[];
  emoji: string;
}

export const TOOLS: Tool[] = [
  // High-volume — universally searched by devs
  { slug: 'json-formatter',    name: 'JSON Formatter',        description: 'Format, validate, and minify JSON.',                          category: 'Format',   emoji: '{}',  keywords: ['json formatter', 'json prettifier', 'json validator', 'json beautifier'] },
  { slug: 'base64',            name: 'Base64',                description: 'Encode and decode Base64 strings.',                          category: 'Encode',   emoji: '🔐',  keywords: ['base64 encoder', 'base64 decoder', 'base64 encode decode'] },
  { slug: 'url-encode',        name: 'URL Encode / Decode',   description: 'Percent-encode and decode URLs.',                            category: 'Encode',   emoji: '🔗',  keywords: ['url encoder', 'url decoder', 'percent encode', 'urlencode'] },
  { slug: 'timestamp',         name: 'Timestamp Converter',   description: 'Convert Unix epoch timestamps to readable dates.',           category: 'Convert',  emoji: '🕐',  keywords: ['epoch converter', 'unix timestamp converter', 'epoch to datetime', 'timestamp to date'] },
  { slug: 'word-counter',      name: 'Word Counter',          description: 'Count words, characters, lines, and reading time.',         category: 'Text',     emoji: '📏',  keywords: ['word counter', 'character counter', 'word count tool'] },
  { slug: 'regex-tester',      name: 'Regex Tester',          description: 'Test and debug regular expressions.',                       category: 'Text',     emoji: '🔍',  keywords: ['regex tester', 'regex checker', 'regular expression tester online'] },
  { slug: 'jwt-decoder',       name: 'JWT Decoder',           description: 'Decode and inspect JWT tokens.',                             category: 'Encode',   emoji: '🪙',  keywords: ['jwt decoder', 'jwt parser', 'json web token decoder'] },
  { slug: 'uuid-generator',    name: 'UUID Generator',        description: 'Generate v4 UUIDs instantly.',                              category: 'Generate', emoji: '🆔',  keywords: ['uuid generator', 'guid generator', 'random uuid'] },
  { slug: 'text-diff',         name: 'Text Diff',             description: 'Compare two texts and highlight differences.',              category: 'Text',     emoji: '↔️',  keywords: ['text diff', 'text compare', 'diff checker online', 'string diff'] },
  { slug: 'hash-generator',    name: 'Hash Generator',        description: 'Generate MD5, SHA-1, SHA-256, SHA-512 hashes.',             category: 'Encode',   emoji: '#',   keywords: ['hash generator', 'md5 generator', 'sha256 generator', 'sha1'] },
  { slug: 'color-converter',   name: 'Color Converter',       description: 'Convert between HEX, RGB, HSL, and HSV colors.',            category: 'Convert',  emoji: '🎨',  keywords: ['color converter', 'hex to rgb', 'rgb to hex', 'color picker', 'hsl converter'] },
  { slug: 'lorem-ipsum',       name: 'Lorem Ipsum',           description: 'Generate lorem ipsum placeholder text.',                    category: 'Generate', emoji: '📰',  keywords: ['lorem ipsum generator', 'placeholder text', 'dummy text generator'] },

  // Mid-volume — popular among devs
  { slug: 'html-formatter',    name: 'HTML Formatter',        description: 'Beautify and minify HTML.',                                   category: 'Format',   emoji: '🌐',  keywords: ['html formatter', 'html beautifier', 'html minifier'] },
  { slug: 'markdown-preview',  name: 'Markdown Preview',      description: 'Live preview Markdown as rendered HTML.',                    category: 'Preview',  emoji: '📝',  keywords: ['markdown preview', 'markdown editor', 'markdown renderer online'] },
  { slug: 'case-converter',    name: 'Case Converter',        description: 'Convert text between camelCase, snake_case, kebab-case.',   category: 'Convert',  emoji: 'Aa',  keywords: ['case converter', 'camelcase', 'snake_case', 'kebab-case', 'pascalcase'] },
  { slug: 'json-to-yaml',      name: 'JSON ↔ YAML',           description: 'Convert between JSON and YAML formats.',                    category: 'Convert',  emoji: '🔄',  keywords: ['json to yaml', 'yaml to json', 'json yaml converter'] },
  { slug: 'html-entities',     name: 'HTML Entities',         description: 'Encode and decode HTML entities.',                           category: 'Encode',   emoji: '&lt;', keywords: ['html entity encoder', 'html entities', 'html encode decode'] },
  { slug: 'image-to-base64',   name: 'Image → Base64',        description: 'Convert images to Base64 data URIs.',                       category: 'Encode',   emoji: '🖼️',  keywords: ['image to base64', 'image base64 converter', 'base64 image'] },
  { slug: 'json-to-csv',       name: 'JSON ↔ CSV',            description: 'Convert between JSON arrays and CSV.',                      category: 'Convert',  emoji: '📊',  keywords: ['json to csv', 'csv to json', 'json csv converter'] },
  { slug: 'sql-formatter',     name: 'SQL Formatter',         description: 'Beautify and format SQL queries.',                            category: 'Format',   emoji: '🗄️',  keywords: ['sql formatter', 'sql beautifier', 'sql prettifier'] },
  { slug: 'yaml-formatter',    name: 'YAML Formatter',        description: 'Validate and format YAML.',                                   category: 'Format',   emoji: '📄',  keywords: ['yaml formatter', 'yaml validator', 'yaml linter'] },
  { slug: 'http-status',       name: 'HTTP Status Codes',     description: 'Quick reference for all HTTP status codes.',                category: 'Text',     emoji: '📡',  keywords: ['http status codes', 'http status reference', '404 meaning', '200 status code'] },
  { slug: 'number-base',       name: 'Number Base',           description: 'Convert between decimal, hex, binary, and octal.',          category: 'Convert',  emoji: '🔢',  keywords: ['number base converter', 'decimal to hex', 'hex to binary', 'base converter'] },

  // Niche / developer-specific
  { slug: 'token-estimator',   name: 'Token Estimator',       description: 'Estimate GPT / Claude token count for any text.',           category: 'Text',     emoji: '🤖',  keywords: ['token estimator', 'token counter', 'gpt token count', 'claude tokens'] },
  { slug: 'curl-to-fetch',     name: 'cURL → Fetch',          description: 'Convert cURL commands to JavaScript fetch().',              category: 'Convert',  emoji: '⚡',  keywords: ['curl to fetch', 'curl to javascript', 'curl converter'] },
  { slug: 'html-preview',      name: 'HTML Preview',          description: 'Render and preview HTML in real time.',                      category: 'Preview',  emoji: '🌐',  keywords: ['html preview', 'html renderer online', 'html live preview'] },
  { slug: 'mermaid-preview',   name: 'Mermaid Preview',       description: 'Render Mermaid diagrams from text.',                         category: 'Preview',  emoji: '🧜',  keywords: ['mermaid preview', 'mermaid diagram', 'mermaid renderer online'] },
  { slug: 'json-schema',       name: 'JSON Schema Generator', description: 'Generate a JSON Schema from a JSON example.',               category: 'Generate', emoji: '🧬',  keywords: ['json schema generator', 'json to schema', 'generate json schema'] },
  { slug: 'cron-parser',       name: 'Cron Parser',           description: 'Parse and explain cron expressions in plain English.',      category: 'Text',     emoji: '⏰',  keywords: ['cron parser', 'cron expression', 'cron explainer', 'cron validator'] },
  { slug: 'dotenv-parser',     name: '.env Parser',           description: 'Parse .env files into a clean key-value table.',            category: 'Text',     emoji: '⚙️',  keywords: ['.env parser', 'env file parser', 'dotenv viewer'] },
];

export const CATEGORIES = [...new Set(TOOLS.map((t) => t.category))];

export function getToolBySlug(slug: string) {
  return TOOLS.find((t) => t.slug === slug);
}
