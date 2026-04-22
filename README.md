# pi-command-palette

Opens the slash command menu (same as typing `/`) via **Ctrl+P** shortcut.

**Overriding default behavior:** Ctrl+P is normally used for model cycling in pi. This extension overrides that and opens the command palette instead.

## Installation

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

Reload pi:
```bash
/reload
```

## Usage

Press **Ctrl+P** to open the command palette - same menu as typing `/` in the input.

This overrides the default Ctrl+P (model cycling) behavior.

## Repository

https://github.com/alephtex/pi-command-palette
