import Controller from '@ember/controller';
import Node from '../models/node';

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
