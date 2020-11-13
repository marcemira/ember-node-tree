import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { arg } from 'ember-arg-types';
import { func, any, boolean, object, string } from 'prop-types';
import { action } from '@ember/object';
import { htmlSafe } from '@ember/template';
import {
  THEME_VARIABLES,
  NODE_MODEL_NAME,
  NODE_PARENT_NODE_PROPERTY_NAME,
  NODE_CHILD_NODE_PROPERTY_NAME,
} from 'ember-node-tree/utils/default-settings';

export default class NodeTreeComponent extends Component {
  @arg(any.isRequired)
  nodes;

  @arg(func)
  onSelection;

  @arg(boolean)
  hasContainer = true;

  @arg(object)
  theme;

  @arg(string)
  nodeModelName = NODE_MODEL_NAME;

  @arg(string)
  parentNodeName = NODE_PARENT_NODE_PROPERTY_NAME;

  @arg(string)
  childNodesName = NODE_CHILD_NODE_PROPERTY_NAME;

  @tracked selectedNode;

  nodeTreeAPI = {
    onSelection: this.handleOnSelection,
    executeAction: this.executeAction,
    deselectNode: this.deselectNode
  };

  get computedStyles () {
    if (this.theme) {
      const appliedVariables = [];

      if (this.theme.primaryColor) {
        appliedVariables.push({ [THEME_VARIABLES['primaryColor']]: this.theme.primaryColor });
      }
      if (this.theme.textColor) {
        appliedVariables.push({ [THEME_VARIABLES['textColor']]: this.theme.textColor });
      }
      if (this.theme.uiColor) {
        appliedVariables.push({ [THEME_VARIABLES['uiColor']]: this.theme.uiColor });
      }
      if (this.theme.uiBackground) {
        appliedVariables.push({ [THEME_VARIABLES['uiBackground']]: this.theme.uiBackground });
      }
      if (this.theme.disabledTextColor) {
        appliedVariables.push({ [THEME_VARIABLES['disabledTextColor']]: this.theme.disabledTextColor });
      }
      if (this.theme.selectedBackground) {
        appliedVariables.push({ [THEME_VARIABLES['selectedBackground']]: this.theme.selectedBackground });
      }
      if (this.theme.selectedTextColor) {
        appliedVariables.push({ [THEME_VARIABLES['selectedTextColor']]: this.theme.selectedTextColor });
      }
      if (this.theme.hiddenBackground) {
        appliedVariables.push({ [THEME_VARIABLES['hiddenBackground']]: this.theme.hiddenBackground });
      }
      if (this.theme.hiddenTextColor) {
        appliedVariables.push({ [THEME_VARIABLES['hiddenTextColor']]: this.theme.hiddenTextColor });
      }

      return htmlSafe(appliedVariables.reduce((styles, themeVariable) => {
        const prop = Object.keys(themeVariable)[0];
        const value = themeVariable[prop];

        return `${styles}
        ${prop}: ${value};`;
      }, ''));
    }

    return;
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

  @action
  deselectNode () {
    this.selectedNode = null;
  }
}
