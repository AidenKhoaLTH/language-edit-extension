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


const findFile = (fileName: string) => {
  // Normalize the path to ensure it's in the correct format
  const filesPaths = vscode.workspace.getConfiguration().get<string>("yourExtension.filesPath")!.trim().split(";");
  const filePath = filesPaths.find(path => path.trim().includes(fileName))!
  
  const normalizedPath = path.normalize(filePath);
  // Convert to a URI
  const uri = vscode.Uri.file(normalizedPath);

  return uri;
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
    const filePath = findFile(fileName)
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
