```jsx
import * as React from 'react';
import VirtualList from '@/index';
import { getPageData } from '../public/sentence';
import '../global.less';

function Virtual() {
  const virtualRef = React.useRef(null);

  const [list, setList] = React.useState(getPageData(1000, 0));
  const [index, setIndex] = React.useState(20);
  const [align, setAlign] = React.useState('top');

  const handleDrop = (params) => {
    setList(() => params.list);
  }

  const handleChange = (e) => {
    const value = event.target.value;
    index.current = value;
  }

  const scrollToIndex = () => {
    virtualRef.current.scrollToIndex(index, align);
  }

  const stopPropagation = (e) => {
    e.stopPropagation();
  }

  return (
    <div>
      <button onClick={() => scrollToIndex()}>
        scroll to
        <input
          value={index}
          type="number"
          pattern="[0-9]*"
          onChange={(e) => setIndex(e.target.value)}
          onClick={stopPropagation}
        />
        align:
        <select
          value={align}
          onChange={(e) => setAlign(e.target.value)}
          onClick={stopPropagation}
        >
          <option value="top">top</option>
          <option value="bottom">bottom</option>
          <option value="auto">auto</option>
        </select>
      </button>
      <VirtualList
        ref={virtualRef}
        dataKey="id"
        dataSource={list}
        onDrop={handleDrop}
        handle=".handle"
        chosenClass="chosen"
        className="virtual-list"
      >
        {
          (record, index, dataKey) => {
            return (
              <div className="list-item">
                <div className="item-title">
                  <span className="index">#{ record.index }</span>
                  <span className="handle">☰</span>
                </div>
                <p>{ record.desc }</p>
              </div>
            )
          }
        }
      </VirtualList>
    </div>
  )
}

export default Virtual;
```
