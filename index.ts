/**
 * pi-command-palette
 * 
 * Opens the slash command menu (same as typing "/") via Ctrl+P shortcut.
 * 
 * Requires keybindings.json to rebind app.model.cycleForward to free Ctrl+P:
 * {
 *   "app.model.cycleForward": ["shift+ctrl+p"]
 * }
 * 
 * Usage:
 * - Press Ctrl+P to open command palette
 */

import type { ExtensionAPI } from "@mariozechner/pi-coding-agent";

export default function (pi: ExtensionAPI) {
	pi.registerShortcut("ctrl+p", {
		description: "Open command palette (same as typing /)",
		handler: async (ctx) => {
			// Insert "/" into the editor which triggers slash command autocomplete
			ctx.ui.pasteToEditor("/");
		},
	});
}
