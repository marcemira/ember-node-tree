import { fadeIn, fadeOut } from 'ember-animated/motions/opacity';
import move from 'ember-animated/motions/move';

export default function * transition ({ duration, insertedSprites, removedSprites }) {
  for (const sprite of removedSprites) {
    sprite.endTranslatedBy(0, -12);
    move(sprite);
    fadeOut(sprite);
  }

  for (const sprite of insertedSprites) {
    sprite.startTranslatedBy(0, -12);
    move(sprite);
    fadeIn(sprite);
  }
}
