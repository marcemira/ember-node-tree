import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { arg } from 'ember-arg-types';
import { func, any, boolean } from 'prop-types';
import { action } from '@ember/object';

export default class NodeTreeComponent extends Component {
  @arg(any.isRequired)
  nodes;

  @arg(func)
  onSelection;

  @arg(boolean)
  hasContainer = true;

  @tracked selectedNode;

  get nodeTreeAPI () {
    return {
      onSelection: this.handleOnSelection,
      executeAction: this.executeAction
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
  executeAction (actionObject) {
    const node = this.selectedNode;
    const tree = this.nodes;

    actionObject.action(node, tree);
  }
}
