import type { Token } from "marked";
import { lexer } from "marked";
import fs from "fs-extra";
import path from "path";

export const ROOT_PATH = path.dirname(path.dirname(import.meta.path));
export const BLOG_PATH = path.join(ROOT_PATH, "blogs/");

export type Meta = { regexPattern: string } & Record<
  number,
  {
    title: string;
    createdAt: number;
    updatedAt: number;
    hash: string;
  }
>;

export const META_PATH = path.join(BLOG_PATH, "meta.json");

export function getMeta() {
  fs.ensureFileSync(META_PATH);
  return fs.openSync(META_PATH, "r+");
}

export function withMeta<T>(func: (metaFile: number) => T): T {
  const metaFile = getMeta();
  const res = func(metaFile);
  fs.closeSync(metaFile);
  return res;
}

export function withBlog<T>(
  func: (blogFile: number) => T,
  blogKey: number | string,
): T {
  const blogFile = fs.openSync(path.join(BLOG_PATH, `${blogKey}.md`), "r+");
  const res = func(blogFile);
  fs.closeSync(blogFile);
  return res;
}

export function getText(tokens: Token[]): string {
  for (let i = 0; i < tokens.length; i++)
    if (tokens[i].type === "text") return (tokens[i] as any).text;
}

export function getTitle(src: string) {
  const tokens = lexer(src);
  const headings: Record<number, string> = {};
  for (let i = 0; i < tokens.length; i++) {
    const l = tokens[i];
    let text: string;
    l.type === "heading" &&
      headings[l.depth] === undefined &&
      l.tokens &&
      l.tokens.length > 0 &&
      (text = getText(l.tokens)) &&
      (headings[l.depth] = text);
  }
  return headings[Math.min(...Object.keys(headings).map((v) => parseInt(v)))];
}

export function getMDIndexs(pattern: RegExp) {
  const a = fs.readdirSync(BLOG_PATH);
  const map: string[] = [];
  for (let i = 0; i < a.length; i++) {
    const f = a[i];
    if (fs.statSync(f).isDirectory()) continue;
    else {
      const rg = pattern;
      const res = rg.exec(f);
      if (res && res.length > 0) {
        map.push(res[1]);
      }
    }
  }
  return map;
}
