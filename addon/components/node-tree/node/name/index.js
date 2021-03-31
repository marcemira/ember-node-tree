import Component from '@glimmer/component';
import {tracked} from '@glimmer/tracking';
import {action} from '@ember/object';
import {arg} from 'ember-arg-types';
import {string} from 'prop-types';

const WORD_SCROLL_DURATION = 0.10;  // Expressed in seconds
const RIGHT_SCROLL_PADDING = 16;    // Expressed in pixels

export default class NodeTreeNodeNameComponent extends Component {
  @arg(string)
  name;

  @tracked nameElement;
  @tracked shouldScroll = false;
  @tracked scrollAmount;
  @tracked scrollDuration;

  @action
  setupElement (element) {
    this.nameElement = element.firstElementChild
    const parentElement = element.parentElement;

    const elementWidth = element.clientWidth;
    const nameWidth = this.nameElement.clientWidth
    const nameLength = this.name?.length || 0

    this.shouldScroll = elementWidth < nameWidth;
    this.scrollAmount = (nameWidth - elementWidth + RIGHT_SCROLL_PADDING) * -1;
    this.scrollDuration = nameLength * WORD_SCROLL_DURATION;
  }

  @action
  mouseover () {
    if (this.shouldScroll) {
      this.nameElement.style.transitionDelay = '0.5s';
      this.nameElement.style.transitionDuration = `${this.scrollDuration}s`;
      this.nameElement.style.transform = `translateX(${this.scrollAmount}px)`;
    }
  }

  @action
  mouseout () {
    if (this.shouldScroll) {
      this.nameElement.style.transitionDelay = '0s';
      this.nameElement.style.transitionDuration = '0.5s';
      this.nameElement.style.transform = `translateX(0)`;
    }
  }
}
