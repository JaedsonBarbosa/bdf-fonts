import { mkdirSync, readdirSync, readFileSync, writeFileSync } from 'fs'

const outPath = './lib/fonts'
const inPath = './fonts'
const familyNames = readdirSync(inPath).map((familyName) => {
  const folderPath = inPath + '/' + familyName
  const outFolderPath = outPath + '/' + familyName
  mkdirSync(outFolderPath)
  const fonts = readdirSync(folderPath).map((variation) => {
    const name = variation.split('.')[0]
    const parts = name.split('-')
    const size = parts[0]
    const bold = parts.includes('b')
    const italic = parts.includes('i')
    const filePath = `${folderPath}/${variation}`
    const bdf = readFileSync(filePath, { encoding: 'ascii' })
    const { glyphs } = parse(bdf.replace(/\u000D/g, ''))
    const simplifiedGlyphs = [...new Array(255)].map((_, i) => glyphs[i])
    simplifiedGlyphs.filter((v) => v).forEach((v) => delete v.ENCODING)
    const data =
      'import {IFont} from "../../IFont"\n' +
      'export default ' +
      JSON.stringify(simplifiedGlyphs) +
      'as IFont'
    const outFilePath = `${outFolderPath}/${name}.ts`
    writeFileSync(outFilePath, data)
    const cleanName = name.replace(/-/g, '')
    return { size, bold, italic, name, cleanName }
  })
  const imports = fonts
    .map((v) => `import data${v.cleanName} from './${v.name}'`)
    .join('\n')
  const exports =
    'export default [' +
    fonts
      .map(
        (v) =>
          `{size:${v.size},bold:${v.bold},italic:${v.italic},data:data${v.cleanName}}`
      )
      .join(',') +
    '] as IFontFamily'
  const indexData =
    'import {IFontFamily} from "../../IFontFamily"\n' + `${imports}\n${exports}`
  const outIndexPath = `${outFolderPath}/index.ts`
  writeFileSync(outIndexPath, indexData)
  return familyName
})
const indexData =
  familyNames.map((v) => `import ${v} from './${v}'`).join('\n') +
  `\nexport const Fonts = {${familyNames.join(',')}}`
writeFileSync(outPath + '/index.ts', indexData)

export function parse(bdf: string) {
  const self: any = {}
  self.glyphs = {}
  self.properties = {}
  const lines = bdf.split(/\n/)

  let glyph: any = null,
    properties: any = null
  for (let i = 0, len = lines.length; i < len; i++) {
    const line = lines[i]

    if (glyph) {
      if (line !== 'ENDCHAR') {
        if (!glyph['BITMAP']) {
          const d = line.split(' ')
          switch (d[0]) {
            case 'ENCODING':
              glyph['ENCODING'] = +d[1]
              break
            case 'DWIDTH':
              glyph['DWIDTH'] = {
                x: +d[1],
                y: +d[2],
              }
              break
            case 'BBX':
              glyph['BBh'] = +d[2]
              glyph['BBox'] = +d[3]
              glyph['BBoy'] = +d[4]
              break
            case 'ATTRIBUTES':
              break
            case 'BITMAP':
              glyph['BITMAP'] = []
              break
          }
        } else {
          glyph.bits = line.length * 4
          glyph['BITMAP'].push(parseInt(line, 16))
        }
      } else {
        self.glyphs[glyph['ENCODING']] = glyph
        glyph = null
      }
    } else if (properties) {
      if (line !== 'ENDPROPERTIES') {
        const d = line.split(' ', 2)
        properties[d[0]] =
          d[1][0] === '"' ? d[1].substring(1, d[1].length - 2) : +d[1]
      } else {
        self.properties = properties
        properties = null
      }
    } else {
      const d = line.split(' ')
      switch (d[0]) {
        case 'COMMENT':
          break
        case 'FONT':
          self['FONT'] = d[1]
          break
        case 'SIZE':
          self['SIZE'] = {
            size: +d[1],
            xres: +d[2],
            yres: +d[3],
          }
          break
        case 'FONTBOUNDINGBOX':
          self['FONTBOUNDINGBOX'] = {
            w: +d[1],
            h: +d[2],
            x: +d[3],
            y: +d[4],
          }
          break
        case 'STARTPROPERTIES':
          properties = {}
          break
        case 'CHARS':
          self['CHARS'] = +d[1]
          break
        case 'STARTCHAR':
          glyph = {}
          break
        case 'ENDCHAR':
          break
      }
    }
  }
  self.size = self.properties.PIXEL_SIZE
  return self
}
