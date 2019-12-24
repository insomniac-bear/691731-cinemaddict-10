import AbstractComponent from './abstract-component.js';

export default class AbstractSmartComponent extends AbstractComponent {
  recoveryListeners() {
    throw new Error(`Abstract method not implemented: recoveryListener`);
  }

  render() {
    const oldElemment = this.getElement();
    const parent = oldElemment.parentElement;

    this.removeElement();

    const newElement = this.getElement();

    parent.replaceChild(newElement, oldElemment);

    this.recoveryListeners();
  }
}
