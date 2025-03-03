#!/usr/bin/env bun

import atImport from "postcss-import"
import postcss from "postcss"
import minifyCss from "@3-/svelte-com/minifyCss.js"
import { walkRel } from "@3-/walk"
import { dirname, join } from "node:path"
import { writeFileSync } from "node:fs"
import read from "@3-/read"

const ROOT = dirname(import.meta.dirname),
	DIST = join(ROOT, "dist"),
	DIR_DOM = join(DIST, "dom"),
	DIR_CSS = join(ROOT, "css")

process.chdir(DIR_CSS)

const write = (fname, css, to) => {
	writeFileSync(to, minifyCss(css, fname, true).code.toString())
}

for await (const i of walkRel(DIR_DOM)) {
	if (i.endsWith(".css")) {
		console.log("dom/" + i)
		const fp = join(DIR_DOM, i)
		write(i, read(fp), fp)
	}
}

const THEME = "_.css",
	THEME_CSS =
		"@layer {" +
		(
			await postcss()
				.use(atImport())
				.process(read(THEME).replace(/\s*layer\s*;/g, ";"), {
					from: THEME,
				})
		).css +
		"}"

// for await (const i of walkRel(DIR_CSS, (i) => i.startsWith("."))) {
// 	if (i.endsWith(".css")) {
// 		const fp = join(DIR_CSS, i)
// 		if (i == THEME || i.startsWith("theme/")) {
// 			continue
// 		}
// 		console.log(i)
// 		const css = read(fp)
// 		merge.push(css)
// 		write(i, css, join(DIST, i))
// 	}
// }
//
// const MERGE_CSS = merge.join("\n")

Object.entries({
	_: THEME_CSS,
}).forEach(([name, css]) => {
	name = name + ".css"
	write(name, css, join(DIST, name))
})

process.exit()
