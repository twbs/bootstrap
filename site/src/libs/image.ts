import path from 'node:path'
<<<<<<< HEAD
import sizeOf from 'image-size'
import { getDocsStaticFsPath } from './path'

export function getStaticImageSize(imagePath: string) {
  const size = sizeOf(path.join(getDocsStaticFsPath(), imagePath))

  if (!size.height || !size.width) {
=======
import { promises as fs } from 'node:fs'
import sizeOf from 'image-size'
import { getDocsStaticFsPath } from './path'

export async function getStaticImageSize(imagePath: string) {
  const fullPath = path.join(getDocsStaticFsPath(), imagePath)
  const buffer = await fs.readFile(fullPath)
  const size = await sizeOf(buffer)

  if (!size?.height || !size?.width) {
>>>>>>> main
    throw new Error(`Failed to get size of static image at '${imagePath}'.`)
  }

  return { height: size.height, width: size.width }
}
