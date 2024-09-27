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