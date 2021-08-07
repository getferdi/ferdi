import fs from 'fs-extra';
import { userDataPath } from '../environment';

export function getServicePartitionsDirectory(folders = []) {
  return userDataPath('Partitions', folders);
}

export function removeServicePartitionDirectory(id = '', addServicePrefix = false) {
  const servicePartition = getServicePartitionsDirectory(`${addServicePrefix ? 'service-' : ''}${id}`);

  return fs.remove(servicePartition);
}

export async function getServiceIdsFromPartitions() {
  const files = await fs.readdir(getServicePartitionsDirectory());
  return files.filter((n) => n !== '__chrome_extension');
}
