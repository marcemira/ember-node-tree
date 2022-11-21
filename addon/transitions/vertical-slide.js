import { fadeIn, fadeOut } from 'ember-animated/motions/opacity';
import move from 'ember-animated/motions/move';

export default function * transition({ insertedSprites, removedSprites }) {
  for (const sprite of removedSprites) {
    yield sprite.endTranslatedBy(0, -12);
    move(sprite);
    fadeOut(sprite);
  }

  for (const sprite of insertedSprites) {
    yield sprite.startTranslatedBy(0, -12);
    move(sprite);
    fadeIn(sprite);
  }
}
