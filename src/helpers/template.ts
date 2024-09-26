import * as vscode from "vscode"
import {
  getLineToEdit,
  getTemplate,
  i18nFiles,
  i18nFilesName,
  tsFilesName
} from "./constant"
import * as fs from "fs"
import * as path from "path"

function findFileRecursively(
  directory: string,
  fileName: string
): string | null {
  const files = fs.readdirSync(directory)

  for (const file of files) {
    const fullPath = path.join(directory, file)
    const stat = fs.statSync(fullPath)

    if (stat.isDirectory()) {
      const found = findFileRecursively(fullPath, fileName)
      if (found) {
        return found
      }
    } else if (file === fileName) {
      return fullPath
    }
  }

  return null
}
export async function handleInputs(
  id: string,
  source: string,
  target: string,
  fileName: tsFilesName | i18nFilesName
) {
  const workspaceFolder = vscode.workspace.workspaceFolders?.[0]

  if (workspaceFolder) {
    // Construct the file path
    const filePath = findFileRecursively(workspaceFolder.uri.fsPath, fileName)
    if (!filePath) {
      vscode.window.showErrorMessage(`File ${fileName} not found.`)
      return
    }
    try {
      // Open the document
      const document = await vscode.workspace.openTextDocument(filePath)

      const workspaceEdit = new vscode.WorkspaceEdit()

      // Show the document in the editor
      // const editor = await vscode.window.showTextDocument(document);
      let template = getTemplate(
        id,
        source,
        target,
        fileName as i18nFilesName & tsFilesName
      )
      // Edit the document
      const lineEdit =
        document.lineCount -
        getLineToEdit(fileName as i18nFilesName & tsFilesName)

      await workspaceEdit.insert(
        document.uri,
        new vscode.Position(lineEdit, 0),
        template
      )
      // await editor.edit(editBuilder => {
      //   // Insert the new content at the end of the document
      //   editBuilder.	insert(new vscode.Position(lineEdit, 0), template);
      // });
      const success = await vscode.workspace.applyEdit(workspaceEdit)
	  const saved = await document.save();
      if (success) {
		const saved = await document.save();
		if(!saved){
			vscode.window.showErrorMessage("Failed to save file.")
		} else {
			vscode.window.showInformationMessage(
				`${id} has been added to ${fileName}.`
			)
		}
      }
    } catch (error) {
      vscode.window.showErrorMessage("Failed to open or edit the file.")
    }
  } else {
    vscode.window.showErrorMessage("No workspace folder found.")
  }
}
