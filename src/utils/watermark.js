import Watermark from '@finv/watermark'

let watermark = null

export const createWatermark = (name) => {
  if (watermark) {
    watermark.destroy()
  }
  if (window.top === window.self) {
    watermark = new Watermark({
      content: name,
      width: 200,
      height: 170,
      alpha: 0.1,
    })
    watermark.create()
  }
}
