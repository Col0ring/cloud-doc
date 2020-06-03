import React, { useState } from 'react'
import { Modal } from 'antd'
import FileSearch from '@/components/FileSearch/FileSearch'
import PropTypes from 'prop-types'

const GlobalFileSearch = ({ visible = false, onSearch, onCancel }) => {
  const [value, setValue] = useState('')

  const _onSearch = (...args) => {
    onSearch(...args)
    onCancel && onCancel()
  }
  const onClosed = () => {
    setValue('')
  }

  return (
    <Modal
      destroyOnClose
      width={400}
      title='搜索'
      mask={false}
      centered
      visible={visible}
      footer={null}
      afterClose={onClosed}
      onCancel={onCancel}
    >
      <FileSearch
        onFileSearch={_onSearch}
        value={value}
        setValue={setValue}
        autoFocus
      />
    </Modal>
  )
}

GlobalFileSearch.propTypes = {
  visible: PropTypes.bool,
  onSearch: PropTypes.func,
  onCancel: PropTypes.func
}

export default GlobalFileSearch
