import Component from '@glimmer/component';
import { arg } from 'ember-arg-types';
import { func, string, any } from 'prop-types';

export default class NodeTreeActionsActionComponent extends Component {
  @arg(func)
  execute;

  @arg(string)
  name;

  @arg(any)
  nodeActions;

  get nodeAction () {
    if (this.nodeActions && this.name) {
      const foundNodeAction = this.nodeActions.find(action => action.name === this.name);

      if (foundNodeAction) {
        return foundNodeAction;
      }
    }

    return this.args.nodeAction;
  }
}
