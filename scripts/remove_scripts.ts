import fs from "fs-extra";
import path from "path";
import { BLOG_PATH, ROOT_PATH } from "./utils";

function rmStuff(patterns: string[], cwd: string) {
  const l: string[] = (() => {
    const ls: string[] = [];
    const pps = patterns.map((v) => globFiles(v, cwd));
    pps.forEach((v) => ls.push(...v));
    return ls;
  })();
  l.forEach((v) => {
    fs.rm(path.join(cwd, v));
  });
}

function globFiles(pattern: string, cwd?: string) {
  const a = new Bun.Glob(pattern);
  const res = a.scanSync({ cwd, dot: true, onlyFiles: false });
  const l: string[] = [];
  let r = res.next();
  while (!r.done) {
    if (r.value) {
      l.push(r.value);
    }
    r = res.next();
  }
  return l;
}

function onlyPreserve(patterns: string[], cwd: string) {
  const all = fs.readdirSync(cwd);
  const preserve: string[] = (() => {
    const ls: string[] = [];
    const pps = patterns.map((v) => globFiles(v, cwd));
    pps.forEach((v) => ls.push(...v));
    return ls;
  })();
  const remove = all
    .map((v) => (preserve.indexOf(v) === -1 ? v : undefined))
    .filter((v) => v);
  console.log(preserve, remove);
  remove.forEach((v) => {
    fs.removeSync(path.join(cwd, v));
  });
}

function minifyMeta() {
  const metaPath = path.join(BLOG_PATH, "meta.json");
  fs.writeFileSync(
    metaPath,
    JSON.stringify(
      JSON.parse(fs.readFileSync(path.join(BLOG_PATH, "meta.json")).toString()),
    ),
  );
}

onlyPreserve(["blogs"], ROOT_PATH);
onlyPreserve(["*.md", "meta.json"], BLOG_PATH);
minifyMeta();
