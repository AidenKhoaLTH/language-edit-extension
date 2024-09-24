import { FileTypeConst } from './constant';

export function getWebviewContent(fileType: typeof FileTypeConst) {
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Input Form</title>
      </head>
      <body>
        <h1>Enter Your Inputs For ${fileType} files</h1>
        <form id="inputForm">
          <label for="id">ID:</label>
          <input type="text" id="id" name="id" required><br><br>
          <label for="source">Source:</label>
          <input type="text" id="source" name="source" required><br><br>
          <label for="target">Target:</label>
          <input type="text" id="target" name="target" required><br><br>
          <button type="button" onclick="submitForm()">Submit</button>
        </form>
        <script>
          const vscode = acquireVsCodeApi();
  
          function submitForm() {
            const id = document.getElementById('id').value;
            const source = document.getElementById('source').value;
            const target = document.getElementById('target').value;
            vscode.postMessage({
              command: 'submit',
              id,
              source,
              target
            });
          }
        </script>
      </body>
      </html>
    `;
  }