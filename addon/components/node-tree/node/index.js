import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { get, set, action } from '@ember/object';
import { arg } from 'ember-arg-types';
import { htmlSafe } from '@ember/string';
import { object, string, func, number } from 'prop-types';
import { next } from '@ember/runloop';
import {
  NODE_DEPTH_LEFT_PADDING_BASE,
  NODE_DEPTH_LEFT_PADDING_AMOUNT,
  NODE_DEPTH_LEFT_PADDING_UNIT
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

  transition = verticalSlide
  constructor () {
    super(...arguments);
    this.processExpandToDepth();
  }

  get nodeDepth () {
    let parent = get(this.node, this.parentNodeName);
    let depth = 0;

    if (parent) {
      while (get(parent, this.parentNodeName)) {
        parent = get(parent, this.parentNodeName);
        depth ++;
      }
    }

    return depth;
  }

  get icon () {
    return this.node.icon || this.defaultIcon;
  }

  get computedStyle () {
    const depth = this.nodeDepth -1;
    const hasDepth = depth > 0;

    let paddingAmount = NODE_DEPTH_LEFT_PADDING_BASE;

    if (hasDepth) {
      paddingAmount = depth * (paddingAmount + NODE_DEPTH_LEFT_PADDING_AMOUNT);
    }

    return htmlSafe(`padding-left: ${paddingAmount}${NODE_DEPTH_LEFT_PADDING_UNIT};`);
  }

  get shouldDisplayChildNodes () {
    if (this.filterNodesFn) {
      const filteredChildNodes = this.filterNodesFn(this.node.childNodes);
      const existentNodesAfterFilter = filteredChildNodes.length > 0 ? true : false;

      return existentNodesAfterFilter;
    }

    return this.node.childNodes.length && this.node.isExpanded;
  }

  async processExpandToDepth () {
    if (this.expandToDepth) {
      const depth = this.nodeDepth;

      if (depth <= this.expandToDepth) {
        if(this.node.isLoading || this.node.isEmpty) {
          this.node.on('ready', () => {
            set(this.node, 'isExpanded', true);
          });
        } else {
          set(this.node, 'isExpanded', true);
        }
      }
    }
  }

  @action
  handleRowClick () {
    if (this.onSelection) {
      this.onSelection(this.node);
    }
  }

  @action
  handleExpand () {
    set(this.node, 'isExpanded', !this.node.isExpanded);
  }


    }
  }
}
