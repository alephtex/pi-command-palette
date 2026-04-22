/**
 * pi-command-palette
 * 
 * Opens a floating command palette via Ctrl+P shortcut.
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
import { Container, Text, Input, SelectList, DynamicBorder, type SelectItem } from "@mariozechner/pi-tui";

export default function (pi: ExtensionAPI) {
	pi.registerShortcut("ctrl+p", {
		description: "Open command palette",
		handler: async (ctx) => {
			// Get available commands
			const commands = ctx.getCommands();
			
			await ctx.ui.custom<void>((tui, theme, _kb, done) => {
				const MAX_VISIBLE = 12;
				let selectedIndex = 0;
				let searchQuery = "";
				
				// Build command items
				const buildItems = (query: string): SelectItem[] => {
					const q = query.toLowerCase();
					return commands
						.filter((c) => !q || c.name.toLowerCase().includes(q))
						.slice(0, 30)
						.map((c) => ({
							value: c.name,
							label: c.name,
							description: c.description || "",
						}));
				};
				
				let items = buildItems(searchQuery);
				
				// Container
				const container = new Container();
				
				// Top border
				container.addChild(new DynamicBorder((s: string) => theme.fg("accent", s)));
				
				// Title
				container.addChild(
					new Text(theme.fg("accent", theme.bold("  Commands  ")), 1, 0),
				);
				
				// Search input
				const searchInput = new Input();
				searchInput.placeholder = "Search commands...";
				const origHandleInput = searchInput.handleInput.bind(searchInput);
				searchInput.handleInput = (data: string) => {
					const result = origHandleInput(data);
					if (data !== "enter" && data !== "escape") {
						searchQuery = searchInput.value;
						items = buildItems(searchQuery);
						selectedIndex = Math.min(selectedIndex, Math.max(0, items.length - 1));
						tui.requestRender();
					}
					return result;
				};
				container.addChild(searchInput);
				
				// Divider
				container.addChild(new Text(theme.fg("dim", "  " + "─".repeat(30)), 1, 0));
				
				// Command list
				const selectList = new SelectList(items, Math.min(items.length, MAX_VISIBLE), {
					selectedPrefix: (t) => theme.fg("accent", t),
					selectedText: (t) => theme.fg("accent", t),
					description: (t) => theme.fg("muted", t),
					scrollInfo: (t) => theme.fg("dim", t),
					noMatch: (t) => theme.fg("warning", t),
				});
				
				// Select command on Enter
				selectList.onSelect = (item) => {
					const cmdName = item.value as string;
					done(undefined);
					// Execute command
					ctx.sendUserMessage(`/${cmdName}`);
				};
				
				container.addChild(selectList);
				
				// Bottom hint
				container.addChild(new Text(theme.fg("dim", "  ↑↓ navigate · type to filter · enter select · esc close  "), 1, 0));
				container.addChild(new DynamicBorder((s: string) => theme.fg("accent", s)));
				
				// Focus search
				searchInput.focused = true;
				
				return {
					render: (w: number) => container.render(w),
					invalidate: () => container.invalidate(),
					handleInput: (data: string) => {
						// Printable chars → search input
						if (data.length === 1 && data.charCodeAt(0) >= 32) {
							if (searchInput.handleInput(data)) {
								searchQuery = searchInput.value;
								items = buildItems(searchQuery);
								selectedIndex = Math.min(selectedIndex, Math.max(0, items.length - 1));
								tui.requestRender();
							}
							return;
						}
						
						// Arrow up
						if (data === "up" || data === "shift+tab") {
							selectedIndex = Math.max(0, selectedIndex - 1);
							selectList.selectedIndex = selectedIndex;
							tui.requestRender();
							return;
						}
						
						// Arrow down
						if (data === "down" || data === "tab") {
							selectedIndex = Math.min(items.length - 1, selectedIndex + 1);
							selectList.selectedIndex = selectedIndex;
							tui.requestRender();
							return;
						}
						
						// Enter → select current
						if (data === "enter") {
							if (items.length > 0 && items[selectedIndex]) {
								const cmdName = items[selectedIndex].value as string;
								done(undefined);
								ctx.sendUserMessage(`/${cmdName}`);
							}
							return;
						}
						
						// Escape → close
						if (data === "escape") {
							done(undefined);
							return;
						}
						
						// Backspace → search
						if (data === "backspace") {
							searchInput.handleInput(data);
							searchQuery = searchInput.value;
							items = buildItems(searchQuery);
							tui.requestRender();
							return;
						}
						
						// Tab → pass to select list
						selectList.handleInput(data);
						tui.requestRender();
					},
				};
			}, { overlay: true });
		},
	});
}
