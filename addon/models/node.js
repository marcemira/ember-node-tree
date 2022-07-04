import { tracked } from '@glimmer/tracking';
import { TrackedArray } from 'tracked-built-ins';

export default class Node {
  @tracked childNodes;
  @tracked parentNode;
  @tracked name;

  constructor({ childNodes = [], name = 'Unknown' } = {}) {
    this.childNodes = new TrackedArray(childNodes);
    this.name = name;

    // set parent node on all child nodes
    for (const childNode of this.childNodes) {
      childNode.parentNode = this;
    }
  }
}
