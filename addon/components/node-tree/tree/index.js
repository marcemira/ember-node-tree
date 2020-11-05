import Component from '@glimmer/component';
import { set, action } from '@ember/object';
import { arg } from 'ember-arg-types';
import { object, string, number } from 'prop-types';
import {
  NODE_PARENT_NODE_PROPERTY_NAME,
  NODE_CHILD_NODE_PROPERTY_NAME
} from 'ember-node-tree/utils/default-settings';

export default class NodeTreeComponent extends Component {
  @arg(object)
  nodeTreeAPI;

  @arg(string)
  parentNodeName = NODE_PARENT_NODE_PROPERTY_NAME;

  @arg(string)
  childNodesName = NODE_CHILD_NODE_PROPERTY_NAME;

  @arg(number)
  expandToDepth;

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

    if (this.nodeTreeAPI) {
      this.nodeTreeAPI.onSelection(node);
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
