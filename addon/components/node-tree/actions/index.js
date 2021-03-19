import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import { action, set } from '@ember/object';
import { arg } from 'ember-arg-types';
import { sort } from '@ember/object/computed';
import { any, func, string, boolean, array, node, object } from 'prop-types';
import { assert } from '@ember/debug';

export default class NodeTreeActionsComponent extends Component {
  @service store;

  @arg(any.isRequired)
  nodes;

  @arg(object)
  selectedNode;

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

  @arg(object.isRequired)
  nodeTreeAPI;

  @arg(string)
  nodeModelName;

  @arg(string)
  parentNodeName;

  @arg(string)
  childNodesName;

  @arg(array)
  additionalActions = [];

  @arg(object)
  customOrder;

  @arg(boolean)
  hasCustomPlacement = false;

  nodeActionsSorting = ['order'];

  baseActions = [
    {
      title: 'Add',
      name: 'add',
      icon: 'add',
      action: this.addNode,
      order: 0,
    },
    {
      title: 'Remove',
      name: 'remove',
      icon: 'remove',
      action: this.removeNode,
      order: 1,
    },
  ];

  @sort('nodeActions', 'nodeActionsSorting') sortedNodeActions;

  constructor () {
    super(...arguments);

    if (this.additionalActions) {
      this._checkAdditionalActions();
    }

    if (this.customOrder) {
      this._checkCustomOrder(this.nodeActions);
    }
  }

  get nodeActions () {
    let nodeActions = [
      ...this.baseActions,
      ...this.additionalActions
    ];

    if (this.customOrder) {
      for (const actionName in this.customOrder) {
        const action = nodeActions.find(nodeAction =>
          nodeAction.name === actionName
        );

        set(action, 'order', this.customOrder[actionName]);
      }
    }

    return nodeActions;
  }

  get isNoneSelected () {
    return !this.selectedNode;
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

    if (!this.hasCustomPlacement) {
      parentNode[this.childNodesName].pushObject(newNode);
    }

    parentNode.isExpanded = true;

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

    this.nodeTreeAPI.deselectNode();
  }

  _removeChildNodes(parentNode) {
    if (parentNode) {
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

  _checkAdditionalActions() {
    for (const action of this.additionalActions) {
      try {
        assert('Action must have a name', typeof action.name === 'string');
        assert('Action must have an icon', typeof action.icon === 'string');
        assert('Action must have a title', typeof action.title === 'string');
        assert('Action must have a order', typeof action.order === 'number');
        assert('Action must have a function', typeof action.action === 'function');
      } catch (failedAssertion) {
        console.error(action, failedAssertion);
      }
    }
  }

  _checkCustomOrder(nodeActions) {
    try {
      for (const nodeAction of nodeActions) {
        for (const order in this.customOrder) {
          assert(`Must define an order for \`${nodeAction.name}\` action, on customOrder object argument`, this.customOrder.hasOwnProperty(nodeAction.name));
        }
      }
    } catch (failedAssertion) {
      console.error(action, failedAssertion);
    }
  }
}
