# AGENTS.md

## 🏁 Race Log (Project Status)

### What we built

We built a plugin that intercepts wikilink clicks. If the link looks like a date (based on your settings), we hijack the click and create a **Daily Note** instead of a blank file.

### Under the Hood (`main.ts`)

-   **Event Listener**: We listen for `click` events on `document` with `{ capture: true }` to beat Obsidian's default behavior.
-   **Target Acquisition**: We hunt for `.internal-link` (Reading View) and `.cm-underline` / `.cm-hmd-internal-link` (Live Preview).
-   **Date Parsing Logic**:
    1.  **Primary**: We use `obsidian-daily-notes-interface`'s `getDateFromPath` to check if the link matches the full daily note path.
    2.  **Fallback 1 (Strict)**: We try parsing simple dates against the configured format.
    3.  **Fallback 2 (Basename)**: If that fails, we check if the user just linked the filename (e.g. `2025-01-01`) while the setting has folders (e.g. `YYYY/MM/YYYY-MM-DD`). We extract the basename format and parse against that.
-   **Creation**: If it's a valid date and the file _doesn't exist_, we call `createDailyNote(date)` to create it using the correct template and folder.

### Tech Stack

-   **Lang**: TypeScript
-   **Dependencies**: `obsidian-daily-notes-interface` (Crucial for reading user settings and creating notes properly).
