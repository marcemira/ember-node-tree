import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { arg } from 'ember-arg-types';
import { any, func, string, boolean, array } from 'prop-types';

const NODE_MODEL_NAME = 'node';
const NODE_PARENT_NODE_PROPERTY_NAME = 'parentNode';
const NODE_CHILD_NODE_PROPERTY_NAME = 'childNodes';

export default class NodeActionsComponent extends Component {
  @service store;

  @arg(any.isRequired)
  nodes;

  @arg(func)
  onSelection;

  @arg(func)
  onBeforeAdd;

  @arg(func)
  onAdd;

  @arg(func)
  onBeforeRemove;

  @arg(func)
  onRemove;

  @arg(boolean)
  useEDS = true;

  @arg(string)
  nodeModelName = NODE_MODEL_NAME;

  @arg(string)
  parentNodeName = NODE_PARENT_NODE_PROPERTY_NAME;

  @arg(string)
  childNodesName = NODE_CHILD_NODE_PROPERTY_NAME;

  @arg(array)
  additionalActions = [];

  @tracked selectedNode;
  @tracked nodeActions;

  baseActions = [
    {
      name: 'Add',
      icon: 'add',
      action: this.addNode,
    },
    {
      name: 'Remove',
      icon: 'remove',
      action: this.removeNode,
    },
  ];

  constructor() {
    super(...arguments);
    this.nodeActions = [...this.baseActions, ...this.additionalActions];
  }

  get noneSelected () {
    return !this.selectedNode;
  }

  get API () {
    return {
      onSelection: this.handleOnSelection
    };
  }

  @action
  handleOnSelection (node) {
    this.selectedNode = node === this.selectedNode ? null : node;

    if (this.onSelection) {
      this.onSelection(node);
    }
  }

  @action
  execute (actionObject) {
    const node = this.selectedNode;
    const tree = this.nodes;

    actionObject.action(node, tree);
  }

  @action
  async addNode (parentNode) {
    let newNode;

    if (this.onBeforeAdd) {
      newNode = await this.onBeforeAdd(parentNode);

      if (!newNode) {
        return;
      }
    } else {
      newNode = {
        name: 'newNode'
      };

      if (this.useEDS) {
        newNode = this.store.createRecord(this.nodeModelName, newNode);
      }
    }

    parentNode[this.childNodesName].pushObject(newNode);

    if (this.onAdd) {
      this.onAdd(newNode);
    }
  }

  @action
  async removeNode (node, tree) {
    if (this.onBeforeRemove) {
      const shouldContinue = await this.onBeforeRemove(node);

      if (!shouldContinue) {
        return;
      }
    }

    const childNodes = await node[this.childNodesName];

    if (childNodes && childNodes.length) {
      this._removeChildNodes(node);
    }

    const parentNode = await node[this.parentNodeName];

    if (this.onRemove) {
      this.onRemove(node);
    } else {
      if (parentNode) {
        parentNode[this.childNodesName].removeObject(node);
      }
    }

    this.selectedNode = null;
  }

  _removeChildNodes(parentNode) {
    if(parentNode) {
      const childNodes = parentNode[this.childNodesName] || null;

      if (childNodes && childNodes.length) {
        childNodes.forEach(node => {
          this._removeChildNodes(node);

          if (this.onRemove) {
            this.onRemove(node);
          } else {
            parentNode[this.childNodesName].removeObject(node);
          }
        });
      }
    }
  }
}
