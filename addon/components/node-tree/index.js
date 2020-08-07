import Component from '@glimmer/component';
import { action } from '@ember/object';
import { arg } from 'ember-arg-types';
import { object } from 'prop-types';

export default class NodeTreeComponent extends Component {
  @arg(object)
  actionsAPI;

  @action
  async handleSelection (node) {
    const parent = await node.parentNode;
    const nodeSelectedInitialState = node.isSelected;
    const rootNode = parent ? await this._findRoot(parent) : node;

    if (rootNode.childNodes?.length) {
      rootNode.isSelected = false;
      this._childrenDeselecting(rootNode.childNodes);
    }

    node.isSelected = !nodeSelectedInitialState;

    if (this.actionsAPI) {
      this.actionsAPI.onSelection(node);
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
