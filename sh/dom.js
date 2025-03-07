#!/usr/bin/env bun

import { walkRel } from "@3-/walk"
import { dirname, join } from "node:path"
import { existsSync, renameSync } from "node:fs"
import css2mod from "@3-/css2js/css2mod.js"
import write from "@3-/write"
import read from "@3-/read"

const LI = process.argv.slice(2),
	ROOT = dirname(import.meta.dirname),
	DIST = join(ROOT, "dist"),
	HEAD = 'import {Style} from "-/dom/_.js"\n',
	DIR_DOM = join(DIST, "dom"),
	DIR_STYLE = join(DIST, "css"),
	modify = (name) => {
		const js = name + ".js",
			jsfp = join(DIR_DOM, js),
			css = name + ".css",
			code = read(jsfp)

		write(join(DIR_STYLE, js), css2mod(read(join(DIR_DOM, css))))
		if (code.startsWith(HEAD)) {
			console.log(css)
		} else {
			console.log(js)
			write(jsfp, HEAD + code + `\nawait Style(${JSON.stringify(name)})`)
		}
	}

if (LI.length) {
	const set = new Set(),
		ext_li = ["css", "js"]
	for (const i of LI) {
		let n = 1
		for (const ext of ext_li) {
			if (i.endsWith("." + ext)) {
				const fp = i.slice(0, -ext.length - 1),
					name = fp.slice(9)
				if (existsSync(join(ROOT, fp + "." + ext_li[n]))) {
					if (!set.has(name)) {
						modify(name)
						set.add(name)
					}
				}
			}
			--n
		}
	}
} else {
	await (async () => {
		for await (const i of walkRel(DIR_DOM)) {
			if (i.endsWith(".css")) {
				const name = i.slice(0, -4)
				if (existsSync(join(DIR_DOM, name + ".js"))) {
					modify(name)
				}
			}
		}
	})()
}

process.exit()
