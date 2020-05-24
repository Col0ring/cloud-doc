import React from 'react'
import { Tabs } from 'antd'
import './TabList.less'
import classnames from 'classnames'
import { CloseOutlined, InfoCircleOutlined } from '@ant-design/icons'
import PropTypes from 'prop-types'
const { TabPane } = Tabs

const TabList = ({
  files = [],
  activeId,
  unsaveIds = [],
  onCloseTab,
  onTabClick
}) => {
  const onChange = (activeKey) => {
    onTabClick && onTabClick(activeKey)
  }
  return (
    <Tabs
      hideAdd
      onChange={onChange}
      activeKey={String(activeId)}
      type='editable-card'
    >
      {files.map((file) => {
        const withUnsaveMark = unsaveIds.includes(file.id)
        return (
          <TabPane
            tab={
              <span
                className={classnames({
                  'tab-pane-content': true,
                  active: file.id === activeId,
                  'un-save-mark': withUnsaveMark
                })}
              >
                {file.name}
                {withUnsaveMark && (
                  <span className='un-save'>
                    <InfoCircleOutlined />
                  </span>
                )}
                <span
                  className='close'
                  onClick={(e) => {
                    e.stopPropagation()
                    onCloseTab && onCloseTab(file.id)
                  }}
                >
                  <CloseOutlined />
                </span>
              </span>
            }
            key={file.id}
            closable={false}
          ></TabPane>
        )
      })}
    </Tabs>
  )
}

TabList.propTypes = {
  files: PropTypes.array,
  activeId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  unsaveIds: PropTypes.array,
  onCloseTab: PropTypes.func,
  onTabClick: PropTypes.func
}

export default TabList
