import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Input } from 'antd'
const { Search } = Input
const FileSearch = ({ btnText, onFileSearch, value, setValue }) => {
  const [loading, setLoading] = useState(false)
  const [oldValue, setOldValue] = useState('')

  const onSearch = (value) => {
    if (oldValue === value) {
      return
    }
    setOldValue(value)
    onFileSearch && onFileSearch(value, setLoading, setValue)
  }
  return (
    <Search
      value={value}
      placeholder='请输入搜索内容'
      enterButton={btnText ? btnText : true}
      allowClear
      loading={loading}
      onSearch={onSearch}
      onChange={(e) => setValue(e.target.value)}
    />
  )
}

FileSearch.propTypes = {
  btnText: PropTypes.string,
  value: PropTypes.string,
  setValue: PropTypes.func,
  onFileSearch: PropTypes.func
}

export default FileSearch
