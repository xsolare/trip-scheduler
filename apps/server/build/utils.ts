import { resolve } from 'node:path'
import { fileURLToPath } from 'bun'

export function alias(path: string): string {
  return fileURLToPath(new URL(resolve(import.meta.dir, path), import.meta.url))
}

export function toAbsolute(path: string): string {
  return resolve(import.meta.dir, path)
}
