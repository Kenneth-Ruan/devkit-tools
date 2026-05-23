import { describe, it, expect } from 'vitest';
import {
  toCamel, toPascal, toSnake, toKebab, toScream, toTitle, toSentence, toDot, toFlat,
  hexToRgb, rgbToHsl, rgbToHsv, parseColorInput,
  explainField, parseCron,
  parseCurl,
  parseEnv,
  encodeEntities, decodeEntities,
  minifyHtml,
  b64decode,
  jsonToCsv, csvToJson,
  inferType,
  convertNumberBase,
  formatSql,
  diff,
  estimateTokens,
  countStats,
  md5,
  generateV4,
  parseMarkdown,
  parseYaml,
  dumpYaml,
  formatHtml,
} from './transforms';

// ─── Case Converter ───────────────────────────────────────────────────────────

describe('Case Converter', () => {
  const inputs = ['hello world', 'hello-world', 'hello_world', 'HelloWorld'];

  it('toCamel', () => {
    expect(toCamel('hello world')).toBe('helloWorld');
    expect(toCamel('hello-world')).toBe('helloWorld');
    expect(toCamel('hello_world')).toBe('helloWorld');
    expect(toCamel('Hello World')).toBe('helloWorld');
  });

  it('toPascal', () => {
    expect(toPascal('hello world')).toBe('HelloWorld');
    expect(toPascal('hello-world')).toBe('HelloWorld');
    expect(toPascal('hello_world')).toBe('HelloWorld');
  });

  it('toSnake', () => {
    expect(toSnake('hello world')).toBe('hello_world');
    expect(toSnake('hello-world')).toBe('hello_world');
    expect(toSnake('HelloWorld')).toBe('hello_world');
    expect(toSnake('helloWorld')).toBe('hello_world');
  });

  it('toKebab', () => {
    expect(toKebab('hello world')).toBe('hello-world');
    expect(toKebab('helloWorld')).toBe('hello-world');
    expect(toKebab('hello_world')).toBe('hello-world');
  });

  it('toScream', () => {
    expect(toScream('hello world')).toBe('HELLO_WORLD');
    expect(toScream('helloWorld')).toBe('HELLO_WORLD');
  });

  it('toTitle', () => {
    expect(toTitle('hello world')).toBe('Hello World');
    expect(toTitle('HELLO WORLD')).toBe('Hello World');
  });

  it('toSentence', () => {
    expect(toSentence('hello world')).toBe('Hello world');
    expect(toSentence('HELLO WORLD')).toBe('Hello world');
  });

  it('toDot', () => {
    expect(toDot('hello world')).toBe('hello.world');
    expect(toDot('helloWorld')).toBe('hello.world');
  });

  it('toFlat', () => {
    expect(toFlat('hello world')).toBe('helloworld');
    expect(toFlat('helloWorld')).toBe('helloworld');
  });

  it('roundtrip: snake → camel → snake', () => {
    expect(toSnake(toCamel('hello_world_foo'))).toBe('hello_world_foo');
  });
});

// ─── Color Converter ──────────────────────────────────────────────────────────

describe('Color Converter', () => {
  describe('parseColorInput', () => {
    it('accepts 6-digit hex with hash', () => expect(parseColorInput('#ff0000')).toBe('#ff0000'));
    it('accepts 6-digit hex without hash', () => expect(parseColorInput('ff0000')).toBe('#ff0000'));
    it('expands 3-digit hex', () => expect(parseColorInput('#f00')).toBe('#ff0000'));
    it('expands 3-digit hex without hash', () => expect(parseColorInput('f00')).toBe('#ff0000'));
    it('parses rgb()', () => expect(parseColorInput('rgb(255, 0, 0)')).toBe('#ff0000'));
    it('parses rgb() with spaces', () => expect(parseColorInput('rgb( 0, 128, 0 )')).toBe('#008000'));
    it('rejects invalid input', () => expect(parseColorInput('not-a-color')).toBeNull());
    it('rejects partial hex', () => expect(parseColorInput('#gg0000')).toBeNull());
  });

  describe('hexToRgb', () => {
    it('converts red', () => expect(hexToRgb('#ff0000')).toEqual({ r: 255, g: 0, b: 0 }));
    it('converts white', () => expect(hexToRgb('#ffffff')).toEqual({ r: 255, g: 255, b: 255 }));
    it('converts black', () => expect(hexToRgb('#000000')).toEqual({ r: 0, g: 0, b: 0 }));
    it('converts indigo approx', () => expect(hexToRgb('#6366f1')).toEqual({ r: 99, g: 102, b: 241 }));
  });

  describe('rgbToHsl', () => {
    it('red → hsl(0, 100, 50)', () => expect(rgbToHsl(255, 0, 0)).toEqual({ h: 0, s: 100, l: 50 }));
    it('white → hsl(0, 0, 100)', () => expect(rgbToHsl(255, 255, 255)).toEqual({ h: 0, s: 0, l: 100 }));
    it('black → hsl(0, 0, 0)', () => expect(rgbToHsl(0, 0, 0)).toEqual({ h: 0, s: 0, l: 0 }));
    it('green → hsl(120, 100, 50)', () => expect(rgbToHsl(0, 255, 0)).toEqual({ h: 120, s: 100, l: 50 }));
  });

  describe('rgbToHsv', () => {
    it('red → hsv(0, 100, 100)', () => expect(rgbToHsv(255, 0, 0)).toEqual({ h: 0, s: 100, v: 100 }));
    it('black → hsv(0, 0, 0)', () => expect(rgbToHsv(0, 0, 0)).toEqual({ h: 0, s: 0, v: 0 }));
    it('white → hsv(0, 0, 100)', () => expect(rgbToHsv(255, 255, 255)).toEqual({ h: 0, s: 0, v: 100 }));
  });
});

// ─── Cron Parser ──────────────────────────────────────────────────────────────

describe('Cron Parser', () => {
  describe('explainField', () => {
    it('wildcard', () => expect(explainField('*', 'minute')).toBe('every minute'));
    it('step', () => expect(explainField('*/5', 'minute')).toBe('every 5 minutes'));
    it('specific value', () => expect(explainField('0', 'minute')).toBe('0'));
    it('range hour', () => expect(explainField('9-17', 'hour')).toBe('hour 9 to 17'));
    it('month by name', () => expect(explainField('1', 'month')).toBe('January'));
    it('dow by name', () => expect(explainField('1', 'dow')).toBe('Monday'));
    it('dow range', () => expect(explainField('1-5', 'dow')).toBe('Monday–Friday'));
    it('month list', () => expect(explainField('1,6,12', 'month')).toBe('January, June, December'));
  });

  describe('parseCron', () => {
    it('every minute', () => {
      const r = parseCron('* * * * *');
      expect('description' in r).toBe(true);
      if ('description' in r) expect(r.description).toBe('Every minute.');
    });

    it('every day at midnight', () => {
      const r = parseCron('0 0 * * *');
      expect('description' in r).toBe(true);
      if ('description' in r) expect(r.description).toContain('At 0 of 0');
    });

    it('weekdays at 9am', () => {
      const r = parseCron('0 9 * * 1-5');
      expect('description' in r).toBe(true);
      if ('description' in r) expect(r.description).toContain('Monday–Friday');
    });

    it('invalid - too few fields', () => {
      const r = parseCron('* * *');
      expect('error' in r).toBe(true);
    });

    it('invalid - too many fields', () => {
      const r = parseCron('* * * * * *');
      expect('error' in r).toBe(true);
    });
  });
});

// ─── cURL → Fetch ─────────────────────────────────────────────────────────────

describe('parseCurl', () => {
  it('simple GET', () => {
    const out = parseCurl("curl 'https://api.example.com/users'");
    expect(out).toContain("fetch('https://api.example.com/users')");
    expect(out).not.toContain('method');
  });

  it('POST with JSON body', () => {
    const out = parseCurl('curl -X POST https://api.example.com/users -d \'{"name":"Alice"}\'');
    expect(out).toContain("method: 'POST'");
    expect(out).toContain('body:');
  });

  it('with headers', () => {
    const out = parseCurl("curl -H 'Authorization: Bearer token123' https://api.example.com");
    expect(out).toContain("'Authorization': 'Bearer token123'");
  });

  it('data implies POST', () => {
    const out = parseCurl("curl https://api.example.com -d 'payload'");
    expect(out).toContain("method: 'POST'");
  });

  it('non-curl input returns error comment', () => {
    const out = parseCurl('wget https://example.com');
    expect(out).toContain('// Could not parse');
  });
});

// ─── .env Parser ──────────────────────────────────────────────────────────────

describe('parseEnv', () => {
  it('parses simple key=value', () => {
    const vars = parseEnv('FOO=bar\nBAZ=qux');
    expect(vars).toHaveLength(2);
    expect(vars[0]).toEqual({ key: 'FOO', value: 'bar' });
    expect(vars[1]).toEqual({ key: 'BAZ', value: 'qux' });
  });

  it('strips quotes', () => {
    const vars = parseEnv('DB_URL="postgresql://localhost/mydb"');
    expect(vars[0].value).toBe('postgresql://localhost/mydb');
  });

  it('strips single quotes', () => {
    const vars = parseEnv("SECRET='my secret'");
    expect(vars[0].value).toBe('my secret');
  });

  it('ignores comment lines', () => {
    const vars = parseEnv('# this is a comment\nFOO=bar');
    expect(vars).toHaveLength(1);
    expect(vars[0].key).toBe('FOO');
  });

  it('ignores empty lines', () => {
    const vars = parseEnv('\n\nFOO=bar\n\n');
    expect(vars).toHaveLength(1);
  });

  it('parses inline comments', () => {
    const vars = parseEnv('API_KEY=sk-123 # third-party key');
    expect(vars[0].value).toBe('sk-123');
    expect(vars[0].comment).toContain('third-party key');
  });

  it('ignores lines without =', () => {
    const vars = parseEnv('INVALID_LINE');
    expect(vars).toHaveLength(0);
  });
});

// ─── HTML Entities ────────────────────────────────────────────────────────────

describe('HTML Entities', () => {
  describe('encodeEntities', () => {
    it('encodes &', () => expect(encodeEntities('a & b')).toBe('a &amp; b'));
    it('encodes <', () => expect(encodeEntities('<div>')).toBe('&lt;div&gt;'));
    it('encodes "', () => expect(encodeEntities('"hello"')).toBe('&quot;hello&quot;'));
    it('encodes \'', () => expect(encodeEntities("it's")).toBe('it&#39;s'));
    it('encodes all special chars', () => {
      expect(encodeEntities('<script>alert("xss")</script>')).toBe('&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;');
    });
  });

  describe('decodeEntities (server-safe fallback)', () => {
    it('decodes &amp;', () => expect(decodeEntities('a &amp; b')).toBe('a & b'));
    it('decodes &lt; &gt;', () => expect(decodeEntities('&lt;div&gt;')).toBe('<div>'));
    it('decodes &quot;', () => expect(decodeEntities('&quot;hello&quot;')).toBe('"hello"'));
    it('decodes &#39;', () => expect(decodeEntities('it&#39;s')).toBe("it's"));
  });

  it('roundtrip encode → decode', () => {
    const original = '<div class="test">Hello & World</div>';
    expect(decodeEntities(encodeEntities(original))).toBe(original);
  });
});

// ─── HTML Formatter ───────────────────────────────────────────────────────────

describe('minifyHtml', () => {
  it('collapses whitespace', () => {
    expect(minifyHtml('<div>  hello  </div>')).toBe('<div> hello </div>');
  });
  it('removes whitespace between tags', () => {
    expect(minifyHtml('<div>\n  <p>hi</p>\n</div>')).toBe('<div><p>hi</p></div>');
  });
  it('trims result', () => {
    expect(minifyHtml('  <p>hello</p>  ')).toBe('<p>hello</p>');
  });
});

// ─── JWT Decoder ──────────────────────────────────────────────────────────────

describe('b64decode', () => {
  const SAMPLE_JWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

  it('decodes JWT header', () => {
    const [headerPart] = SAMPLE_JWT.split('.');
    const decoded = b64decode(headerPart);
    expect(decoded).toEqual({ alg: 'HS256', typ: 'JWT' });
  });

  it('decodes JWT payload', () => {
    const [, payloadPart] = SAMPLE_JWT.split('.');
    const decoded = b64decode(payloadPart) as Record<string, unknown>;
    expect(decoded.sub).toBe('1234567890');
    expect(decoded.name).toBe('John Doe');
  });

  it('returns null for invalid base64', () => {
    expect(b64decode('not-valid-json!!!')).toBeNull();
  });

  it('handles URL-safe base64 (- and _)', () => {
    // base64url of '{"a":1}'
    const encoded = btoa('{"a":1}').replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
    expect(b64decode(encoded)).toEqual({ a: 1 });
  });
});

// ─── JSON ↔ CSV ───────────────────────────────────────────────────────────────

describe('JSON ↔ CSV', () => {
  describe('jsonToCsv', () => {
    it('converts array of objects', () => {
      const csv = jsonToCsv('[{"name":"Alice","age":30},{"name":"Bob","age":25}]');
      expect(csv).toBe('name,age\nAlice,30\nBob,25');
    });

    it('wraps values with commas in quotes', () => {
      const csv = jsonToCsv('[{"city":"New York, NY","pop":8000000}]');
      expect(csv).toContain('"New York, NY"');
    });

    it('escapes double quotes inside values', () => {
      const csv = jsonToCsv('[{"note":"say \\"hi\\""}]');
      expect(csv).toContain('""hi""');
    });

    it('handles single object (not array)', () => {
      const csv = jsonToCsv('{"name":"Alice","age":30}');
      expect(csv).toBe('name,age\nAlice,30');
    });

    it('throws on invalid JSON', () => {
      expect(() => jsonToCsv('not json')).toThrow();
    });
  });

  describe('csvToJson', () => {
    it('converts CSV to JSON array', () => {
      const json = csvToJson('name,age\nAlice,30\nBob,25');
      const parsed = JSON.parse(json);
      expect(parsed).toHaveLength(2);
      expect(parsed[0]).toEqual({ name: 'Alice', age: '30' });
      expect(parsed[1]).toEqual({ name: 'Bob', age: '25' });
    });

    it('trims header whitespace', () => {
      const json = csvToJson(' name , age \nAlice,30');
      const parsed = JSON.parse(json);
      expect(parsed[0].name).toBe('Alice');
    });
  });
});

// ─── JSON Schema ──────────────────────────────────────────────────────────────

describe('inferType', () => {
  it('null → {type: null}', () => expect(inferType(null)).toEqual({ type: 'null' }));
  it('boolean → {type: boolean}', () => expect(inferType(true)).toEqual({ type: 'boolean' }));
  it('integer → {type: integer}', () => expect(inferType(42)).toEqual({ type: 'integer' }));
  it('float → {type: number}', () => expect(inferType(3.14)).toEqual({ type: 'number' }));
  it('string → {type: string}', () => expect(inferType('hello')).toEqual({ type: 'string' }));

  it('empty array', () => expect(inferType([])).toEqual({ type: 'array', items: {} }));

  it('array of strings', () => {
    expect(inferType(['a', 'b'])).toEqual({ type: 'array', items: { type: 'string' } });
  });

  it('object with properties', () => {
    const schema = inferType({ id: 1, name: 'Alice', active: true }) as Record<string, unknown>;
    expect(schema.type).toBe('object');
    expect((schema.properties as Record<string, unknown>).id).toEqual({ type: 'integer' });
    expect((schema.properties as Record<string, unknown>).name).toEqual({ type: 'string' });
    expect(schema.required).toEqual(['id', 'name', 'active']);
  });

  it('nested object', () => {
    const schema = inferType({ user: { id: 1 } }) as Record<string, unknown>;
    const userType = ((schema.properties as Record<string, unknown>).user as Record<string, unknown>).type;
    expect(userType).toBe('object');
  });
});

// ─── Number Base ──────────────────────────────────────────────────────────────

describe('convertNumberBase', () => {
  it('255 decimal → all bases', () => {
    const r = convertNumberBase('255', 10);
    expect(r).not.toBeNull();
    expect(r!.hex).toBe('FF');
    expect(r!.binary).toBe('11111111');
    expect(r!.octal).toBe('377');
  });

  it('FF hex → decimal 255', () => {
    const r = convertNumberBase('FF', 16);
    expect(r!.decimal).toBe('255');
  });

  it('11111111 binary → decimal 255', () => {
    const r = convertNumberBase('11111111', 2);
    expect(r!.decimal).toBe('255');
  });

  it('strips 0x prefix', () => {
    const r = convertNumberBase('0xFF', 16);
    expect(r!.decimal).toBe('255');
  });

  it('strips 0b prefix', () => {
    const r = convertNumberBase('0b1010', 2);
    expect(r!.decimal).toBe('10');
  });

  it('returns null for empty input', () => {
    expect(convertNumberBase('', 10)).toBeNull();
  });

  it('returns null for invalid input', () => {
    expect(convertNumberBase('xyz', 10)).toBeNull();
  });

  it('prefixed outputs', () => {
    const r = convertNumberBase('255', 10);
    expect(r!.hexPrefixed).toBe('0xFF');
    expect(r!.binaryPrefixed).toBe('0b11111111');
    expect(r!.octalPrefixed).toBe('0o377');
  });
});

// ─── SQL Formatter ────────────────────────────────────────────────────────────

describe('formatSql', () => {
  it('puts SELECT on its own line', () => {
    const out = formatSql('select * from users where id = 1', 2);
    const lines = out.split('\n');
    expect(lines[0].toLowerCase()).toContain('select');
    expect(lines.some((l) => l.toLowerCase().startsWith('from'))).toBe(true);
    expect(lines.some((l) => l.toLowerCase().startsWith('where'))).toBe(true);
  });

  it('handles JOIN', () => {
    const out = formatSql('SELECT u.name FROM users u JOIN orders o ON u.id = o.user_id', 2);
    expect(out).toContain('JOIN');
    expect(out).toContain('ON');
  });

  it('does not add blank lines', () => {
    const out = formatSql('SELECT * FROM users', 2);
    expect(out.includes('\n\n')).toBe(false);
  });
});

// ─── Text Diff ────────────────────────────────────────────────────────────────

describe('diff', () => {
  it('identical texts → all same', () => {
    const lines = diff('hello\nworld', 'hello\nworld');
    expect(lines.every((l) => l.type === 'same')).toBe(true);
    expect(lines).toHaveLength(2);
  });

  it('added line', () => {
    const lines = diff('hello', 'hello\nworld');
    expect(lines.some((l) => l.type === 'add' && l.text === 'world')).toBe(true);
  });

  it('removed line', () => {
    const lines = diff('hello\nworld', 'hello');
    expect(lines.some((l) => l.type === 'remove' && l.text === 'world')).toBe(true);
  });

  it('completely different texts', () => {
    const lines = diff('foo', 'bar');
    expect(lines.some((l) => l.type === 'remove')).toBe(true);
    expect(lines.some((l) => l.type === 'add')).toBe(true);
  });

  it('empty → non-empty', () => {
    const lines = diff('', 'hello');
    expect(lines.some((l) => l.type === 'add')).toBe(true);
  });

  it('assigns correct line numbers', () => {
    const lines = diff('a\nb\nc', 'a\nb\nc');
    expect(lines[0].lineA).toBe(1);
    expect(lines[2].lineA).toBe(3);
  });
});

// ─── Token Estimator ──────────────────────────────────────────────────────────

describe('estimateTokens', () => {
  it('empty string → 0', () => expect(estimateTokens('')).toBe(0));
  it('4 chars → 1 token', () => expect(estimateTokens('test')).toBe(1));
  it('5 chars → 2 tokens (ceil)', () => expect(estimateTokens('tests')).toBe(2));
  it('100 chars → 25 tokens', () => expect(estimateTokens('a'.repeat(100))).toBe(25));
});

// ─── Word Counter ─────────────────────────────────────────────────────────────

describe('countStats', () => {
  it('empty string', () => {
    const s = countStats('');
    expect(s.words).toBe(0);
    expect(s.chars).toBe(0);
    expect(s.lines).toBe(0);
  });

  it('word count', () => {
    expect(countStats('hello world foo').words).toBe(3);
  });

  it('char count includes spaces', () => {
    expect(countStats('hello world').chars).toBe(11);
  });

  it('chars no space excludes spaces', () => {
    expect(countStats('hello world').charsNoSpace).toBe(10);
  });

  it('line count', () => {
    expect(countStats('line1\nline2\nline3').lines).toBe(3);
  });

  it('sentence count', () => {
    expect(countStats('Hello world. How are you? Fine!').sentences).toBe(3);
  });

  it('paragraph count', () => {
    expect(countStats('Para 1.\n\nPara 2.').paragraphs).toBe(2);
  });

  it('reading time minimum is 1', () => {
    expect(countStats('hello').readingMinutes).toBe(1);
  });

  it('reading time for 200 words is 1 min', () => {
    const text = Array(200).fill('word').join(' ');
    expect(countStats(text).readingMinutes).toBe(1);
  });

  it('reading time for 400 words is 2 min', () => {
    const text = Array(400).fill('word').join(' ');
    expect(countStats(text).readingMinutes).toBe(2);
  });
});

// ─── MD5 Hash ─────────────────────────────────────────────────────────────────

describe('md5', () => {
  it('empty string', () => {
    expect(md5('')).toBe('d41d8cd98f00b204e9800998ecf8427e');
  });

  it('"hello"', () => {
    expect(md5('hello')).toBe('5d41402abc4b2a76b9719d911017c592');
  });

  it('"Hello, World!"', () => {
    expect(md5('Hello, World!')).toBe('65a8e27d8879283831b664bd8b7f0ad4');
  });

  it('produces 32-char hex string', () => {
    expect(md5('test')).toMatch(/^[0-9a-f]{32}$/);
  });

  it('is deterministic', () => {
    expect(md5('foo')).toBe(md5('foo'));
  });

  it('different inputs produce different hashes', () => {
    expect(md5('foo')).not.toBe(md5('bar'));
  });
});

// ─── UUID Generator ───────────────────────────────────────────────────────────

describe('generateV4', () => {
  it('produces a valid v4 UUID format', () => {
    const uuid = generateV4();
    expect(uuid).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
  });

  it('version digit is 4', () => {
    const uuid = generateV4();
    expect(uuid[14]).toBe('4');
  });

  it('variant digit is 8, 9, a, or b', () => {
    const uuid = generateV4();
    expect(['8', '9', 'a', 'b']).toContain(uuid[19]);
  });

  it('generates unique UUIDs', () => {
    const uuids = new Set(Array.from({ length: 100 }, generateV4));
    expect(uuids.size).toBe(100);
  });
});

// ─── Markdown (marked) ────────────────────────────────────────────────────────
// These tests catch marked API changes (e.g. v18 changed call signature)

describe('parseMarkdown', () => {
  it('returns a string, not a Promise', () => {
    const result = parseMarkdown('# Hello');
    expect(typeof result).toBe('string');
  });
  it('renders heading', () => {
    expect(parseMarkdown('# Hello')).toContain('<h1>');
  });
  it('renders bold', () => {
    expect(parseMarkdown('**bold**')).toContain('<strong>');
  });
  it('renders inline code', () => {
    expect(parseMarkdown('`code`')).toContain('<code>');
  });
  it('renders fenced code block', () => {
    expect(parseMarkdown('```js\nconst x = 1;\n```')).toContain('<code');
  });
  it('renders link', () => {
    expect(parseMarkdown('[text](https://example.com)')).toContain('<a ');
  });
});

// ─── YAML (js-yaml) ───────────────────────────────────────────────────────────

describe('parseYaml', () => {
  it('parses simple key-value', () => {
    expect(parseYaml('name: John\nage: 30')).toEqual({ name: 'John', age: 30 });
  });
  it('parses nested objects', () => {
    expect(parseYaml('a:\n  b: 1')).toEqual({ a: { b: 1 } });
  });
  it('parses arrays', () => {
    expect(parseYaml('- a\n- b')).toEqual(['a', 'b']);
  });
  it('throws on invalid YAML', () => {
    expect(() => parseYaml('{')).toThrow();
  });
});

describe('dumpYaml', () => {
  it('dumps object to YAML string', () => {
    const result = dumpYaml({ name: 'John', age: 30 });
    expect(result).toContain('name: John');
    expect(result).toContain('age: 30');
  });
  it('round-trips through parseYaml', () => {
    const obj = { a: 1, b: [1, 2, 3], c: { d: true } };
    expect(parseYaml(dumpYaml(obj))).toEqual(obj);
  });
});

// ─── HTML Beautify (js-beautify) ──────────────────────────────────────────────

describe('formatHtml', () => {
  it('returns a string', () => {
    expect(typeof formatHtml('<div><p>hi</p></div>')).toBe('string');
  });
  it('adds indentation', () => {
    const result = formatHtml('<div><p>hi</p></div>');
    expect(result).toContain('\n');
  });
  it('respects indent size', () => {
    const r2 = formatHtml('<div><p>hi</p></div>', 2);
    const r4 = formatHtml('<div><p>hi</p></div>', 4);
    expect(r2).not.toBe(r4);
  });
});
