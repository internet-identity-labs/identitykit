export const openPopup = (url: string, windowName: string, width: number, height: number) => {
  const y = window.top!.outerHeight / 2 + window.top!.screenY - height / 2
  const x = window.top!.outerWidth / 2 + window.top!.screenX - width / 2
  return window.open(
    url,
    windowName,
    `toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=${width}, height=${height}, top=${y}, left=${x}`
  ) as Window
}
