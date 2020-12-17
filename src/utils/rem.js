const baseSize = 20
const baseWidth = 375
function setRem () {
  const htmlWidth = document.documentElement.clientWidth || document.body.clientWidth
  const htmlDom = document.getElementsByTagName('html')[0]
  htmlDom.style.fontSize = (baseSize * Math.min(htmlWidth / baseWidth, 2)) + 'px'
}
setRem()

window.onresize = function () {
  setRem()
}
