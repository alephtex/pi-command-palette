/**
 * pi-command-palette
 * 
 * Opens the slash command menu via Ctrl+P shortcut.
 * Uses ctx.ui.custom() to build a simple command picker.
 * 
 * Requires keybindings.json to rebind built-in shortcuts to free Ctrl+P:
 * {
 *   "app.model.cycleForward": ["shift+ctrl+p"],
 *   "app.models.toggleProvider": ["ctrl+shift+p"],
 *   "app.session.togglePath": ["ctrl+alt+p"]
 * }
 * 
 * Usage:
 * - Press Ctrl+P to open command palette
 */

import type { ExtensionAPI } from "@mariozechner/pi-coding-agent";
import { Container, Text, DynamicBorder } from "@mariozechner/pi-tui";

export default function (pi: ExtensionAPI) {
	pi.registerShortcut("ctrl+p", {
		description: "Open command palette",
		handler: async (ctx) => {
			// Get available slash commands
			const commands = ctx.getCommands();
			
			// Build simple command list
			const commandNames = commands.map((c) => c.name);
			
			// Show command selector
			const selected = await ctx.ui.select("Commands", commandNames);
			
			if (selected) {
				// User selected a command - send it
				ctx.sendUserMessage(`/${selected}`);
			}
		},
	});
}
