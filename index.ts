/**
 * pi-command-palette - Simple version
 */

import type { ExtensionAPI } from "@mariozechner/pi-coding-agent";

export default function (pi: ExtensionAPI) {
	pi.registerShortcut("ctrl+p", {
		description: "Open command palette",
		handler: async (ctx) => {
			// Just send "/" to trigger the built-in slash command autocomplete
			ctx.sendUserMessage("/");
		},
	});
}
