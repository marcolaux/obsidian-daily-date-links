# Daily Date Links Plugin for Obsidian

Seamlessly create Daily Notes from internal links in Obsidian.

> [!NOTE]
> The original repository is hosted on [GitLab](https://gitlab.com/marcaux/obsidian-daily-date-links). The [GitHub repository](https://github.com/marcolaux/obsidian-daily-date-links) is a mirror.

## What is this?

By default, when you click a wikilink like `[[2026-01-15]]` in Obsidian, it creates a blank note with that name. This plugin intercepts those clicks and, if the link text corresponds to a valid date, creates a **Daily Note** instead.

This means the new note will:

-   Be placed in your configured **Daily Notes folder**.
-   Use your **Daily Note template**.
-   Respect your **Daily Note date format**.

It acts as a bridge between freestyle linking and structured Daily Notes.

## Features

-   **Smart Interception**: Automatically detects if a link points to a non-existent Daily Note.
-   **Template Support**: Uses the core Daily Notes (or Periodic Notes) settings to generate the note from your template.
-   **Complex Dates**: Supports custom date formats like `YYYY/MM/DD` or even nested folders. If you link to just the date part (e.g., `[[2026-01-15]]`) but your format is `Daily/YYYY-MM-DD`, it works!
-   **Live Preview & Reading View**: Works in both editor modes.
-   **Safe Fallback**: If a note already exists, it simply opens it. If a link isn't a date, it behaves normally.

## Installation

### From Community Plugins

1.  Open Obsidian Settings > Community Plugins.
2.  Turn off "Restricted mode".
3.  Click "Browse" and search for "Daily Date Links".
4.  Install and Enable.

### With BRAT (Beta Reviewers Auto-update Tool)

1.  Install the **BRAT** plugin from Community Plugins.
2.  Open BRAT settings.
3.  Click "Add Beta plugin".
4.  Paste the repository URL: `https://github.com/marcolaux/obsidian-daily-date-links`
5.  Click "Add Plugin".

### Manual Installation

1.  Download the latest release from the Releases page.
2.  Extract the files into your vault's `.obsidian/plugins/obsidian-daily-date-links/` folder.
3.  Reload Obsidian.

## Usage

1.  Ensure the **Daily Notes** core plugin is enabled and configured (Template, Folder, Format).
2.  In any note, type a link to a future date, e.g., `[[2026-12-31]]`.
3.  Click the link.
4.  ✨ Instead of a blank file, your new Daily Note is created and opened!

## Development

Clone the repository and install dependencies:

```bash
git clone https://gitlab.com/marcaux/obsidian-daily-date-links.git
cd obsidian-daily-date-links
npm install
```

Build the plugin:

```bash
npm run build
```

## License

MIT
