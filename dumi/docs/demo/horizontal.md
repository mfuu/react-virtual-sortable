```jsx
import * as React from 'react';
import VirtualList from '@/index';
import { getPageData } from '../public/sentence';
import '../global.less';

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
      direction="horizontal"
      chosenClass="chosen"
      className="horizontal-list"
      wrapStyle={{ display: 'flex' }}
    >
      {
        (item, index, dataKey) => {
          return (
            <div className="list-item">
              <div className="item-title">
                <span className="index">#{ item.index }</span>
                <span className="handle">☰</span>
              </div>
              <p>{ item.desc }</p>
            </div>
          )
        }
      }
    </VirtualList>
  )
}

export default Virtual;
```
