import React, { useState, useEffect, useCallback } from 'react'
import { Row, Col } from 'antd'
import { v4 as uuid } from 'uuid'
import RightEditor from '@/components/RightEditor/RightEditor'
import LeftMenu from '@/components/LeftMenu/LeftMenu'
import GlobalFileSearch from '@/components/GlobalFileSearch/GlobalFileSearch'
import { flattenArr, obj2Arr, getParentNode } from '@/utils/help'
import fileHelper from '@/utils/fileHelper'
import { saveFiles2Store, fileStore, settingsStore } from '@/utils/store'
import useContextMenu from '@/hooks/useContextMenu'
import useIpcRenderer from '@/hooks/useIpcRenderer'
import './App.less'
const { join, basename, extname, dirname } = window.require('path')
const { remote } = window.require('electron')

function App() {
  const [globalSearcVisible, setGlobalSearcVisible] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [files, setFiles] = useState(fileStore.get('files') || {})
  const [searchFiles, setSearchFiles] = useState(fileStore.get('files') || {})
  const [activeFileId, setActiveFileId] = useState('')
  const [openedFileIds, setOpenedFilesIds] = useState([])
  const [unsaveFileIds, setUnsaveFileIds] = useState([])
  const [clickId, setClickId] = useState('')
  const [editingId, setEditingId] = useState('')
  const filesArr = obj2Arr(files)
  const searchFilesArr = obj2Arr(searchFiles)
  const openedFiles = openedFileIds.map((openedId) => files[openedId])
  const savedLocation =
    settingsStore.get('savedFileLocation') || remote.app.getPath('documents')

  const onCreateFile = () => {
    const newId = uuid()
    const newFile = {
      id: newId,
      isNew: true,
      name: '',
      content: '',
      createdAt: new Date().getTime()
    }

    setFiles({ ...files, [newId]: newFile })
    setSearchFiles({ ...files, [newId]: newFile })
    setSearchText('')
  }

  const onImportFiles = async () => {
    try {
      const res = await remote.dialog.showOpenDialog({
        title: '请选择要导入的 Markdown 文件',
        properties: ['openFile', 'multiSelections'],
        filters: [{ name: 'Markdown Files', extensions: ['md'] }]
      })
      if (res.filePaths.length > 0) {
        const filterPaths = res.filePaths.filter((path) => {
          return !Object.keys(files).find((file) => file.path === path)
        })
        const importFilesArr = filterPaths.map((path) => ({
          id: uuid(),
          name: basename(path, extname(path)),
          path
        }))
        const newFiles = { ...files, ...flattenArr(importFilesArr) }
        setFiles(newFiles)
        setSearchFiles(newFiles)
        saveFiles2Store(newFiles)
        if (importFilesArr.length === 1) {
          setClickId(importFilesArr[0].id)
        }
      }
    } catch (error) {
      //
    }
  }

  const onSearch = (val, setLoading) => {
    if (setSearchText === val) {
      return
    }
    setLoading(true)

    setSearchText(val)
    const newFiles = flattenArr(
      filesArr.filter((file) => file.name.includes(val))
    )
    setSearchFiles(newFiles)
    setLoading(false)
  }

  const onGlobalSearchCancel = () => {
    setGlobalSearcVisible(false)
  }

  const onFileClick = useCallback(
    async (id) => {
      const clickFile = files[id]
      if (!clickFile.isLoaded) {
        const res = await fileHelper.readFile(clickFile.path)
        if (res) {
          const value = typeof res === 'boolean' ? '' : res
          const newFile = { ...files[id], content: value, isLoaded: true }
          setFiles({ ...files, [id]: newFile })
        }
      }
      if (openedFileIds.includes(id)) {
        setActiveFileId(id)
      } else {
        setOpenedFilesIds([...openedFileIds, id])
        setActiveFileId(id)
      }
    },
    [files, openedFileIds]
  )

  const onTabClick = (id) => {
    if (id !== activeFileId) {
      setActiveFileId(id)
    }
  }
  const onCloseTab = (id) => {
    const closeIndex = openedFileIds.findIndex((fileId) => fileId === id)
    if (closeIndex > -1) {
      if (activeFileId === id) {
        let newActiveId = ''
        if (closeIndex !== 0) {
          newActiveId = openedFileIds[closeIndex - 1]
        } else {
          newActiveId =
            openedFileIds.length > 1 ? openedFileIds[closeIndex + 1] : ''
        }
        setActiveFileId(newActiveId)
      }

      const newOpenedFileIds = [...openedFileIds]
      newOpenedFileIds.splice(closeIndex, 1)
      setOpenedFilesIds(newOpenedFileIds)
    }
  }

  const onFileDelete = async (id) => {
    if (files[id].isNew) {
      const { [id]: value, ...otherFiles } = files
      onCloseTab(id)
      setFiles(otherFiles)
      setSearchFiles(otherFiles)
    } else {
      const res = await fileHelper.deleteFile(files[id].path)
      if (res) {
        const { [id]: value, ...otherFiles } = files
        onCloseTab(id)
        setFiles(otherFiles)
        setSearchFiles(otherFiles)
        saveFiles2Store(otherFiles)
      }
    }
  }
  const onEditorChange = (id, value) => {
    if (value !== files[id].content) {
      const newFile = { ...files[id], content: value }
      setFiles({ ...files, [id]: newFile })
      setSearchFiles({ ...searchFiles, [id]: newFile })
      if (!unsaveFileIds.includes(id)) {
        setUnsaveFileIds([...unsaveFileIds, id])
      }
    }
  }
  const onEditorSave = async () => {
    if (!unsaveFileIds.includes(activeFileId)) {
      return
    }
    const activeFile = files[activeFileId]
    const res = await fileHelper.writeFile(activeFile.path, activeFile.content)
    if (res) {
      setUnsaveFileIds(
        unsaveFileIds.filter((fileId) => fileId !== activeFileId)
      )
    }
  }
  const onSaveEdit = async (id, name, isNew) => {
    if (!name.trim() || files[id].name === name) {
      return
    }
    const newPath = isNew
      ? join(savedLocation, `${name}.md`)
      : join(dirname(files[id].path), `${name}.md`)
    const modifiedFile = { ...files[id], name, isNew: false, path: newPath }
    const newFiles = { ...files, [id]: modifiedFile }
    let res
    if (isNew) {
      res = await fileHelper.writeFile(newPath, files[id].content)
    } else {
      const oldPath = files[id].path
      res = await fileHelper.renameFile(oldPath, newPath)
    }
    if (res) {
      setFiles(newFiles)
      setSearchFiles(newFiles)
      saveFiles2Store(newFiles)
      setClickId(id)
    }
  }

  useEffect(() => {
    if (clickId) {
      onFileClick(clickId)
    }
    return () => {
      setClickId('')
    }
  }, [clickId, onFileClick])

  const currentClickElement = useContextMenu(
    [
      {
        label: '打开',
        click() {
          const pareentElement = getParentNode(
            currentClickElement.current,
            'file-list-item-wrap'
          )
          if (pareentElement) {
            onFileClick(pareentElement.dataset.id)
          }
        }
      },
      {
        label: '重命名',
        click() {
          const pareentElement = getParentNode(
            currentClickElement.current,
            'file-list-item-wrap'
          )
          if (pareentElement) {
            setEditingId(pareentElement.dataset.id)
          }
        }
      },
      {
        label: '删除',
        click() {
          const pareentElement = getParentNode(
            currentClickElement.current,
            'file-list-item-wrap'
          )
          if (pareentElement) {
            onFileDelete(pareentElement.dataset.id)
          }
        }
      }
    ],
    '.file-list'
  )
  useIpcRenderer({
    'create-new-file': onCreateFile,
    'import-file': onImportFiles,
    'save-edit-file': onEditorSave,
    'search-file': () => {
      setGlobalSearcVisible(true)
    }
  })

  return (
    <div className='App'>
      <Row>
        <Col span={6}>
          <LeftMenu
            files={searchFilesArr}
            onSearch={onSearch}
            onFileClick={onFileClick}
            onFileDelete={onFileDelete}
            onSaveEdit={onSaveEdit}
            onCreateFile={onCreateFile}
            searchText={searchText}
            setSearchText={setSearchText}
            onImportFiles={onImportFiles}
            editingId={editingId}
            setEditingId={setEditingId}
          />
        </Col>
        <Col span={18} style={{ paddingLeft: 8 }}>
          <RightEditor
            activeFileId={activeFileId}
            openedFiles={openedFiles}
            onTabClick={onTabClick}
            onCloseTab={onCloseTab}
            onCreateFile={onCreateFile}
            onEditorChange={onEditorChange}
            unsaveFileIds={unsaveFileIds}
          />
        </Col>
      </Row>
      <GlobalFileSearch
        onSearch={onSearch}
        visible={globalSearcVisible}
        onCancel={onGlobalSearchCancel}
      />
    </div>
  )
}

export default App
