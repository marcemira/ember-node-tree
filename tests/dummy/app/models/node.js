export default class Node {
  childNodes;
  name;

  constructor({ childNodes, name }) {
    this.childNodes = childNodes ?? [];
    this.name = name ?? 'Unknown';
  }
}
