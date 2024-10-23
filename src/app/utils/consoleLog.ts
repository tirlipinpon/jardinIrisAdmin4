export function consoleLog(message: string, obj: any) {
  console.log(message + " = " + JSON.stringify(obj, null, 2))
}
