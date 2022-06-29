import { module, test } from 'qunit';
import { setupRenderingTest } from 'dummy/tests/helpers';
import { click, findAll, render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import Node from 'ember-node-tree/models/node';

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

  module('select a node', function () {
    test('user can select and unselect a node', async function (assert) {
      this.nodeToBeSelected = new Node({ name: 'target node' });
      this.nodes = [new Node({ name: 'other node' }), this.nodeToBeSelected];

      await render(hbs`
        <NodeTree @nodes={{this.nodes}} @onSelection={{this.onSelection}} as |nt|>
          <nt.Tree />
        </NodeTree>/>
      `);
      assert
        .dom('[data-test-node="target node"] > div')
        .hasAttribute('data-is-selected', 'false');

      await click('[data-test-node="target node"] .name');
      assert
        .dom('[data-test-node="target node"] > div')
        .hasAttribute('data-is-selected', 'true');

      await click('[data-test-node="target node"] .name');
      assert
        .dom('[data-test-node="target node"] > div')
        .hasAttribute('data-is-selected', 'false');
    });

    test('user can select and unselect a child node', async function (assert) {
      this.nodeToBeSelected = new Node({ name: 'target node' });
      this.nodes = [new Node({ name: 'other node' }), this.nodeToBeSelected];

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

      await render(hbs`
        <NodeTree @nodes={{this.nodes}} @onSelection={{this.onSelection}} as |nt|>
          <nt.Tree @expandToDepth={{1}} />
        </NodeTree>/>
      `);
      assert
        .dom('[data-test-node="target node"] > div')
        .hasAttribute('data-is-selected', 'false');

      await click('[data-test-node="target node"] .name');
      assert
        .dom('[data-test-node="target node"] > div')
        .hasAttribute('data-is-selected', 'true');

      await click('[data-test-node="target node"] .name');
      assert
        .dom('[data-test-node="target node"] > div')
        .hasAttribute('data-is-selected', 'false');
    });

    test('unselecting a parent node, does not change selection change of child nodes', async function (assert) {
      this.nodeToBeSelected = new Node({
        name: 'target node',
        childNodes: [
          new Node({ name: 'first child node' }),
          new Node({ name: 'second child node' }),
        ],
      });
      this.nodes = [new Node({ name: 'other node' }), this.nodeToBeSelected];

      await render(hbs`
        <NodeTree @nodes={{this.nodes}} @onSelection={{this.onSelection}} as |nt|>
          <nt.Tree @expandToDepth={{1}} />
        </NodeTree>/>
      `);

      // act: select some nodes
      await click('[data-test-node="target node"] .name');
      await click('[data-test-node="first child node"] .name');
      await click('[data-test-node="other node"] .name');

      // assert: nodes are selected
      for (const nodeName of [
        'target node',
        'first child node',
        'other node',
      ]) {
        assert
          .dom(`[data-test-node="${nodeName}"] > div`)
          .hasAttribute('data-is-selected', 'true');
      }

      // assert: other nodes are not selected
      assert
        .dom('[data-test-node="second child node"] > div')
        .hasAttribute('data-is-selected', 'false');

      await click('[data-test-node="target node"] .name');
      for (const nodeName of ['target node', 'second child node']) {
        assert
          .dom(`[data-test-node="${nodeName}"] > div`)
          .hasAttribute('data-is-selected', 'false');
      }
      for (const nodeName of ['first child node', 'other node']) {
        assert
          .dom(`[data-test-node="${nodeName}"] > div`)
          .hasAttribute('data-is-selected', 'true');
      }
    });

    test('selecting a parent node does not unselect previously selected child nodes', async function (assert) {
      this.nodes = [
        new Node({
          name: 'parent node',
          childNodes: [new Node({ name: 'child node' })],
        }),
      ];

      await render(hbs`
        <NodeTree @nodes={{this.nodes}} @onSelection={{this.onSelection}} as |nt|>
          <nt.Tree @expandToDepth={{1}} />
        </NodeTree>/>
      `);
      await click('[data-test-node="child node"] .name');
      assert
        .dom('[data-test-node="child node"] > div')
        .hasAttribute('data-is-selected', 'true', 'child node is selected');

      await click('[data-test-node="parent node"] .name');
      assert
        .dom('[data-test-node="parent node"] > div')
        .hasAttribute('data-is-selected', 'true', 'parent node is selected');
      assert
        .dom('[data-test-node="child node"] > div')
        .hasAttribute(
          'data-is-selected',
          'true',
          'child node is still selected'
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

  module('expand a node', function () {
    test('user can collapse and expand a node', async function (assert) {
      this.nodes = [
        new Node({
          name: 'target node',
          childNodes: [new Node()],
        }),
      ];

      await render(hbs`
        <NodeTree @nodes={{this.nodes}} as |nt|>
          <nt.Tree @expandToDepth={{1}} />
        </NodeTree>/>
      `);
      assert
        .dom('[data-test-node="target node"] > div')
        .hasAttribute(
          'data-test-is-expanded',
          'true',
          'node is expanded by default'
        );

      await click('[data-test-node="target node"] [role="button"]');
      assert
        .dom('[data-test-node="target node"] > div')
        .hasAttribute(
          'data-test-is-expanded',
          'false',
          'user can collapse node'
        );

      await click('[data-test-node="target node"] [role="button"]');
      assert
        .dom('[data-test-node="target node"] > div')
        .hasAttribute(
          'data-test-is-expanded',
          'true',
          'user can expand node again'
        );
    });
  });
});
