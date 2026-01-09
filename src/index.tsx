import * as React from 'react';
import {
  debounce,
  getDataKey,
  isEqual,
  VirtualSortable,
  type DragEvent,
  type DropEvent,
  type Options,
  type Range,
  type ScrollEvent,
} from './core';
import useChildren from './hooks/useChildren';
import useCombine from './hooks/useCombine';
import type { EventType, KeyValueType, VirtualComponentRef, VirtualProps } from './interface';

let draggingItem;

function VirtualList<T>(props: VirtualProps<T>, ref: React.ForwardedRef<VirtualComponentRef>) {
  const {
    dataKey = '',
    dataSource = [],
    tableMode = false,

    wrapTag = 'div',
    rootTag = 'div',

    style = {},
    className = '',
    wrapStyle = {},
    wrapClass = '',

    size = undefined,
    keeps = 30,
    scroller = undefined,
    direction = 'vertical',
    debounceTime = 0,
    throttleTime = 0,

    delay = 0,
    group = '',
    handle = '',
    lockAxis = undefined,
    disabled = false,
    sortable = true,
    draggable = '[role="item"]',
    animation = 150,
    autoScroll = true,
    scrollSpeed = { x: 10, y: 10 },
    ghostClass = '',
    ghostStyle = undefined,
    chosenClass = '',
    placeholderClass = '',
    appendToBody = false,
    scrollThreshold = 55,
    delayOnTouchOnly = false,
    dropOnAnimationEnd = true,
  } = props;

  const [range, setRange] = React.useState<Range>({
    start: 0,
    end: keeps - 1,
    front: 0,
    behind: 0,
  });

  const dragging = React.useRef<KeyValueType>('');
  const rootElRef = React.useRef<HTMLElement>();
  const wrapElRef = React.useRef<HTMLElement>();

  /**
   * git item size by data-key
   */
  const getSize = (key: KeyValueType) => {
    return VS.current!.call('getSize', key);
  };

  /**
   * Get the current scroll height
   */
  const getOffset = () => {
    return VS.current!.call('getOffset');
  };

  /**
   * Get client viewport size
   */
  const getClientSize = () => {
    return VS.current!.call('getClientSize');
  };

  /**
   * Get all scroll size
   */
  const getScrollSize = () => {
    return VS.current!.call('getScrollSize');
  };

  /**
   * Scroll to the specified offset
   */
  const scrollToOffset = (offset: number) => {
    VS.current!.call('scrollToOffset', offset);
  };

  /**
   * Scroll to the specified index position
   */
  const scrollToIndex = (index: number, align?: 'top' | 'bottom' | 'auto') => {
    VS.current!.call('scrollToIndex', index, align);
  };

  /**
   * Scroll to the specified data-key position
   */
  const scrollToKey = (key: KeyValueType, align?: 'top' | 'bottom' | 'auto') => {
    const index = uniqueKeys.current.indexOf(key);
    if (index > -1) {
      VS.current!.call('scrollToIndex', index, align);
    }
  };

  /**
   * Scroll to top of list
   */
  const scrollToTop = () => {
    scrollToOffset(0);
  };

  /**
   * Scroll to bottom of list
   */
  const scrollToBottom = () => {
    VS.current!.call('scrollToBottom');
  };

  React.useImperativeHandle(ref, () => ({
    getSize,
    getOffset,
    getClientSize,
    getScrollSize,
    scrollToTop,
    scrollToKey,
    scrollToIndex,
    scrollToOffset,
    scrollToBottom,
  }));

  // ========================================== data source ==========================================
  const list = React.useRef<T[]>([]);
  const uniqueKeys = React.useRef<KeyValueType[]>([]);
  const lastListLength = React.useRef<number>(0);
  const listLengthWhenTopLoading = React.useRef<number>(0);

  React.useEffect(() => {
    list.current = dataSource;

    updateUniqueKeys();
    detectRangeChange(lastListLength.current, dataSource.length);

    // if auto scroll to the last offset
    if (listLengthWhenTopLoading.current && props.keepOffset) {
      const index = dataSource.length - listLengthWhenTopLoading.current;
      if (index > 0) {
        VS.current?.call('scrollToIndex', index);
      }
      listLengthWhenTopLoading.current = 0;
    }

    lastListLength.current = dataSource.length;
  }, [dataSource]);

  React.useEffect(() => {
    initVirtualSortable();

    return () => {
      VS.current!.destroy();
    };
  }, []);

  const updateUniqueKeys = () => {
    uniqueKeys.current = list.current.map((item) => getDataKey(item, dataKey));
    VS.current?.option('uniqueKeys', uniqueKeys.current);
  };

  const detectRangeChange = (oldListLength: number, newListLength: number) => {
    if (oldListLength === newListLength) {
      return;
    }

    let newRange = { ...range };
    if (
      oldListLength > keeps &&
      newListLength > oldListLength &&
      newRange.end === oldListLength - 1 &&
      VS.current?.call('isReachedBottom')
    ) {
      newRange.start++;
    }

    VS.current?.call('updateRange', newRange);
  };

  const dispatchEvent = (
    name: keyof VirtualProps<T> & EventType,
    ...args: Parameters<NonNullable<VirtualProps<T>[keyof VirtualProps<T> & EventType]>>
  ) => {
    const handler = props[name];
    handler && handler.apply(null, args);
  };

  // ========================================== virtual sortable ==========================================
  const VS = React.useRef<VirtualSortable<KeyValueType>>();

  const combinedAttrs = {
    // virtual attrs
    size,
    keeps,
    scroller,
    direction,
    debounceTime,
    throttleTime,
    // sortable attrs
    delay,
    group,
    handle,
    lockAxis,
    disabled,
    sortable,
    draggable,
    animation,
    autoScroll,
    ghostClass,
    ghostStyle: ghostStyle as Partial<CSSStyleDeclaration>,
    chosenClass,
    scrollSpeed,
    appendToBody,
    scrollThreshold,
    delayOnTouchOnly,
    placeholderClass,
    dropOnAnimationEnd,
  };

  const initVirtualSortable = () => {
    VS.current = new VirtualSortable<KeyValueType>(rootElRef.current as HTMLElement, {
      ...combinedAttrs,
      buffer: Math.round(keeps / 3),
      wrapper: wrapElRef.current!,
      scroller: scroller || rootElRef.current!,
      uniqueKeys: uniqueKeys.current,
      ghostContainer: wrapElRef.current!,
      onDrag,
      onDrop,
      onScroll,
      onUpdate,
    });
  };

  useCombine(combinedAttrs, () => {
    if (!VS.current) return;

    Object.keys(combinedAttrs).forEach((key) => {
      if (props[key] !== void 0) {
        VS.current!.option(key as keyof Options<KeyValueType>, props[key]);
      }
    });
  });

  const handleToTop = debounce(() => {
    listLengthWhenTopLoading.current = list.current.length;
    dispatchEvent('onTop');
  }, 50);

  const handleToBottom = debounce(() => {
    dispatchEvent('onBottom');
  }, 50);

  const onScroll = (event: ScrollEvent) => {
    listLengthWhenTopLoading.current = 0;
    if (event.top) {
      handleToTop();
    } else if (event.bottom) {
      handleToBottom();
    }
  };

  const onUpdate = (range: Range, changed: boolean) => {
    setRange(range);

    changed && dispatchEvent('onRangeChange', range);
  };

  const onSizeChange = (key: KeyValueType, size: number) => {
    // ignore changes for dragging element
    if (isEqual(key, dragging.current) || !VS.current) {
      return;
    }

    const sizes = VS.current.virtual.sizes.size;
    VS.current.call('updateItemSize', key, size);

    if (sizes === keeps - 1 && list.current.length > keeps) {
      VS.current.call('updateRange', range);
    }
  };

  const onDrag = (event: DragEvent<KeyValueType>) => {
    const { key, index } = event;
    const item = list.current[index];

    dragging.current = key;
    draggingItem = item;

    if (!sortable) {
      VS.current?.call('enableScroll', false);
      VS.current?.option('autoScroll', false);
    }

    dispatchEvent('onDrag', { ...event, item });
  };

  const onDrop = (event: DropEvent<KeyValueType>) => {
    const item = draggingItem;
    const { oldIndex, newIndex } = event;

    const oldList = [...list.current];
    const newList = [...list.current];

    if (oldIndex === -1) {
      newList.splice(newIndex, 0, item);
    } else if (newIndex === -1) {
      newList.splice(oldIndex, 1);
    } else {
      newList.splice(oldIndex, 1);
      newList.splice(newIndex, 0, item);
    }

    VS.current!.call('enableScroll', true);
    VS.current!.option('autoScroll', props.autoScroll);

    dragging.current = '';

    dispatchEvent('onDrop', { ...event, item, list: newList, oldList });
  };

  // ========================================== layout ==========================================
  const { rootElStyle, wrapElStyle } = React.useMemo(() => {
    const { front, behind } = range;
    const isHorizontal = direction === 'horizontal';

    const overflow = isHorizontal ? 'auto hidden' : 'hidden auto';
    const padding = isHorizontal ? `0px ${behind}px 0px ${front}px` : `${front}px 0px ${behind}px`;

    const rootElStyle: React.CSSProperties = {
      ...style,
      overflow: tableMode || scroller ? '' : overflow,
    };
    const wrapElStyle: React.CSSProperties = {
      ...wrapStyle,
      padding: tableMode ? '' : padding,
    };

    return {
      rootElStyle,
      wrapElStyle,
    };
  }, [range, style, wrapStyle, scroller, tableMode, direction]);

  const { rootElTag, wrapElTag } = React.useMemo(() => {
    const rootElTag = tableMode ? 'table' : wrapTag;
    const wrapElTag = tableMode ? 'tbody' : wrapTag;

    return {
      rootElTag,
      wrapElTag,
    };
  }, [rootTag, wrapTag, tableMode]);

  const listChildren = useChildren({
    list: dataSource,
    start: range.start,
    end: range.end,
    dataKey,
    children: props.children,
    dragging: dragging.current,
    horizontal: direction === 'horizontal',
    onSizeChange,
  });

  const TableSpacer = (offset: number, key: string) => {
    const offsetKey = direction === 'vertical' ? 'height' : 'width';
    const style = { padding: 0, border: 0, [offsetKey]: `${offset}px` };
    return (
      <tr key={key}>
        <td style={style}></td>
      </tr>
    );
  };

  return React.createElement(
    rootElTag,
    {
      ref: rootElRef,
      style: rootElStyle,
      className,
    },
    [
      props.header,
      React.createElement(
        wrapElTag,
        {
          ref: wrapElRef,
          style: wrapElStyle,
          className: wrapClass,
        },
        [
          tableMode && TableSpacer(range.front, 'front'),
          ...listChildren,
          tableMode && TableSpacer(range.behind, 'behind'),
        ]
      ),
      props.footer,
    ]
  );
}

export default React.forwardRef(VirtualList) as <T>(
  props: VirtualProps<T> & { ref?: React.ForwardedRef<VirtualComponentRef> }
) => ReturnType<typeof VirtualList>;
