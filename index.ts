/**
 * pi-command-palette - Full command picker
 */

import type { ExtensionAPI } from "@mariozechner/pi-coding-agent";
import { Container, Text, Input } from "@mariozechner/pi-tui";
import { DynamicBorder } from "@mariozechner/pi-coding-agent";

export default function (pi: ExtensionAPI) {
	pi.registerShortcut("ctrl+p", {
		description: "Open command palette",
		handler: async (ctx) => {
			const commands = [
				{ name: "agent", description: "Switch to a different agent profile" },
				{ name: "agents", description: "List all available agent profiles" },
				{ name: "todos", description: "Show completion stats and todo list" },
				{ name: "todos clear", description: "Clear all todos" },
				{ name: "reload", description: "Reload extensions and settings" },
				{ name: "compact", description: "Compact the session" },
				{ name: "model", description: "Select a different model" },
				{ name: "thinking", description: "Set thinking level" },
				{ name: "theme", description: "Switch theme" },
				{ name: "clear", description: "Clear the editor" },
				{ name: "exit", description: "Exit the session" },
				{ name: "fork", description: "Fork from current point" },
				{ name: "tree", description: "Show session tree" },
				{ name: "abort", description: "Abort current operation" },
			];
			
			const allItems = commands.map((c) => ({
				value: c.name,
				label: c.name,
				description: c.description,
			}));
			
			await ctx.ui.custom<void>((tui, theme, kb, done) => {
				let filteredItems = [...allItems];
				let selectedIndex = 0;
				let searchQuery = "";
				
				const filterItems = (query: string) => {
					const q = query.toLowerCase();
					filteredItems = allItems.filter((item) => 
						item.label.toLowerCase().includes(q) ||
						item.description.toLowerCase().includes(q)
					);
					selectedIndex = 0;
				};
				
				const searchInput = new Input();
				searchInput.placeholder = "Search commands...";
				const origHandleInput = searchInput.handleInput.bind(searchInput);
				searchInput.handleInput = (data: string) => {
					origHandleInput(data);
					searchQuery = searchInput.value;
					filterItems(searchQuery);
					tui.requestRender();
				};
				
				const container = new Container();
				container.addChild(new DynamicBorder((s: string) => theme.fg("accent", s)));
				container.addChild(new Text(theme.fg("accent", theme.bold("  Command Palette  ")), 1, 0));
				container.addChild(searchInput);
				container.addChild(new Text(theme.fg("dim", "  " + "─".repeat(40)), 1, 0));
				
				// List component
				const listComponent = {
					render: (w: number) => {
						const lines: string[] = [];
						const maxVisible = 10;
						const start = Math.max(0, selectedIndex - Math.floor(maxVisible / 2));
						const end = Math.min(filteredItems.length, start + maxVisible);
						
						for (let i = start; i < end; i++) {
							const item = filteredItems[i];
							const isSelected = i === selectedIndex;
							const prefix = isSelected ? "→ " : "  ";
							const label = item.label.substring(0, 20);
							const desc = item.description ? ` - ${item.description.substring(0, Math.max(10, w - 30))}` : "";
							const line = prefix + label + desc;
							lines.push(isSelected ? theme.fg("accent", line) : theme.fg("text", line));
						}
						
						if (filteredItems.length === 0) {
							lines.push(theme.fg("warning", "  No commands found"));
						}
						
						return lines;
					},
				};
				
				container.addChild(listComponent);
				container.addChild(new Text(theme.fg("dim", "  ↑↓ navigate · enter select · esc close  "), 1, 0));
				container.addChild(new DynamicBorder((s: string) => theme.fg("accent", s)));
				
				searchInput.focused = true;
				
				return {
					render: (w: number) => container.render(w),
					invalidate: () => container.invalidate(),
					handleInput: (data: string) => {
						// ESC to close - use kb.matches for proper keybinding check
						if (kb.matches(data, "tui.select.cancel") || data === "escape") {
							done(undefined);
							return;
						}
						
						// Arrow up
						if (kb.matches(data, "tui.select.up") || data === "up" || data === "k") {
							selectedIndex = Math.max(0, selectedIndex - 1);
							tui.requestRender();
							return;
						}
						
						// Arrow down
						if (kb.matches(data, "tui.select.down") || data === "down" || data === "j") {
							selectedIndex = Math.min(filteredItems.length - 1, selectedIndex + 1);
							tui.requestRender();
							return;
						}
						
						// Enter to select
						if (kb.matches(data, "tui.select.confirm") || data === "enter") {
							const item = filteredItems[selectedIndex];
							if (item) {
								done(undefined);
								pi.sendUserMessage(`/${item.value}`);
							}
							return;
						}
						
						// Printable chars go to search
						if (data.length === 1 && data.charCodeAt(0) >= 32) {
							searchInput.handleInput(data);
							searchQuery = searchInput.value;
							filterItems(searchQuery);
							tui.requestRender();
							return;
						}
						
						// Backspace
						if (data === "backspace") {
							searchInput.handleInput(data);
							searchQuery = searchInput.value;
							filterItems(searchQuery);
							tui.requestRender();
							return;
						}
					},
				};
			}, { overlay: true });
		},
	});
}
