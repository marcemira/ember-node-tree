import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class NodeTreeComponent extends Component {
  @action
  async handleSelection (node) {
    const parent = await node.parentNode;
    const rootNode =  parent ? await this._findRoot(parent) : node;

    if (rootNode.childNodes?.length) {
      rootNode.isSelected = false;
      this._childrenDeselecting(rootNode.childNodes);
    }

    node.isSelected = !node.isSelected;

    if (this.args.onSelection && typeof this.args.onSelection === 'function') {
      this.args.onSelection(node);
    }
  }

  async _findRoot(node) {
    const parentNode = await node.parentNode;

    if (parentNode) {
      return this._findRoot(parentNode);
    }

    return node;
  }

  _childrenDeselecting(nodes) {
    nodes.forEach(node => {
      node.isSelected = false;

      if (node.childNodes?.length) {
        this._childrenDeselecting(node.childNodes);
      }
    });
  }
}
