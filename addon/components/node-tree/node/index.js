import Component from '@glimmer/component';
import { get, action } from '@ember/object';
import { arg } from 'ember-arg-types';
import { htmlSafe } from '@ember/template';
import { object, string, func, number } from 'prop-types';
import {
  NODE_DEPTH_LEFT_PADDING_BASE,
  NODE_DEPTH_LEFT_PADDING_AMOUNT,
  NODE_DEPTH_LEFT_PADDING_UNIT,
  DEFAULT_ARROW_TOGGLE_ICON
} from 'ember-node-tree/utils/default-settings';
import verticalSlide from 'ember-node-tree/transitions/vertical-slide';

export default class NodeTreeNodeComponent extends Component {
  @arg(object.isRequired)
  node;

  @arg(func)
  onSelection;

  @arg(number)
  expandToDepth;

  @arg(string)
  customNodeComponent;

  @arg(string)
  customRowClass;

  @arg(string)
  defaultIcon;

  @arg(object)
  nodeTreeAPI;

  @arg(string)
  nodeModelName;

  @arg(string)
  parentNodeName;

  @arg(string)
  childNodesName;

  @arg(func)
  filterNodesFn;

  @arg(string)
  arrowToggleIcon = DEFAULT_ARROW_TOGGLE_ICON;

  transition = verticalSlide;

  get nodeDepth() {
    let parent = get(this.node, this.parentNodeName);
    let depth = 0;

    if (parent) {
      while (get(parent, this.parentNodeName)) {
        parent = get(parent, this.parentNodeName);
        depth++;
      }
    }

    return depth;
  }

  get icon() {
    return this.node.icon || this.defaultIcon;
  }

  get computedStyle() {
    const depth = this.nodeDepth;
    const hasDepth = depth > 0;

    let paddingAmount = NODE_DEPTH_LEFT_PADDING_BASE;

    if (hasDepth) {
      paddingAmount = depth * (paddingAmount + NODE_DEPTH_LEFT_PADDING_AMOUNT);
    }

    return htmlSafe(
      `padding-left: ${paddingAmount}${NODE_DEPTH_LEFT_PADDING_UNIT};`
    );
  }

  get hasChildNodes() {
    const childNodes = this.args.node[this.args.childNodesName];

    if (!childNodes) {
      return false;
    }

    const filterChildNodes = this.args.filterNodesFn
      ? this.args.filterNodesFn(childNodes)
      : childNodes;

    return filterChildNodes.length > 0;
  }

  @action
  handleRowClick() {
    if (this.onSelection) {
      this.onSelection(this.node);
    }
  }

  @action
  handleExpand() {
    if (this.args.isExpanded) {
      this.args.onCollapseNode(this.args.node);
    } else {
      this.args.onExpandNode(this.args.node);
    }
  }
}
