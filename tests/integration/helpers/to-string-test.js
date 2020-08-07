import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Helper | to-string', function (hooks) {
  setupRenderingTest(hooks);

  test('it converts any value to a string', async function (assert) {
    await render(hbs`{{to-string this.value}}`);

    this.set('value', 'string');
    assert.dom().hasText('string');

    this.set('value', 1);
    assert.dom().hasText('1');

    this.set('value', true);
    assert.dom().hasText('true');

    this.set('value', null);
    assert.dom().hasText('null');

    this.set('value', undefined);
    assert.dom().hasText('undefined');
  });
});
