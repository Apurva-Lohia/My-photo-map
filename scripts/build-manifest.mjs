// Scans public/media/ and writes src/data/media.json.
//
// Put each place's photos and videos in its own folder, e.g. ("Photos-kolkata" works too)
//   public/media/Kolkata/howrah-bridge.jpg
//   public/media/Kerala/houseboat.mp4
// Folder names are matched to places by key, name or alias (case-insensitive),
// so "Kolkata", "kolkata" and "Calcutta" all work.
//
// Runs automatically before `npm run dev` and `npm run build`.
// Run it on its own with `npm run media` after adding files.

import { readdirSync, statSync, writeFileSync, existsSync } from 'node:fs'
import { join, extname, basename, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { places } from '../src/data/places.js'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const mediaDir = join(root, 'public', 'media')
const out = join(root, 'src', 'data', 'media.json')

const PHOTO = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif', '.avif'])
const VIDEO = new Set(['.mp4', '.webm', '.mov', '.m4v'])
const SKIPPED = new Set(['.heic', '.heif', '.raw', '.cr2', '.nef', '.dng'])

const norm = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '')
// "Photos-bangalore", "pics_Kerala", "Kolkata videos" → "bangalore", "kerala", "kolkata"
const folderKey = (s) =>
  norm(s.toLowerCase().replace(/\b(my\s+)?(photos?|pics?|pictures?|images?|videos?|media|trip|travel)\b/g, ' ').replace(/\b\d{4}\b/g, ' '))
const lookup = new Map()
for (const p of places) {
  for (const n of [p.key, p.name, ...(p.aliases || [])]) lookup.set(norm(n), p.key)
}

const pretty = (file) =>
  basename(file, extname(file))
    .replace(/^(img|dsc|pxl|vid|mov)[_-]?\d+[_-]?/i, '')
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

function walk(dir) {
  const files = []
  for (const name of readdirSync(dir)) {
    if (name.startsWith('.')) continue
    const full = join(dir, name)
    if (statSync(full).isDirectory()) files.push(...walk(full))
    else files.push(full)
  }
  return files
}

const media = {}
const unmatched = []
const skipped = []

if (existsSync(mediaDir)) {
  for (const folder of readdirSync(mediaDir)) {
    const full = join(mediaDir, folder)
    if (folder.startsWith('.') || !statSync(full).isDirectory()) continue
    const key = lookup.get(norm(folder)) || lookup.get(folderKey(folder))
    if (!key) { unmatched.push(folder); continue }
    const items = walk(full)
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
      .flatMap((file) => {
        const ext = extname(file).toLowerCase()
        const src = '/' + file.slice(join(root, 'public').length + 1).split('\\').join('/')
        if (PHOTO.has(ext)) return [{ type: 'photo', src: encodeURI(src), caption: pretty(file) }]
        if (VIDEO.has(ext)) return [{ type: 'video', src: encodeURI(src), caption: pretty(file) }]
        if (SKIPPED.has(ext)) skipped.push(file.slice(root.length + 1))
        return []
      })
    media[key] = [...(media[key] || []), ...items]
  }
}

writeFileSync(out, JSON.stringify(media, null, 2) + '\n')

const total = Object.values(media).reduce((n, list) => n + list.length, 0)
console.log(`media: ${total} files across ${Object.keys(media).length} places → src/data/media.json`)
if (unmatched.length) console.log(`media: folders with no matching place (add an alias in places.js): ${unmatched.join(', ')}`)
if (skipped.length) console.log(`media: ${skipped.length} files browsers can't show (convert HEIC/RAW to JPG): ${skipped.slice(0, 5).join(', ')}${skipped.length > 5 ? '…' : ''}`)
