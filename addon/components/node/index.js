import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { fadeIn, fadeOut } from 'ember-animated/motions/opacity';
import move from 'ember-animated/motions/move';
import { arg } from 'ember-arg-types';
import { object, func } from 'prop-types';

export default class NodeComponent extends Component {
  @arg(object.isRequired)
  node;

  @arg(func)
  onSelection;

  @action
  handleClick () {
    this.node.isExpanded = !this.node.isExpanded;

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
