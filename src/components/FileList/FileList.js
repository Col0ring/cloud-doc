import React from 'react'
import { List, Typography, Tooltip, Button } from 'antd'
import { EditTwoTone, DeleteTwoTone } from '@ant-design/icons'
import './FileList.less'
import PropTypes from 'prop-types'

const FileList = ({
  files = [],
  onFileClick,
  onSaveEdit,
  onFileDelete,
  editingId,
  setEditingId
}) => {
  const onEdit = (id) => {
    setEditingId(id)
  }
  const onEditingChange = (id, val) => {
    const file = files.find((item) => item.id === id)
    onSaveEdit && onSaveEdit(id, val, file.isNew)
    setEditingId('')
    if (!val.trim() && file.isNew) {
      onFileDelete(id)
    }
  }

  return (
    <List
      className='file-list'
      dataSource={files}
      renderItem={(item) => {
        const editStatus = editingId === item.id || item.isNew
        return (
          <List.Item
            className='file-list-item-wrap'
            data-name={item.name}
            data-id={item.id}
          >
            <div className='file-list-item'>
              <div
                className='name'
                onClick={() => onFileClick && onFileClick(item.id)}
              >
                <Tooltip placement='rightTop' title={item.name}>
                  <Typography.Text
                    editable={
                      editStatus
                        ? {
                            editing: true,
                            onChange: (val) => onEditingChange(item.id, val)
                          }
                        : false
                    }
                    ellipsis
                  >
                    {item.name}
                  </Typography.Text>
                </Tooltip>
              </div>
              {!editStatus && (
                <div className='operate-btn'>
                  <Button
                    type='link'
                    icon={<EditTwoTone />}
                    size='small'
                    onClick={() => onEdit(item.id)}
                  ></Button>
                  <Button
                    type='link'
                    onClick={() => onFileDelete && onFileDelete(item.id)}
                    icon={<DeleteTwoTone />}
                    size='small'
                  ></Button>
                </div>
              )}
            </div>
          </List.Item>
        )
      }}
    />
  )
}

FileList.propTypes = {
  files: PropTypes.array,
  onSaveEdit: PropTypes.func,
  onFileClick: PropTypes.func,
  onFileDelete: PropTypes.func,
  editingId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  setEditingId: PropTypes.func
}

export default FileList
