import { defineConfig } from "vite"
import Conf from "@3-/svelte-com"
import merge from "lodash-es/merge.js"

const conf = await Conf(import.meta.dirname)

export default defineConfig(
	merge(conf, {
		define: {
			// __SRV__: JSON.stringify(process.env.__SRV__),
		},
		build: {
			rollupOptions: {
				external: [/^-\/.+/],
			},
		},
	}),
)
