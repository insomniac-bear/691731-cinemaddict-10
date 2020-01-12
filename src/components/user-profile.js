import AbstractComponent from './abstract-component.js';
import {UserRank} from '../const.js';

export const generateUserRank = (userStatus) => {
  if (userStatus <= 0) {
    return ``;
  } else if (userStatus >= 1 && userStatus <= 10) {
    return UserRank.NOVICE;
  } else if (userStatus >= 11 && userStatus <= 20) {
    return UserRank.FAN;
  } else {
    return UserRank.MOVIE_BUFF;
  }
};

const createUserProfileTemplate = (userStatistic) => {
  const userRank = generateUserRank(userStatistic);
  return (
    `<section class="header__profile profile">
      <p class="profile__rating">${userRank}</p>
      <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
    </section>`
  );
};

export default class UserProfile extends AbstractComponent {
  constructor(userStatistic) {
    super();

    this._userStatistic = userStatistic;
  }

  getTemplate() {
    return createUserProfileTemplate(this._userStatistic);
  }
}
