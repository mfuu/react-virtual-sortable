import * as React from 'react';
import { getDataKey } from '../core';
import { KeyValueType, RenderFunc } from '../interface';
import Item from '../Item';

interface Props<T> {
  list: T[];
  start: number;
  end: number;
  dataKey: string;
  dragging: KeyValueType;
  horizontal: boolean;
  children: React.ReactElement | RenderFunc<T>;
  onSizeChange: (key: KeyValueType, size: number) => void;
}

function useChildren<T>(props: Props<T>) {
  const { list, start, end, dataKey, horizontal, dragging, children, onSizeChange } = props;

  return React.useMemo(() => {
    return list.slice(start, end + 1).map((item, i) => {
      const index = start + i;
      const key = getDataKey(item, dataKey);

      return (
        <Item
          key={key}
          dataKey={key}
          dragging={dragging}
          horizontal={horizontal}
          onSizeChange={onSizeChange}>
          {typeof children === 'function' ? children(item, index, key) : children}
        </Item>
      );
    });
  }, [list, start, end, dataKey, horizontal, dragging, children]);
}

export default useChildren;
