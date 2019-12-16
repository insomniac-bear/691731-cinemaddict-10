import AbstractComponent from './abstract-component.js';

const contentTemplate = () => {
  return (
    `<section class="films">
    </section>`
  );
};

export default class Films extends AbstractComponent {
  getTemplate() {
    return contentTemplate();
  }
}

