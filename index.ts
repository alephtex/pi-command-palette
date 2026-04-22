/**
 * pi-command-palette - Simple version using ctx.ui.select
 */

import type { ExtensionAPI } from "@mariozechner/pi-coding-agent";

export default function (pi: ExtensionAPI) {
	pi.registerShortcut("ctrl+p", {
		description: "Open command palette",
		handler: async (ctx) => {
			const commands = ctx.getCommands();
			const names = commands.map((c) => c.name);
			
			const selected = await ctx.ui.select("Command Palette", names);
			
			if (selected) {
				ctx.sendUserMessage(`/${selected}`);
			}
		},
	});
}
