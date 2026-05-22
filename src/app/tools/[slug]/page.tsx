import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { TOOLS, getToolBySlug } from '@/lib/tools';
import ToolLayout from '@/components/ToolLayout';

import JsonFormatter from '@/components/tools/JsonFormatter';
import YamlFormatter from '@/components/tools/YamlFormatter';
import HtmlFormatter from '@/components/tools/HtmlFormatter';
import SqlFormatter from '@/components/tools/SqlFormatter';
import Base64 from '@/components/tools/Base64';
import UrlEncode from '@/components/tools/UrlEncode';
import HtmlEntities from '@/components/tools/HtmlEntities';
import JwtDecoder from '@/components/tools/JwtDecoder';
import HashGenerator from '@/components/tools/HashGenerator';
import ImageToBase64 from '@/components/tools/ImageToBase64';
import Timestamp from '@/components/tools/Timestamp';
import JsonToYaml from '@/components/tools/JsonToYaml';
import JsonToCsv from '@/components/tools/JsonToCsv';
import NumberBase from '@/components/tools/NumberBase';
import ColorConverter from '@/components/tools/ColorConverter';
import CaseConverter from '@/components/tools/CaseConverter';
import CurlToFetch from '@/components/tools/CurlToFetch';
import MarkdownPreview from '@/components/tools/MarkdownPreview';
import HtmlPreview from '@/components/tools/HtmlPreview';
import MermaidPreview from '@/components/tools/MermaidPreview';
import UuidGenerator from '@/components/tools/UuidGenerator';
import LoremIpsum from '@/components/tools/LoremIpsum';
import JsonSchema from '@/components/tools/JsonSchema';
import TextDiff from '@/components/tools/TextDiff';
import RegexTester from '@/components/tools/RegexTester';
import WordCounter from '@/components/tools/WordCounter';
import TokenEstimator from '@/components/tools/TokenEstimator';
import CronParser from '@/components/tools/CronParser';
import DotenvParser from '@/components/tools/DotenvParser';
import HttpStatus from '@/components/tools/HttpStatus';

const TOOL_COMPONENTS: Record<string, React.ComponentType> = {
  'json-formatter':   JsonFormatter,
  'yaml-formatter':   YamlFormatter,
  'html-formatter':   HtmlFormatter,
  'sql-formatter':    SqlFormatter,
  'base64':           Base64,
  'url-encode':       UrlEncode,
  'html-entities':    HtmlEntities,
  'jwt-decoder':      JwtDecoder,
  'hash-generator':   HashGenerator,
  'image-to-base64':  ImageToBase64,
  'timestamp':        Timestamp,
  'json-to-yaml':     JsonToYaml,
  'json-to-csv':      JsonToCsv,
  'number-base':      NumberBase,
  'color-converter':  ColorConverter,
  'case-converter':   CaseConverter,
  'curl-to-fetch':    CurlToFetch,
  'markdown-preview': MarkdownPreview,
  'html-preview':     HtmlPreview,
  'mermaid-preview':  MermaidPreview,
  'uuid-generator':   UuidGenerator,
  'lorem-ipsum':      LoremIpsum,
  'json-schema':      JsonSchema,
  'text-diff':        TextDiff,
  'regex-tester':     RegexTester,
  'word-counter':     WordCounter,
  'token-estimator':  TokenEstimator,
  'cron-parser':      CronParser,
  'dotenv-parser':    DotenvParser,
  'http-status':      HttpStatus,
};

export function generateStaticParams() {
  return TOOLS.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const tool = getToolBySlug(slug);
  if (!tool) return {};
  return {
    title: tool.name,
    description: tool.description,
    keywords: tool.keywords,
    alternates: { canonical: `/tools/${slug}` },
    openGraph: {
      title: `${tool.name} | DevKit`,
      description: tool.description,
      url: `/tools/${slug}`,
    },
  };
}

export default async function ToolPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tool = getToolBySlug(slug);
  if (!tool) notFound();

  const Component = TOOL_COMPONENTS[slug];
  if (!Component) notFound();

  return (
    <ToolLayout name={tool.name} description={tool.description}>
      <Component />
    </ToolLayout>
  );
}
