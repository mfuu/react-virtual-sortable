```jsx
import * as React from 'react';
import VirtualList from '@/index';
import { getPageData } from '../public/sentence';
import '../global.less';

const Header = () => {
  return (
    <thead style={{ position: 'sticky', top: 0, zIndex: 1 }}>
      <tr>
        <th style={{ width: '15%' }}>index</th>
        <th style={{ width: '25%' }}>name</th>
        <th style={{ width: '60%' }}>content</th>
      </tr>
    </thead>
  )
}

function Virtual() {

  const [list, setList] = React.useState(getPageData(1000, 0));

  const handleDrop = (params) => {
    setList(() => params.list);
  }

  return (
    <VirtualList
      dataKey="id"
      dataSource={list}
      onDrop={handleDrop}
      handle=".handle"
      tableMode={true}
      header={Header()}
      chosenClass="chosen"
      className="virtual-table"
    >
      {
        (item, index, dataKey) => {
          return (
            <tr>
              <td>
                <span className="index">#{ item.index }</span>
                <span className="handle">☰</span>
              </td>
              <td>{ item.name }</td>
              <td>{ item.desc }</td>
            </tr>
          )
        }
      }
    </VirtualList>
  )
}

export default Virtual;
```
