import { createImage } from "./createImage";
export const getCroppedImg=async(imageSrc,croppedAreaPixels)=>{
  const image=await createImage(imageSrc)
  const canvas=document.createElement('canvas')
  const ctx=canvas.getContext('2d')

  canvas.width=croppedAreaPixels.width
  canvas.height=croppedAreaPixels.height

  ctx.drawImage(
    image,
    croppedAreaPixels.x,
    croppedAreaPixels.y,
    croppedAreaPixels.width,
    croppedAreaPixels.height,
    0,
    0,
    croppedAreaPixels.width,
    croppedAreaPixels.height
  )

  return new Promise((resolve)=>{
    canvas.toBlob((file)=>{
      resolve(URL.createObjectURL(file))
    },'image/jpeg')
  })
}