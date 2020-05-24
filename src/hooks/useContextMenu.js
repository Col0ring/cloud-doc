import { useEffect, useRef } from 'react'
const { remote } = window.require('electron')
const { MenuItem, Menu } = remote
const useContextMenu = (menuArr, targetSelector) => {
  const currentClickElement = useRef(null)
  useEffect(() => {
    const menu = new Menu()
    menuArr.forEach((item) => {
      menu.append(new MenuItem(item))
    })
    const handleContextMenu = (e) => {
      // 只有 target 包裹的选择器内才会显示
      if (document.querySelector(targetSelector).contains(e.target)) {
        currentClickElement.current = e.target
        menu.popup({ window: remote.getCurrentWindow })
      }
    }
    window.addEventListener('contextmenu', handleContextMenu)
    return () => {
      window.removeEventListener('contextmenu', handleContextMenu)
    }
  }, [menuArr, targetSelector])
  return currentClickElement
}

export default useContextMenu
