import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { fadeIn, fadeOut } from 'ember-animated/motions/opacity';
import move from 'ember-animated/motions/move';

export default class NodeComponent extends Component {
  @action
  handleClick () {
    const node = this.args.node;

    node.isExpanded = !node.isExpanded;

    if (this.args.onSelection && typeof this.args.onSelection === 'function') {
      this.args.onSelection(node);
    }
  }

  *transition({ duration, insertedSprites, removedSprites }) {
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
