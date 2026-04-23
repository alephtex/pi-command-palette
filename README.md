[![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/steimerbyte)

> ⭐ If you find this useful, consider [supporting me on Ko-fi](https://ko-fi.com/steimerbyte)!

<img src="https://storage.ko-fi.com/cdn/generated/fhfuc7slzawvi/2026-04-23_rest-162bec27f642a562eb8401eb0ceb3940-onjpojl8.jpg" alt="steimerbyte" style="border-radius: 8px; margin: 16px 0; max-width: 100%;"/>

[![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/steimerbyte)

> ⭐ If you find this useful, consider [supporting me on Ko-fi](https://ko-fi.com/steimerbyte)!





# pi-command-palette

A floating command palette for pi-coding-agent via **Ctrl+P** shortcut.

## Features

- Floating centered TUI overlay
- Search/filter commands by name
- Keyboard navigation (↑↓ to navigate, Enter to select, Esc to close)
- Fuzzy filtering as you type

## Setup

### 1. Rebind Default Ctrl+P Shortcuts

Create/edit `~/.pi/agent/keybindings.json`:

```json
{
  "app.model.cycleForward": ["shift+ctrl+p"],
  "app.models.toggleProvider": ["ctrl+shift+p"],
  "app.session.togglePath": ["ctrl+alt+p"]
}
```

This frees Ctrl+P by rebinding conflicting built-in shortcuts.

### 2. Install Extension

```bash
git clone https://github.com/alephtex/pi-command-palette ~/.pi/agent/extensions/pi-command-palette
```

Update `~/.pi/agent/settings.json`:

```json
{
  "extensions": [
    "extensions/pi-command-palette"
  ]
}
```

### 3. Reload

```bash
/reload
```

## Usage

Press **Ctrl+P** to open the command palette. Type to filter, use arrow keys to navigate, Enter to execute.

## Repository

https://github.com/alephtex/pi-command-palette
