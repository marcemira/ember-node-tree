import Component from '@glimmer/component';
// eslint-disable-next-line ember/no-computed-properties-in-native-classes
import { action, computed, defineProperty } from '@ember/object';
import { arg } from 'ember-arg-types';
import { any, object, string, number, func } from 'prop-types';
import verticalSlide from 'ember-node-tree/transitions/vertical-slide';
import { TrackedWeakSet } from 'tracked-built-ins';
import { helper } from '@ember/component/helper';

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

  transition = verticalSlide;
  expandedNodes = new TrackedWeakSet();
  collapsedNodes = new TrackedWeakSet();
  selectedNodes = new TrackedWeakSet();

  get shouldExpandNodes() {
    return !!this.expandToDepth;
  }

  constructor() {
    super(...arguments);

    defineProperty(
      this,
      'filteredNodes',
      computed(
        `nodes.${this.parentNodeName}`,
        `nodes.@each.${this.childNodesName}`,
        'filterNodesFn',
        'filteredNodesFn',
        'nodes',
        // eslint-disable-next-line ember/no-arrow-function-computed-properties
        () => {
          return this.filterNodesFn
            ? this.filterNodesFn(this.nodes)
            : this.nodes;
        }
      )
    );
  }

  @action
  async handleSelection(node) {
    const parent = await node[this.parentNodeName];
    const nodeSelectedInitialState = this.selectedNodes.has(node);
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

  @action
  expandNode(node) {
    this.expandedNodes.add(node);
    this.collapsedNodes.delete(node);
  }

  @action
  collapseNode(node) {
    this.collapsedNodes.add(node);
    this.expandedNodes.delete(node);
  }

  async _findRoot(node) {
    const parentNode = await node[this.parentNodeName];

    if (parentNode) {
      return this._findRoot(parentNode);
    }

    return node;
  }

  _childrenDeselecting(nodes) {
    nodes.forEach((node) => {
      this._nodeDeselect(node, false);
    });
  }

  _nodeDeselect(node, value) {
    if (!node.isLoading && !node.isEmpty) {
      if (value) {
        this.selectedNodes.add(node);
      } else {
        this.selectedNodes.delete(node);
      }

      if (node[this.childNodesName]?.length) {
        this._childrenDeselecting(node[this.childNodesName]);
      }
    }
  }

  isNodeExpanded = helper(([node]) => {
    return this.expandedNodes.has(node)
      ? true
      : this.collapsedNodes.has(node)
      ? false
      : this.shouldExpandNodes;
  });

  isNodeSelected = helper(([node]) => {
    return this.selectedNodes.has(node);
  });
}
