export const FileConst = {
  filei18n: "example.txt",
  fileTS: "example2.txt"
}

export const i18nFiles = ['messages.xlf', 'messages.vi.xlf', 'messages.en.xlf'] as const
export const tsFiles = ['language-main.constants.ts', 'messages.ts.vi.xlf', 'messages.ts.en.xlf'] as const

export type i18nFilesName = typeof i18nFiles[0] | typeof i18nFiles[1] | typeof i18nFiles[2]
export type tsFilesName = typeof tsFiles[0] | typeof tsFiles[1] | typeof tsFiles[2]

export const FileTypeConst = {
  TS: "TS",
  i18n: "i18n"
}

export const GetTemplate = {
    fileTSTemplate: (
    id: string,
    source: string,
    target: string,
    forFile: tsFilesName
  ) => {
    if (forFile === "language-main.constants.ts") {
      return `
    public static readonly Z_${id} = "Z_${id}";`
    }
    if(forFile === "messages.ts.en.xlf"){
        return `
        <trans-unit id="Z_${id}" >
          <source>${source}</source>
          <target>${source}</target>
        </trans-unit>`
    }
    return `
        <trans-unit id="Z_${id}" >
          <source>${source}</source>
          <target>${target}</target>
        </trans-unit>`
  },
  filei18nTemplate: (
    id: string,
    source: string,
    target: string,
    forFile: i18nFilesName
  ) => {
    if (forFile === "messages.xlf") {
      return `
      <trans-unit id="${id}" datatype="html">
        <source>${source}</source>
      </trans-unit>`
    }
    if(forFile === "messages.en.xlf"){
        return `
      <trans-unit id="${id}" datatype="html">
        <source>${source}</source>
        <target state="final">${source}</target>
      </trans-unit>`
    }
    return `
      <trans-unit id="${id}" datatype="html">
        <source>${source}</source>
        <target state="final">${target}</target>
      </trans-unit>`
  }
}

export const getTemplate = (
  id: string,
  source: string,
  target: string,
  fileName: i18nFilesName & tsFilesName
) => {
  switch(fileName){
    case "messages.xlf":
      return GetTemplate.filei18nTemplate(id, source, target, fileName)
    case "language-main.constants.ts":
      return GetTemplate.fileTSTemplate(id, source, target, fileName)
    case "messages.ts.en.xlf":
      return GetTemplate.fileTSTemplate(id, source, target, fileName)
    case "messages.ts.vi.xlf":
      return GetTemplate.fileTSTemplate(id, source, target, fileName)
    case "messages.en.xlf":
      return GetTemplate.filei18nTemplate(id, source, target, fileName)
    default:
      return GetTemplate.filei18nTemplate(id, source, target, fileName)
  }
}

export const getLineToEdit = (fileName: i18nFilesName & tsFilesName): number => {
  switch(fileName){
    case "language-main.constants.ts":
      return 1
    default:
      return 3
  }
}