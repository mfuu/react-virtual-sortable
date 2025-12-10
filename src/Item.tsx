import * as React from 'react';
import { isEqual } from './core';
import { ItemProps } from './interface';

function Item(props: ItemProps) {
  const { dataKey, horizontal, dragging, children, onSizeChange } = props;

  const eleRef = React.useRef<HTMLElement>(null);

  React.useLayoutEffect(() => {
    let observer: ResizeObserver | null;
    if (typeof ResizeObserver !== undefined) {
      observer = new ResizeObserver(() => {
        const sizeKey = horizontal ? 'offsetWidth' : 'offsetHeight';
        const size = eleRef.current![sizeKey];
        onSizeChange(dataKey, size);
      });
      eleRef.current && observer?.observe(eleRef.current);
    }
    return () => {
      if (observer) {
        observer.disconnect();
        observer = null;
      }
    };
  }, [eleRef]);

  const itemStyle: React.CSSProperties = React.useMemo(() => {
    const style = children.props.style || {};
    const isDragging = isEqual(dataKey, dragging);

    return { ...style, display: isDragging ? 'none' : '' };
  }, [dragging]);

  return React.cloneElement(children, {
    'data-key': dataKey,
    role: 'item',
    ref: eleRef,
    style: itemStyle,
    className: children.props.className,
  });
}

export default React.memo(Item);
