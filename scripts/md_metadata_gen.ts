import fs from "fs-extra";
import { type Meta, getTitle, getMDIndexs, withMeta, withBlog } from "./utils";

function main() {
  const meta: Meta = withMeta((metaFile) => {
    return JSON.parse(fs.readFileSync(metaFile).toString() || "{}") || {};
  });
  console.log(meta);
  const map = getMDIndexs(new RegExp(meta.regexPattern));
  console.log(map);
  const newMeta: Meta = {
    regexPattern: meta.regexPattern,
  };
  const currentTime = new Date().getTime();
  for (const index in map) {
    if (map.hasOwnProperty(index)) {
      const key = map[index];
      const old = meta[key];
      const content = withBlog((f) => {
        return fs.readFileSync(f).toString();
      }, key);
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
  withMeta((metaFile) => {
    fs.writeFileSync(metaFile, JSON.stringify(newMeta));
  });
}

main();
