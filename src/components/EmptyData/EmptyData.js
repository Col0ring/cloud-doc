import React from 'react'
import { Empty, Button } from 'antd'
import './EmptyData.less'
import empty from '@/assets/images/empty.svg'
import PropTypes from 'prop-types'
const EmptyData = ({ onCreateFile }) => {
  return (
    <div className='empty-container'>
      <Empty
        image={empty}
        imageStyle={{
          height: 60
        }}
        description={<span>选择或创建新的 MarkDown 文档</span>}
      >
        <Button type='primary' onClick={onCreateFile}>
          新建
        </Button>
      </Empty>
    </div>
  )
}

EmptyData.propTypes = {
  onCreateFile: PropTypes.func
}

export default EmptyData
