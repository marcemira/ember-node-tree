import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { arg } from 'ember-arg-types';
import { any, func } from 'prop-types';

export default class NodeActionsComponent extends Component {
  @arg(any.isRequired)
  nodes;

  @arg(func)
  onSelection;

  @arg(func)
  onAdd;

  @arg(func)
  onRemove;

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
    this.nodeActions = [...this.baseActions, this.args.actions];
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
  addNode (node, tree) {
    debugger;
  }

  @action
  removeNode (node, tree) {
    debugger;
  }
}
