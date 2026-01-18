import { Plugin } from "obsidian";
import {
	appHasDailyNotesPluginLoaded,
	appHasWeeklyNotesPluginLoaded,
	createDailyNote,
	createWeeklyNote,
	getDateFromPath,
	getDailyNoteSettings,
	getWeeklyNoteSettings,
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
				if (
					!appHasDailyNotesPluginLoaded() &&
					!appHasWeeklyNotesPluginLoaded()
				) {
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
					} else if (target.matches(".internal-embed")) {
						linkElement = target;
					} else {
						// Sometimes the target is a child of the link in LP
						linkElement =
							target.closest(".cm-underline") ||
							target.closest(".cm-hmd-internal-link") ||
							target.closest(".internal-embed");
					}
				}

				if (linkElement) {
					let linkText = (linkElement as HTMLElement).innerText;
					const dataHref = linkElement.getAttribute("data-href");
					const src = linkElement.getAttribute("src");

					if (
						linkElement.classList.contains("internal-embed") &&
						src
					) {
						linkText = src;
						if (linkText.endsWith(".md")) {
							linkText = linkText.substring(
								0,
								linkText.length - 3
							);
						}
					}

					const path = dataHref || src || linkText;

					// Check if file already exists using Obsidian's cache
					const existingFile =
						this.app.metadataCache.getFirstLinkpathDest(path, "");

					if (existingFile) {
						return;
					}

					// --- DAILY NOTES LOGIC ---
					if (appHasDailyNotesPluginLoaded()) {
						// 1. Try generic parsing
						let date = getDateFromPath(linkText, "day");

						// 2. Fallback: Parse using strict format or basename check
						if (!date) {
							const dailyNoteSettings = getDailyNoteSettings();
							const { format } = dailyNoteSettings;

							if (format) {
								const strictDate = window.moment(
									linkText,
									format,
									true
								);
								if (strictDate.isValid()) {
									date = strictDate;
								} else if (format.includes("/")) {
									const basenameFormat = format
										.split("/")
										.pop();
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
								} else if (linkText.includes("/")) {
									// NEW: If linkText is a path, try matching just the filename against the format
									const basenameLink = linkText
										.split("/")
										.pop();
									if (basenameLink) {
										const basenameDate = window.moment(
											basenameLink,
											format,
											true
										);
										if (basenameDate.isValid()) {
											date = basenameDate;
										}
									}
								}
							}
						}

						if (date && date.isValid()) {
							evt.preventDefault();
							evt.stopPropagation();
							try {
								const newFile = await createDailyNote(date);
								const leaf = this.app.workspace.getLeaf(false);
								await leaf.openFile(newFile);
								return; // Success, stop here
							} catch (err) {
								// console.error("[DailyDateLinks] Failed to create daily note:", err);
							}
						}
					}

					// --- WEEKLY NOTES LOGIC ---
					if (appHasWeeklyNotesPluginLoaded()) {
						// 1. Try generic parsing
						let date = getDateFromPath(linkText, "week");

						// 2. Fallback: Parse using strict format or basename check
						if (!date) {
							const weeklyNoteSettings = getWeeklyNoteSettings();
							const { format } = weeklyNoteSettings;

							if (format) {
								const strictDate = window.moment(
									linkText,
									format,
									true
								);
								if (strictDate.isValid()) {
									date = strictDate;
								} else if (format.includes("/")) {
									const basenameFormat = format
										.split("/")
										.pop();
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
								} else if (linkText.includes("/")) {
									// NEW: If linkText is a path, try matching just the filename against the format
									const basenameLink = linkText
										.split("/")
										.pop();
									if (basenameLink) {
										const basenameDate = window.moment(
											basenameLink,
											format,
											true
										);
										if (basenameDate.isValid()) {
											date = basenameDate;
										}
									}
								}
							}
						}

						if (date && date.isValid()) {
							evt.preventDefault();
							evt.stopPropagation();
							try {
								const newFile = await createWeeklyNote(date);
								const leaf = this.app.workspace.getLeaf(false);
								await leaf.openFile(newFile);
								return;
							} catch (err) {
								// console.error("[DailyDateLinks] Failed to create weekly note:", err);
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
