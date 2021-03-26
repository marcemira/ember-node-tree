import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { set, action } from '@ember/object';
import { arg } from 'ember-arg-types';
import { any, object, string, number, func } from 'prop-types';

export default class NodeTreeComponent extends Component {
  @arg(any.isRequired)
  nodes;

  @arg(object)
  nodeTreeAPI;

  @arg(number)
  expandToDepth;

  @arg(string)
  defaultIcon;

  @arg(string)
  parentNodeName;

  @arg(string)
  childNodesName;

  @arg(func)
  filterNodesFn;

  @tracked filteredNodes;

  constructor () {
    super(...arguments);

    this.filteredNodes = this.filterNodesFn
      ? this.filterNodesFn(this.nodes)
      : this.nodes;
  }

  @action
  async handleSelection (node) {
    const parent = await node[this.parentNodeName];
    const nodeSelectedInitialState = node.isSelected;
    const rootNode = parent ? await this._findRoot(parent) : node;

    if (rootNode[this.childNodesName]?.length) {
      this._nodeDeselect(node, false);
      this._childrenDeselecting(rootNode[this.childNodesName]);
    }

    this._nodeDeselect(node, !nodeSelectedInitialState, new Date());

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
      this._nodeDeselect(node, false);
    });
  }

  _nodeDeselect(node, value, date) {
    if (!node.isLoading && !node.isEmpty) {
      set(node, 'isSelected', value);

      if (node[this.childNodesName]?.length) {
        this._childrenDeselecting(node[this.childNodesName]);
      }
    }
  }
}
