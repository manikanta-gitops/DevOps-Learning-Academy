import { readFileSync, readdirSync } from 'node:fs'
import { resolve, relative } from 'node:path'
import { createHash } from 'node:crypto'
import assert from 'node:assert/strict'

const root = resolve(import.meta.dirname, '..')
const files = folder => readdirSync(folder, { withFileTypes: true }).flatMap(entry => {
  const path = resolve(folder, entry.name)
  return entry.isDirectory() ? files(path) : [relative(root, path).split('\\').join('/')]
})
const manifest = JSON.parse(readFileSync(resolve(root, 'PACKAGE-MANIFEST.json'), 'utf8'))
for (const [path, expected] of Object.entries(manifest)) {
  assert(!path.startsWith('/') && !path.split('/').includes('..'), `Unsafe manifest path: ${path}`)
  assert.equal(createHash('sha256').update(readFileSync(resolve(root, path))).digest('hex'), expected, `Changed or missing file: ${path}`)
}
assert.deepEqual(files(root).filter(path => path !== 'PACKAGE-MANIFEST.json').sort(), Object.keys(manifest).sort(), 'Unexpected files; run verification immediately after extraction, before npm ci')
console.log(`Verified ${Object.keys(manifest).length} packaged files and no unexpected files.`)