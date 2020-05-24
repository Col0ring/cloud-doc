import React from 'react'
import TabList from '@/components/TabList/TabList'
import SimpleMDE from 'react-simplemde-editor'
import 'easymde/dist/easymde.min.css'
import PropTypes from 'prop-types'
import EmptyData from '@/components/EmptyData/EmptyData'
const RightEditor = ({
  activeFileId,
  openedFiles = [],
  unsaveFileIds = [],
  onEditorChange,
  onCreateFile,
  onCloseTab,
  onTabClick
}) => {
  const activeFile = openedFiles.find((file) => file.id === activeFileId)
  // 关于监听 ctrl + s ,以前是使用编辑器自带的events属性绑定事件，并且使用 useEffect 进行更新，后改为使用electron提供的元素菜单
  return (
    <>
      {activeFile ? (
        <>
          <TabList
            files={openedFiles}
            activeId={activeFileId}
            unsaveIds={unsaveFileIds}
            onCloseTab={onCloseTab}
            onTabClick={onTabClick}
          />
          <SimpleMDE
            key={activeFile.id}
            value={activeFile.content}
            onChange={(value) =>
              onEditorChange && onEditorChange(activeFileId, value)
            }
            options={{
              autofocus: !activeFile.content,
              minHeight: '450px',
              spellChecker: false,
              toolbar: [
                'bold',
                'italic',
                'heading',
                '|',
                'quote',
                'code',
                'table',
                'horizontal-rule',
                'unordered-list',
                'ordered-list',
                '|',
                'link',
                'image',
                '|',
                'side-by-side',
                'fullscreen',
                '|',
                'guide'
              ]
            }}
          />
        </>
      ) : (
        <EmptyData onCreateFile={onCreateFile} />
      )}
    </>
  )
}

RightEditor.propTypes = {
  activeFileId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  openedFiles: PropTypes.array,
  unSaveFileIds: PropTypes.array,
  onEditorChange: PropTypes.func,
  onCloseTab: PropTypes.func,
  onCreateFile: PropTypes.func,
  onTabClick: PropTypes.func
}

export default RightEditor
