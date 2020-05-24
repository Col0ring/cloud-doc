export function flattenArr(arr) {
  return arr.reduce((pre, next) => {
    pre[next.id] = next
    return pre
  }, {})
}

export function obj2Arr(obj) {
  return Object.keys(obj).map((key) => obj[key])
}

export function getParentNode(node, parentClassName) {
  let current = node
  while (current !== null) {
    if (current.classList && current.classList.contains(parentClassName)) {
      return current
    }
    current = current.parentNode
  }
  return false
}
