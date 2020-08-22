import Component from '@glimmer/component';
import { set, action } from '@ember/object';
import { arg } from 'ember-arg-types';
import { object, string } from 'prop-types';

const NODE_PARENT_NODE_PROPERTY_NAME = 'parentNode';
const NODE_CHILD_NODE_PROPERTY_NAME = 'childNodes';

export default class NodeTreeComponent extends Component {
  @arg(object)
  actionsAPI;

  @arg(string)
  parentNodeName = NODE_PARENT_NODE_PROPERTY_NAME;

  @arg(string)
  childNodesName = NODE_CHILD_NODE_PROPERTY_NAME;

  @action
  async handleSelection (node) {
    const parent = await node[this.parentNodeName];
    const nodeSelectedInitialState = node.isSelected;
    const rootNode = parent ? await this._findRoot(parent) : node;

    if (rootNode[this.childNodesName]?.length) {
      set(rootNode, 'isSelected', false);
      this._childrenDeselecting(rootNode[this.childNodesName]);
    }

    set(node, 'isSelected', !nodeSelectedInitialState);

    if (this.actionsAPI) {
      this.actionsAPI.onSelection(node);
    }
  }

  async _findRoot(node) {
    const parentNode = await node[this.parentNodeName];

    if (parentNode) {
      return this._findRoot(parentNode);
    }

    return node;
  }

  _childrenDeselecting(nodes) {
    nodes.forEach(node => {
      if (!node.isLoading) {
        set(node, 'isSelected', false);

        if (node[this.childNodesName]?.length) {
          this._childrenDeselecting(node[this.childNodesName]);
        }
      }
    });
  }
}
