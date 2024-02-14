export function hasChildren(item) {
  return (item.items.length > 0);
}

export function hasItems(item) {
  const { items: children } = item;

  if (children === undefined) {
    return false;
  }
  if (children.constructor !== Array) {
    return false;
  }
  if (children.length === 0) {
    return false;
  }
  return true;
}
