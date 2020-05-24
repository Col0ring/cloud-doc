import { obj2Arr } from '@/utils/help'
const Store = window.require('electron-store')
export const fileStore = new Store({ name: 'electron-doc-data' })
export const saveFiles2Store = (files) => {
  const filesStoreObj = obj2Arr(files).reduce((res, file) => {
    const { id, path, name, createdAt } = file
    res[id] = {
      id,
      path,
      name,
      createdAt
    }
    return res
  }, {})
  fileStore.set('files', filesStoreObj)
}
