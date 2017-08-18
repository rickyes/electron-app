const electron = require('electron')
const desktopCapturer = electron.desktopCapturer
const electronScreen = electron.screen
const shell = electron.shell

const fs = require('fs')
const os = require('os')
const path = require('path')

const screenshot = document.getElementById('screen-shot')
const screenshotMsg = document.getElementById('screenshot-path')

screenshot.addEventListener('click', function (event) {
  var bodyHTML = window.document.body.innerHTML
  window.document.body.innerHTML = document.getElementById('pre-print').innerHTML
  window.print()
  window.document.body.innerHTML = bodyHTML
})

function determineScreenShotSize () {
  const screenSize = electronScreen.getPrimaryDisplay().workAreaSize
  const maxDimension = Math.max(screenSize.width, screenSize.height)
  return {
    width: maxDimension * window.devicePixelRatio,
    height: maxDimension * window.devicePixelRatio
  }
}
