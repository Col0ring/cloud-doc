import React from 'react'
import FileSearch from '@/components/FileSearch/FileSearch'
import FileList from '@/components/FileList/FileList'
import MenuFooter from '@/components/MenuFooter/MenuFooter'
import './LeftMenu.less'
import PropTypes from 'prop-types'

const LeftMenu = ({
  files,
  onFileClick,
  onSaveEdit,
  onCreateFile,
  onFileDelete,
  onSearch,
  searchText,
  setSearchText,
  onImportFiles,
  editingId,
  setEditingId
}) => {
  return (
    <div className='left-menu-container'>
      <div className='header'>
        <FileSearch
          onFileSearch={onSearch}
          value={searchText}
          setValue={setSearchText}
        />
      </div>
      <div className='file-list-container'>
        <FileList
          editingId={editingId}
          setEditingId={setEditingId}
          files={files}
          onFileClick={onFileClick}
          onSaveEdit={onSaveEdit}
          onFileDelete={onFileDelete}
        />
      </div>
      <div className='footer'>
        <MenuFooter onCreateFile={onCreateFile} onImportFiles={onImportFiles} />
      </div>
    </div>
  )
}
LeftMenu.propTypes = {
  files: PropTypes.array,
  searchText: PropTypes.string,
  setSearchText: PropTypes.func,
  onFileClick: PropTypes.func,
  onSaveEdit: PropTypes.func,
  onFileDelete: PropTypes.func,
  onSearch: PropTypes.func,
  onImportFiles: PropTypes.func,
  editingId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  setEditingId: PropTypes.func
}
export default LeftMenu
