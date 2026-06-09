## `onTop`

scrolled to the top of list

## `onBottom`

scrolled to the bottom of list

## `onScroll`

scroll event

```ts
const {
  top,
  bottom,
  offset,
  direction,
} = scrollEvent
```

## `onDrag`

drag is started

```ts
const {
  item,
  key,
  index,
  event,
} = dragEvent
```

## `onDrop`

drag is completed

```ts
const {
  key,
  item,
  list,
  event,
  changed,
  oldList,
  oldIndex,
  newIndex,
} = dropEvent
```
