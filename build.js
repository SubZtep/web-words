require("esbuild")
  .build({
    entryPoints: ["src/background.ts", "src/content.ts", "src/popup.ts"],
    bundle: true,
    outdir: "dist",
    watch: process.argv.pop().split(require("path").sep).pop().includes("-w"),
  })
  .catch(() => process.exit(1))
