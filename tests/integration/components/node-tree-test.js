import { module, test } from 'qunit';
import { setupRenderingTest } from 'dummy/tests/helpers';
import { click, findAll, render } from '@ember/test-helpers';
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

  test('it renders child nodes if @expandToDepth is set', async function (assert) {
    this.nodes = [
      new Node({
        name: 'parent node',
        childNodes: [
          new Node({ name: 'first child node' }),
          new Node({ name: 'second child node' }),
        ],
      }),
    ];

    await render(hbs`
      <NodeTree @nodes={{this.nodes}} as |nt|>
        <nt.Tree @expandToDepth={{2}} />
      </NodeTree>/>
    `);
    assert
      .dom('[data-test-node="parent node"] [data-test-node]')
      .exists({ count: 2 }, 'it renders child nodes for parent node');
    assert
      .dom('[data-test-node="parent node"] [data-test-node="first child node"]')
      .hasTextContaining('first child node', 'it renders name of child node');
    assert.deepEqual(
      findAll('[data-test-node="parent node"] [data-test-node] .name').map(
        (el) => el.innerText
      ),
      ['first child node', 'second child node'],
      'renders child nodes in order of childNodes array'
    );
  });

  test('@onSelection event handler is fired when user clicks on a node', async function (assert) {
    assert.expect(2);

    this.nodeToBeSelected = new Node({ name: 'target node' });
    this.nodes = [new Node({ name: 'other node' }), this.nodeToBeSelected];
    this.onSelection = (selectedNode) => {
      assert.ok('onSelection event handler is fired');
      assert.strictEqual(
        selectedNode,
        this.nodeToBeSelected,
        'provides selected node as first argument'
      );
    };

    await render(hbs`
      <NodeTree @nodes={{this.nodes}} @onSelection={{this.onSelection}} as |nt|>
        <nt.Tree />
      </NodeTree>/>
    `);
    await click('[data-test-node="target node"] .name');
  });

  test('@onSelection event handler is fired when user clicks on a child node', async function (assert) {
    assert.expect(2);

    this.childNodeToBeSelected = new Node({ name: 'target node' });
    this.nodes = [
      new Node({
        name: 'parent node',
        childNodes: [
          this.childNodeToBeSelected,
          new Node({ name: 'another child node' }),
        ],
      }),
    ];
    this.onSelection = (selectedNode) => {
      assert.ok('onSelection event handler is fired');
      assert.strictEqual(
        selectedNode,
        this.childNodeToBeSelected,
        'provides selected node as first argument'
      );
    };

    await render(hbs`
      <NodeTree @nodes={{this.nodes}} @onSelection={{this.onSelection}} as |nt|>
        <nt.Tree @expandToDepth={{1}} />
      </NodeTree>/>
    `);
    await click(
      '[data-test-node="parent node"] [data-test-node="target node"] .name'
    );
  });
});
