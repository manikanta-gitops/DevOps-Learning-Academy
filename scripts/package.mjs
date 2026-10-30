import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { basename, relative, resolve } from 'node:path'
import { spawnSync } from 'node:child_process'
import assert from 'node:assert/strict'
import { buildContent, filesUnder, hash, root } from './content.mjs'

buildContent()
const output = resolve(process.argv[2] || resolve(root, '../DevOps-Learning-Academy.zip'))
assert(!existsSync(output), `Refusing to overwrite ${output}`)
const temporary = mkdtempSync(resolve(tmpdir(), 'academy-package-'))
const folder = resolve(temporary, 'DevOps-Learning-Academy')
const include = ['src', 'public', 'academy-content', 'content', 'scripts', 'tests', '.github', '.gitignore', '.oxlintrc.json', 'package.json', 'package-lock.json', 'index.html', 'vite.config.ts', 'tsconfig.json', 'tsconfig.app.json', 'tsconfig.node.json', 'playwright.config.ts', 'README.md', 'DEPLOYMENT.md', 'TESTING.md']
try {
  mkdirSync(folder)
  for (const path of include) cpSync(resolve(root, path), resolve(folder, path), { recursive: true })
  const manifest = Object.fromEntries(filesUnder(folder).map(path => [relative(folder, path).split('\\').join('/'), hash(readFileSync(path))]))
  writeFileSync(resolve(folder, 'PACKAGE-MANIFEST.json'), JSON.stringify(manifest, null, 2) + '\n')
  const archive = spawnSync('zip', ['-q', '-X', '-r', output, 'DevOps-Learning-Academy'], { cwd: temporary, stdio: 'inherit' })
  if (archive.error) throw archive.error
  assert.equal(archive.status, 0, 'ZIP command failed')
  const digest = hash(readFileSync(output))
  writeFileSync(`${output}.sha256`, `${digest}  ${basename(output)}\n`)
  console.log(`Packaged ${Object.keys(manifest).length} source files plus integrity manifest: ${output}\nSHA-256: ${digest}`)
} finally { rmSync(temporary, { recursive: true, force: true }) }