import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { get, set, action } from '@ember/object';
import { fadeIn, fadeOut } from 'ember-animated/motions/opacity';
import move from 'ember-animated/motions/move';
import { arg } from 'ember-arg-types';
import { htmlSafe } from '@ember/string';
import { object, string, func, number } from 'prop-types';
import { next } from '@ember/runloop';
import {
  NODE_DEPTH_LEFT_PADDING_AMOUNT,
  NODE_DEPTH_LEFT_PADDING_UNIT
} from 'ember-node-tree/utils/default-settings';

export default class NodeTreeNodeComponent extends Component {
  @arg(object.isRequired)
  node;

  @arg(func)
  onSelection;

  @arg(string)
  parentNodeName;

  @arg(string)
  childNodesName;

  @arg(number)
  expandToDepth;

  @arg(string)
  customNodeComponent;

  @arg(string)
  defaultIcon;

  constructor () {
    super(...arguments);

    if (this.expandToDepth) {
      next(this, () => {
        const depth = this.nodeDepth;

        if (depth <= this.expandToDepth) {
          this.node.isExpanded = true;
        }
      });
    }
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
    const depth = this.nodeDepth;
    const computedDepth = depth * NODE_DEPTH_LEFT_PADDING_AMOUNT

    return htmlSafe(`padding-left: ${computedDepth}${NODE_DEPTH_LEFT_PADDING_UNIT};`);
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

  * transition({ duration, insertedSprites, removedSprites }) {
    for (let sprite of removedSprites) {
      sprite.endTranslatedBy(0, -12);
      move(sprite);
      fadeOut(sprite);
    }

    for (let sprite of insertedSprites) {
      sprite.startTranslatedBy(0, -12);
      move(sprite);
      fadeIn(sprite);
    }
  }
}
