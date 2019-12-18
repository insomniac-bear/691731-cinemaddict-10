import AbstractComponent from './abstract-component.js';
import {getRandomIntegerNumber} from '../utils/common.js';

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

export default class UserProfile extends AbstractComponent {
  getTemplate() {
    return createUserProfileTemplate();
  }
}
