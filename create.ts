import { getMDIndexs, withMeta } from "./utils";
import fs from "fs-extra";

const reg = "^((?!0\\d)\\d+)\\.md";

function main() {
  const regex = withMeta((metaFile) => {
    const meta = JSON.parse(fs.readFileSync(metaFile).toString() || "{}") || {};
    console.log(meta);
    return new RegExp(meta.regexPattern);
  });

  const map = getMDIndexs(regex);
  const max = Math.max(...map.map((v) => parseInt(v)));
  fs.writeFileSync(`${max + 1}.md`, "");
}

main();
