const {rmSync} = require("node:fs");
const {resolve} = require("node:path");

// Resolve only these build outputs relative to the repository, never the caller's cwd.
for (const directory of ["lib", "lib-cjs"]) {
   rmSync(resolve(__dirname, "..", directory), {recursive: true, force: true});
}
