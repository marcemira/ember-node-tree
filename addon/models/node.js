import { TrackedArray } from 'tracked-built-ins';

export default class Node {
  childNodes;
  name;

  constructor({ childNodes, name } = {}) {
    this.childNodes = childNodes ?? new TrackedArray();
    this.name = name ?? 'Unknown';
  }
}
