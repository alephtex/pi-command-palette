[![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/steimerbyte)

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
