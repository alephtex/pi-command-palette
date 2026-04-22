/**
 * pi-command-palette
 * 
 * Opens the slash command menu (same as typing "/") via Ctrl+P shortcut.
 * Overrides the default Ctrl+P model cycling behavior.
 * 
 * Usage:
 * - Press Ctrl+P to open command palette
 */

import type { ExtensionAPI } from "@mariozechner/pi-coding-agent";

export default function (pi: ExtensionAPI) {
	// Intercept Ctrl+P before the app processes it (model cycling)
	// Raw Ctrl+P is "\x10" (ASCII 16)
	pi.ui.onTerminalInput((data: string) => {
		// Check for Ctrl+P (raw: "\x10" in legacy terminals, "ctrl+p" in Kitty protocol)
		if (data === "\x10" || data === "ctrl+p") {
			// Override: open command palette instead of cycling models
			pi.sendUserMessage("/");
			return { consume: true };
		}
		// Don't consume other inputs
		return undefined;
	});
}
