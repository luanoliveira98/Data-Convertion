import { addAliases } from "module-alias";
import * as path from "path";

const files = path.resolve(__dirname, "../..");

addAliases({
  "@src": path.join(files, "src"),
  "@test": path.join(files, "test"),
});
