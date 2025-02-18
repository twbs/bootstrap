import path from 'node:path'
import sizeOf from 'image-size'
import { getDocsStaticFsPath } from './path'

export function getStaticImageSize(imagePath: string) {
  const size = sizeOf(path.join(getDocsStaticFsPath(), imagePath))

  if (!size.height || !size.width) {
    throw new Error(`Failed to get size of static image at '${imagePath}'.`)
  }

  return { height: size.height, width: size.width }
}
