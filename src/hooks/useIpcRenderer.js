import { useEffect } from 'react'
const { ipcRenderer } = window.require('electron')

const useIpcRenderer = (keyCallbackMap) => {
  useEffect(() => {
    const keys = Object.keys(keyCallbackMap)
    keys.forEach((key) => {
      ipcRenderer.on(key, keyCallbackMap[key])
    })
    return () => {
      keys.forEach((key) => {
        ipcRenderer.removeListener(key, keyCallbackMap[key])
      })
    }
  })
}

export default useIpcRenderer
