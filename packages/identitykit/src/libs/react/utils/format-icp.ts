const ICP_DECIMALS = 8

function countDecimals(value: number) {
  if (Math.floor(value) === value) return 0

  const str = value.toString()
  if (str.indexOf(".") !== -1 && str.indexOf("-") !== -1) {
    return Number(str.split("-")[1])
  } else if (str.indexOf(".") !== -1) {
    return Number(str.split(".")[1].length)
  }

  return Number(str.split("-")[1])
}

export function formatIcp(value: number): string {
  if (!value) return value.toString()
  const decimals = countDecimals(value)
  const formattedValue = value.toFixed(decimals > ICP_DECIMALS ? ICP_DECIMALS : decimals)
  if (!Number(formattedValue)) return "0"
  return formattedValue
}
