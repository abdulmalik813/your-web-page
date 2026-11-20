import type { Newsletter } from '@/payload-types';

interface NewsletterSection {
  heading?: string;
  paragraphs?: string[];
  bullets?: string[];
}

type LexicalNode = Newsletter['content']['root']['children'][number];
type LexicalTextNode = Extract<LexicalNode, { type: 'text' }>;
type LexicalParagraphNode = Extract<LexicalNode, { type: 'paragraph' }>;
type LexicalHeadingNode = Extract<LexicalNode, { type: 'heading' }>;
type LexicalListNode = Extract<LexicalNode, { type: 'list' }>;
type LexicalListItemNode = Extract<LexicalNode, { type: 'listitem' }>;

function lexicalText(text: string): LexicalTextNode {
  return { type: 'text', text, format: 0, style: '', mode: 'normal', detail: 0, version: 1 };
}

function lexicalParagraph(...children: LexicalNode[]): LexicalParagraphNode {
  return { type: 'paragraph', format: '', indent: 0, version: 1, direction: 'ltr', textStyle: '', textFormat: 0, children };
}

function lexicalHeading(tag: 'h2' | 'h3' | 'h4', text: string): LexicalHeadingNode {
  return { type: 'heading', tag, format: '', indent: 0, version: 1, direction: 'ltr', children: [lexicalText(text)] };
}

function lexicalBulletList(items: string[]): LexicalListNode {
  return {
    type: 'list',
    listType: 'bullet',
    tag: 'ul',
    format: '',
    indent: 0,
    version: 1,
    start: 1,
    direction: 'ltr',
    children: items.map((text, i): LexicalListItemNode => ({
      type: 'listitem',
      value: i + 1,
      format: '',
      indent: 0,
      version: 1,
      direction: 'ltr',
      children: [lexicalText(text)],
    })),
  };
}

export function sectionsToLexical(sections: NewsletterSection[]): Newsletter['content'] {
  const children: LexicalNode[] = sections.flatMap((section) => {
    const nodes: LexicalNode[] = [];
    if (section.heading) nodes.push(lexicalHeading('h2', section.heading));
    for (const para of section.paragraphs ?? []) nodes.push(lexicalParagraph(lexicalText(para)));
    if (section.bullets?.length) nodes.push(lexicalBulletList(section.bullets));
    return nodes;
  });
  // Always have at least one paragraph so Lexical doesn't reject an empty root
  if (!children.length) children.push(lexicalParagraph(lexicalText('')));
  return {
    root: {
      type: 'root',
      format: '',
      indent: 0,
      version: 1,
      direction: 'ltr',
      children,
    },
  };
}
