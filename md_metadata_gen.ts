import fs from "fs-extra";
import { lexer } from "marked";
import type { Token } from "marked";

function getText(tokens: Token[]): string {
  for (let i = 0; i < tokens.length; i++)
    if (tokens[i].type === "text") return (tokens[i] as any).text;
}

function getTitle(src: string) {
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

type Meta = Record<
  string,
  {
    title: string;
    createdAt: number;
    updatedAt: number;
    hash: string;
  }
>;

export function getMDIndexs() {
  const a = fs.readdirSync("./");
  const map: string[] = [];
  for (let i = 0; i < a.length; i++) {
    const f = a[i];
    if (fs.statSync(f).isDirectory()) continue;
    else {
      const rg = /^((?!0\d)\d+)\.md/i;
      const res = rg.exec(f);
      if (res && res.length > 0) {
        map.push(res[1]);
      }
    }
  }
  return map;
}

function main() {
  const metaPath = "./meta.json";
  fs.ensureFile(metaPath);
  const meta: Meta =
    JSON.parse(fs.readFileSync(metaPath).toString() || "{}") || {};
  console.log(meta);
  const map = getMDIndexs();
  console.log(map);
  const newMeta: Meta = {};
  const currentTime = new Date().getTime();
  for (const key in map) {
    if (map.hasOwnProperty(key)) {
      const old = meta[key];
      const content = fs.readFileSync(`${key}.md`).toString();
      const title = getTitle(content);
      const hash = new Bun.CryptoHasher("sha256").update(content).digest("hex");
      if (!old) {
        newMeta[key] = {
          title: title ?? "Untitled",
          createdAt: currentTime,
          updatedAt: currentTime,
          hash,
        };
      } else {
        newMeta[key] = {
          title: title ?? old.title,
          createdAt: meta[key].createdAt ?? currentTime,
          updatedAt:
            hash === meta[key].hash ? meta[key].updatedAt : currentTime,
          hash,
        };
      }
    }
  }
  console.log(newMeta);
  fs.writeFileSync(metaPath, JSON.stringify(newMeta));
}

main();
