import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { get, set, action } from '@ember/object';
import { fadeIn, fadeOut } from 'ember-animated/motions/opacity';
import move from 'ember-animated/motions/move';
import { arg } from 'ember-arg-types';
import { object, string, func } from 'prop-types';
import { htmlSafe } from '@ember/string';

const NODE_PARENT_NODE_PROPERTY_NAME = 'parentNode';
const NODE_CHILD_NODE_PROPERTY_NAME = 'childNodes';
const NODE_DEPTH_LEFT_PADDING_AMOUNT = 1;
const NODE_DEPTH_LEFT_PADDING_UNIT = 'rem'

export default class NodeComponent extends Component {
  @arg(object.isRequired)
  node;

  @arg(func)
  onSelection;

  @arg(string)
  parentNodeName = NODE_PARENT_NODE_PROPERTY_NAME;

  @arg(string)
  childNodesName = NODE_CHILD_NODE_PROPERTY_NAME;

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

  get computedStyle () {
    const depth = this.nodeDepth;
    const computedDepth = depth * NODE_DEPTH_LEFT_PADDING_AMOUNT

    return htmlSafe(`padding-left: ${computedDepth}${NODE_DEPTH_LEFT_PADDING_UNIT};`);
  }

  @action
  handleClick () {
    set(this.node, 'isExpanded', !this.node.isExpanded);

    if (this.onSelection) {
      this.onSelection(this.node);
    }
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
