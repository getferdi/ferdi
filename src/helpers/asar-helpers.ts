export function asarPath(dir: string = '') {
  return dir.replace('app.asar', 'app.asar.unpacked');
}
