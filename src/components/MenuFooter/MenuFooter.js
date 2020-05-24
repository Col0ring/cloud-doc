import React from 'react'
import { Button } from 'antd'
import { ImportOutlined, FileAddOutlined } from '@ant-design/icons'
import './MenuFooter.less'
import PropTypes from 'prop-types'
const MenuFooter = ({ onCreateFile, onImportFiles }) => {
  return (
    <div className='menu-footer-container'>
      <div>
        <Button
          icon={<FileAddOutlined />}
          block
          type='primary'
          onClick={() => onCreateFile && onCreateFile()}
        >
          新建
        </Button>
      </div>
      <div>
        <Button
          block
          icon={<ImportOutlined />}
          onClick={() => onImportFiles && onImportFiles()}
        >
          导入
        </Button>
      </div>
    </div>
  )
}
MenuFooter.propTypes = {
  onCreateFile: PropTypes.func,
  onImportFiles: PropTypes.func
}
export default MenuFooter
