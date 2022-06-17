import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
// import faker from '@faker-js/faker';

class Node {
  childNodes;
  @tracked isExpanded = false;
  name;

  constructor({ childNodes, name }) {
    this.childNodes = childNodes ?? [];
    this.name = name ?? 'Unknown';
  }
}

export default class IndexController extends Controller {
  nodes = [
    new Node({
      name: '15',
      childNodes: [new Node({ name: '5' }), new Node({ name: '3' })],
    }),
    new Node({
      name: '12',
      childNodes: [
        new Node({
          name: '4',
          childNodes: [new Node({ name: '2' }), new Node({ name: '2' })],
        }),
        new Node({ name: '3' }),
      ],
    }),
    new Node({
      name: '10',
      childNodes: [new Node({ name: '5' }), new Node({ name: '2' })],
    }),
    new Node({
      name: '9',
      childNodes: [new Node({ name: '3' }), new Node({ name: '3' })],
    }),
    new Node({
      name: '8',
      childNodes: [
        new Node({ name: '2' }),
        new Node({ name: '2' }),
        new Node({ name: '2' }),
      ],
    }),
    new Node({
      name: '6',
      childNodes: [new Node({ name: '3' }), new Node({ name: '2' })],
    }),
    new Node({
      name: '5',
    }),
    new Node({
      name: '4',
      childNodes: [new Node({ name: '2' }), new Node({ name: '2' })],
    }),
    new Node({ name: '3' }),
    new Node({ name: '2' }),
  ];
}
