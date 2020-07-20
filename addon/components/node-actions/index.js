import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class NodeActionsComponent extends Component {
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

  @tracked selectedNode;

  constructor() {
    super(...arguments);
    this.actions = [...this.baseActions, this.args.actions];
  }

  @action
  onSelection (node) {
    this.selectedNode = node;

    if (this.args.onSelection && typeof this.args.onSelection === 'function') {
      this.args.onSelection(node);
    }
  }

  @action
  addNode () {
    debugger;
  }

  @action
  removeNode () {
    debugger;
  }
}
