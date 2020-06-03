import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Input } from 'antd'
const { Search } = Input
const FileSearch = ({
  btnText,
  onFileSearch,
  value,
  setValue,
  autoFocus = false
}) => {
  const [loading, setLoading] = useState(false)

  const onSearch = (v) => {
    onFileSearch && onFileSearch(v, setLoading)
  }
  return (
    <Search
      value={value}
      placeholder='请输入搜索内容'
      enterButton={btnText ? btnText : true}
      allowClear
      autoFocus={autoFocus}
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
  onFileSearch: PropTypes.func,
  autoFocus: PropTypes.bool
}

export default FileSearch
