import type { Token } from "marked";
import { lexer } from "marked";
import fs from "fs-extra";

export type Meta = { regexPattern: string } & Record<
  number,
  {
    title: string;
    createdAt: number;
    updatedAt: number;
    hash: string;
  }
>;

export const metaPath = "./meta.json";

export function getMeta() {
  fs.ensureFileSync(metaPath);
  return fs.openSync(metaPath, "r+");
}

export function withMeta<T>(func: (metaFile: number) => T): T {
  const metaFile = getMeta();
  const res = func(metaFile);
  fs.closeSync(metaFile);
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
  const a = fs.readdirSync("./");
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
