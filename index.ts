/**
 * pi-command-palette - Full command picker
 */

import type { ExtensionAPI } from "@mariozechner/pi-coding-agent";
import { Container, Text, Input } from "@mariozechner/pi-tui";
import { DynamicBorder } from "@mariozechner/pi-coding-agent";

// Minimal SelectList implementation
class SimpleSelectList {
	items: any[];
	selectedIndex: number;
	maxVisible: number;
	onSelect?: (item: any) => void;
	
	constructor(items: any[], maxVisible: number) {
		this.items = items;
		this.selectedIndex = 0;
		this.maxVisible = maxVisible;
	}
	
	setFilter(query: string) {
		const q = query.toLowerCase();
		this.items = this.items.filter((item: any) => 
			item.label.toLowerCase().includes(q)
		);
		this.selectedIndex = 0;
	}
	
	renderLines(width: number, theme: any): string[] {
		const lines: string[] = [];
		const start = Math.max(0, this.selectedIndex - Math.floor(this.maxVisible / 2));
		const end = Math.min(this.items.length, start + this.maxVisible);
		
		for (let i = start; i < end; i++) {
			const item = this.items[i];
			const isSelected = i === this.selectedIndex;
			const prefix = isSelected ? "→ " : "  ";
			const label = item.label.substring(0, 20);
			const desc = item.description ? ` - ${item.description.substring(0, width - 30)}` : "";
			const line = prefix + label + desc;
			lines.push(isSelected ? theme.fg("accent", line) : theme.fg("text", line));
		}
		
		if (this.items.length === 0) {
			lines.push(theme.fg("warning", "  No commands found"));
		}
		
		return lines;
	}
}

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
			
			const items = commands.map((c) => ({
				value: c.name,
				label: c.name,
				description: c.description,
			}));
			
			await ctx.ui.custom<void>((tui, theme, _kb, done) => {
				const selectList = new SimpleSelectList([...items], 10);
				let searchQuery = "";
				
				const searchInput = new Input();
				searchInput.placeholder = "Search commands...";
				const origHandleInput = searchInput.handleInput.bind(searchInput);
				searchInput.handleInput = (data: string) => {
					const result = origHandleInput(data);
					if (data !== "enter" && data !== "escape") {
						searchQuery = searchInput.value;
						selectList.setFilter(searchQuery);
						tui.requestRender();
					}
					return result;
				};
				
				const container = new Container();
				container.addChild(new DynamicBorder((s: string) => theme.fg("accent", s)));
				container.addChild(new Text(theme.fg("accent", theme.bold("  Command Palette  ")), 1, 0));
				container.addChild(searchInput);
				container.addChild(new Text(theme.fg("dim", "  " + "─".repeat(40)), 1, 0));
				container.addChild({
					render: (w: number) => selectList.renderLines(w, theme),
				});
				container.addChild(new Text(theme.fg("dim", "  ↑↓ navigate · enter select · esc close  "), 1, 0));
				container.addChild(new DynamicBorder((s: string) => theme.fg("accent", s)));
				
				searchInput.focused = true;
				
				return {
					render: (w: number) => container.render(w),
					invalidate: () => container.invalidate(),
					handleInput: (data: string) => {
						if (data.length === 1 && data.charCodeAt(0) >= 32) {
							searchInput.handleInput(data);
							searchQuery = searchInput.value;
							selectList.setFilter(searchQuery);
							tui.requestRender();
							return;
						}
						if (data === "up") {
							selectList.selectedIndex = Math.max(0, selectList.selectedIndex - 1);
							tui.requestRender();
							return;
						}
						if (data === "down") {
							selectList.selectedIndex = Math.min(selectList.items.length - 1, selectList.selectedIndex + 1);
							tui.requestRender();
							return;
						}
						if (data === "enter") {
							const item = selectList.items[selectList.selectedIndex];
							if (item) {
								done(undefined);
								pi.sendUserMessage(`/${item.value}`);
							}
							return;
						}
						if (data === "escape") {
							done(undefined);
							return;
						}
						if (data === "backspace") {
							searchInput.handleInput(data);
							searchQuery = searchInput.value;
							selectList.setFilter(searchQuery);
							tui.requestRender();
							return;
						}
					},
				};
			}, { overlay: true });
		},
	});
}
