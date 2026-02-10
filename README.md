# Apply Individually (Figma Plugin)

Apply different text values to multiple selected Figma text layers in one pass. Supports sequential or random assignment, optional prefix/suffix, and text casing transforms.

**Features**
- Replace selected text layers with values from a list.
- Sequential or random ordering.
- Optional prefix and suffix.
- Text casing: keep original, title, upper, lower.
- Accepts comma, newline, or space separated input.
- Upload .txt, .csv, .md, or .json to populate the list.

**Usage**
1. In Figma: `Plugins > Development > Import plugin from manifest...`
2. Select one or more text layers.
3. Open `Apply Individually` from the Plugins menu.
4. Paste a list (or upload a file), pick options, then click `Apply to Selection`.

**UI Controls**
- Tabs: `Manual` (paste text) and `Upload` (load a file).
- Text case: Keep original, Title Case, Uppercase, Lowercase.
- Separator: Comma, New Line, Space.
- Order: Sequential or Random.
- Prefix and Suffix inputs.

**Behavior Details**
- Only `TEXT` nodes in the selection are updated.
- If no text layers are selected, the plugin shows a notification.
- If no list is provided, the plugin applies prefix/suffix/casing to existing text.
- When a list is provided, text is overwritten on each selected layer.
- Sequential mode wraps when the list is shorter than the selection.
- For mixed-font text, the plugin loads the first character's font before updating.
- Network access is disabled in `manifest.json`.

**Project Structure**
- `manifest.json` - Figma plugin manifest.
- `code.js` - Plugin controller logic.
- `ui.html` - Plugin UI.
- `.github/workflows/` - Release and packaging automation.

**Release Automation**
- On push to `main`, auto-versioning happens via commit prefixes:
- `Breaking:` bumps major.
- `Release:` or `Releases:` bumps minor.
- `Fix:` bumps patch.
- Add `[no release]` to the latest commit message to skip packaging.
- The release zip includes `manifest.json`, the `main` and `ui` files, and optional `assets/`.
- A manual workflow (`releases-zip.yml`) is available via `workflow_dispatch`.

**Development**
- No build step.
- Edit `code.js` and `ui.html` directly.
- Re-import the manifest into Figma for local testing.

**License**
- No license file is included in this repository.
