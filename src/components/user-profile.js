import {createElement} from '../util.js';
import {getRandomIntegerNumber} from '../util.js';

const generateUserStatus = () => {
  return getRandomIntegerNumber(0, 100);
};


const createUserProfileTemplate = () => {
  const userStatus = generateUserStatus();
  return (
    `<section class="header__profile profile">
      <p class="profile__rating">${userStatus}</p>
      <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
    </section>`
  );
};

export default class UserProfile {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createUserProfileTemplate();
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
