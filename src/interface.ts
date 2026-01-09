import * as React from 'react';
import type { Group, ScrollSpeed, SortableEvent } from 'sortable-dnd';
import type { Range } from './core';

export type KeyValueType = string | number;

export type EventType = 'onTop' | 'onBottom' | 'onDrag' | 'onDrop' | 'onRangeChange';

export type RenderFunc<T> = (item: T, index: number, key: KeyValueType) => React.ReactElement;

export interface DragEvent<T> {
  key: KeyValueType;
  index: number;
  item: T;
  event: SortableEvent;
}

export interface DropEvent<T> {
  key: KeyValueType;
  list: T[];
  item: T;
  oldList: T[];
  event: SortableEvent;
  changed: boolean;
  oldIndex: number;
  newIndex: number;
}

export interface VirtualProps<T> {
  dataKey: string;
  dataSource: T[];
  children: React.ReactElement | RenderFunc<T>;
  tableMode?: boolean;

  keeps?: number;
  size?: number;
  group?: Group | string;
  handle?: string;
  lockAxis?: 'x' | 'y';
  scroller?: HTMLElement | Document;
  direction?: 'vertical' | 'horizontal';
  debounceTime?: number;
  throttleTime?: number;

  delay?: number;
  disabled?: boolean;
  sortable?: boolean;
  draggable?: string;
  animation?: number;
  keepOffset?: boolean;
  autoScroll?: boolean;
  scrollSpeed?: ScrollSpeed;
  appendToBody?: boolean;
  scrollThreshold?: number;
  delayOnTouchOnly?: boolean;
  dropOnAnimationEnd?: boolean;

  rootTag?: string;
  style?: React.CSSProperties;
  className?: string;
  wrapTag?: string;
  wrapStyle?: React.CSSProperties;
  wrapClass?: string;

  ghostStyle?: React.CSSProperties;
  ghostClass?: string;
  chosenClass?: string;
  placeholderClass?: string;

  header?: React.ReactNode;
  footer?: React.ReactNode;

  onTop?: () => void;
  onBottom?: () => void;
  onDrag?: (event: DragEvent<T>) => void;
  onDrop?: (event: DropEvent<T>) => void;
  onRangeChange?: (range: Range) => void;
}

export interface VirtualComponentRef {
  getSize: (key: KeyValueType) => number;
  getOffset: () => number;
  getClientSize: () => number;
  getScrollSize: () => number;
  scrollToTop: () => void;
  scrollToKey: (key: KeyValueType) => void;
  scrollToIndex: (index: number) => void;
  scrollToOffset: (offset: number) => void;
  scrollToBottom: () => void;
}

export interface ItemProps {
  dataKey: KeyValueType;
  dragging: KeyValueType;
  horizontal: boolean;
  children: React.ReactElement;
  onSizeChange: (key: KeyValueType, size: number) => void;
}
