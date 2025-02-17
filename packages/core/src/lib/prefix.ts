export const addPrefix = (prefix: string, path: string) => {
  return `${prefix}__${path}`
}

export const removePrefix = (prefix: string, path: string) => {
  return path.replace(prefix + '__', '')
}
