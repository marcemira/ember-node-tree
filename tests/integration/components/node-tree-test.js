import { module, test } from 'qunit';
import { setupRenderingTest } from 'dummy/tests/helpers';
import { findAll, render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import Node from 'dummy/models/node';

module('Integration | Component | node-tree', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders a list of nodes', async function (assert) {
    this.nodes = [
      new Node({ name: 'first node' }),
      new Node({ name: 'second node' }),
    ];

    await render(hbs`
      <NodeTree @nodes={{this.nodes}} as |nt|>
        <nt.Tree />
      </NodeTree>/>
    `);
    assert.dom('[data-test-node]').exists({ count: 2 }, 'renders all nodes');
    assert
      .dom('[data-test-node="first node"]')
      .hasTextContaining('first node', 'renders name of node');
    assert.deepEqual(
      findAll('[data-test-node] .name').map((el) => el.innerText),
      ['first node', 'second node'],
      'renders nodes in order of @nodes array'
    );
  });
});
