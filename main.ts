import { Plugin } from "obsidian";
import {
	appHasDailyNotesPluginLoaded,
	createDailyNote,
	getDateFromPath,
	getDailyNoteSettings,
} from "obsidian-daily-notes-interface";

// Extend window to include moment
declare global {
	interface Window {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		moment: any;
	}
}

export default class DailyDateLinksPlugin extends Plugin {
	async onload() {
		this.registerDomEvent(
			document,
			"click",
			async (evt: MouseEvent) => {
				// Ensure Daily Notes plugin is loaded
				if (!appHasDailyNotesPluginLoaded()) {
					return;
				}

				const target = evt.target as HTMLElement;

				// Check for Reading View (.internal-link) or Live Preview (.cm-underline, .cm-hmd-internal-link)
				let linkElement = target.closest(".internal-link");
				if (!linkElement) {
					if (
						target.matches(".cm-underline") ||
						target.matches(".cm-hmd-internal-link")
					) {
						linkElement = target;
					} else {
						// Sometimes the target is a child of the link in LP
						linkElement =
							target.closest(".cm-underline") ||
							target.closest(".cm-hmd-internal-link");
					}
				}

				if (linkElement) {
					const linkText = (linkElement as HTMLElement).innerText;

					// 1. Try generic parsing from the library (handles full paths/configured formats)
					let date = getDateFromPath(linkText, "day");

					// 2. Fallback: Parse using strict format or basename check for cases like "YYYY/MM/YYYY-MM-DD"
					if (!date) {
						const dailyNoteSettings = getDailyNoteSettings();
						const { format } = dailyNoteSettings;

						// Try strict parsing against the full format
						const strictDate = window.moment(
							linkText,
							format,
							true
						);
						if (strictDate.isValid()) {
							date = strictDate;
						}
						// Try usage of just the filename part of the format (e.g. user linking to "2026-01-15" when format is "folder/2026-01-15")
						else if (format && format.includes("/")) {
							const basenameFormat = format.split("/").pop();
							if (basenameFormat) {
								const basenameDate = window.moment(
									linkText,
									basenameFormat,
									true
								);
								if (basenameDate.isValid()) {
									date = basenameDate;
								}
							}
						}
					}

					if (date && date.isValid()) {
						const dataHref = linkElement.getAttribute("data-href");
						const path = dataHref || linkText;

						// Check if file already exists using Obsidian's cache
						const existingFile =
							this.app.metadataCache.getFirstLinkpathDest(
								path,
								""
							);

						if (!existingFile) {
							// Prevent default behavior (creating a blank note)
							evt.preventDefault();
							evt.stopPropagation();

							try {
								const newFile = await createDailyNote(date);
								const leaf = this.app.workspace.getLeaf(false);
								await leaf.openFile(newFile);
							} catch (err) {
								// console.error("[DailyDateLinks] Failed to create daily note:", err);
							}
						}
					}
				}
			},
			{ capture: true }
		);
	}

	onunload() {}
}
