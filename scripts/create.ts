import { getMDIndexs, BLOG_PATH } from "./utils";
import fs from "fs-extra";
import path from "path";

function main() {
  // const regex = withMeta((metaFile) => {
  //   const meta = JSON.parse(fs.readFileSync(metaFile).toString() || "{}") || {};
  //   console.log(meta);
  //   return new RegExp(meta.regexPattern);
  // });
  // const map = getMDIndexs(regex);

  const map = getMDIndexs();
  const max = Math.max(...map.map((v) => parseInt(v)));
  fs.writeFileSync(path.join(BLOG_PATH, `${max + 1}.md`), "");
}

main();
