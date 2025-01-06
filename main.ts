import { Plugin } from "obsidian";

export default class ExamplePlugin extends Plugin {
	statusBarTextElemnt: HTMLSpanElement;

	async onload(): Promise<void> {
		this.statusBarTextElemnt = this.addStatusBarItem().createEl("span");
		this.readActiveFileAndUpdateLineCount();
		
		this.app.workspace.on("active-leaf-change", async () => {
			this.readActiveFileAndUpdateLineCount();
		});
		this.app.workspace.on("editor-change", (editor) => {
			const content = editor.getDoc().getValue();
			this.updateLineCount(content);
		});
	}

	private updateLineCount(fileContent?: string) {
		const count = fileContent ? fileContent.split(/\r\n|\r|\n/).length : 0;
		const linesWord = count === 1 ? "line" : "lines";
		this.statusBarTextElemnt.textContent = `${count} ${linesWord}`;
		console.log(linesWord);
	}

	private async readActiveFileAndUpdateLineCount() {
		const file = this.app.workspace.getActiveFile();
		if (file) {
			const content = await this.app.vault.read(file);
			console.log(content);
			this.updateLineCount(content);
		} else {
			console.log("not content");
			this.updateLineCount(undefined);
		}
	}
}
