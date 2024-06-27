import { GenericError } from "./exception-handler.service"

export const utilsService = {
  mapByKey<K, V>(getKey: (item: V) => K, items: V[]): Map<K, V> {
    return items.reduce((map, item) => {
      const keyValue = getKey(item)

      if (map.has(keyValue)) {
        throw new GenericError(`Duplicate entry for key ${keyValue}`)
      }

      map.set(keyValue, item)
      return map
    }, new Map<K, V>())
  },
}
