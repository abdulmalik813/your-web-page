import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const cssPath = path.join(__dirname, '../src/app/(frontend)/theme.css')
const outputPath = path.join(__dirname, '../src/constants/global-css.ts')

const cssContent = fs.readFileSync(cssPath, 'utf-8')

const output = `// This file is auto-generated from src/app/(frontend)/theme.css
// Do not edit manually - changes will be overwritten
// Run 'pnpm install', 'pnpm run export-css', or restart dev server to regenerate

export const globalCSS = ${JSON.stringify(cssContent)};
`

const outputDir = path.dirname(outputPath)
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true })
}

fs.writeFileSync(outputPath, output, 'utf-8')
