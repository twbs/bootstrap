import path from 'node:path'
import { getConfig } from './config'

// The docs directory path relative to the root of the project.
export const docsDirectory = getConfig().docsDir

export function getVersionedDocsPath(docsPath: string): string {
  const { docs_version } = getConfig()

  return `/docs/${docs_version}/${docsPath.replace(/^\//, '')}`
}

export function getDocsRelativePath(docsPath: string) {
  return path.join(docsDirectory, docsPath)
}

export function getDocsStaticFsPath() {
  return path.join(getDocsFsPath(), 'static')
}

export function getDocsPublicFsPath() {
  return path.join(getDocsFsPath(), 'public')
}

export function getDocsFsPath() {
  return path.join(process.cwd(), docsDirectory)
}
