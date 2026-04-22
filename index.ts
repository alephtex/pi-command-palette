/**
 * pi-command-palette
 * 
 * Opens the slash command menu (same as typing "/") via Ctrl+P shortcut.
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

export default function (pi: ExtensionAPI) {
	pi.registerShortcut("ctrl+p", {
		description: "Open command palette (same as typing /)",
		handler: async (ctx) => {
			// Insert "/" character by character to trigger slash command autocomplete
			// Using handleInput directly (not paste mode) so autocomplete triggers
			ctx.ui.pasteToEditor("/");
			// Small delay then trigger autocomplete explicitly
			setTimeout(() => {
				// Try to trigger autocomplete by simulating Tab which triggers completion
				ctx.ui.pasteToEditor("\t");
			}, 50);
		},
	});
}
