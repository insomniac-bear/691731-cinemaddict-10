export const getRandomIntegerNumber = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const getRandomArrayItem = (array) => {
  const randomIndex = getRandomIntegerNumber(0, array.length - 1);

  return array[randomIndex];
};

export const setFilter = (array, value) => {
  const filteredArray = array.slice();

  switch (value) {
    case `Sort by date`:
      filteredArray.sort((a, b) => {
        if (b.filmDate.year - a.filmDate.year === 0 && b.filmDate.month - a.filmDate.month !== 0) {
          return b.filmDate.month - a.filmDate.month;
        } else if (b.filmDate.year - a.filmDate.year === 0 && b.filmDate.month - a.filmDate.month === 0) {
          return b.filmDate.day - a.filmDate.day;
        } else {
          return b.filmDate.year - a.filmDate.year;
        }
      });
      break;
    case `Sort by rating`:
      filteredArray.sort((a, b) => {
        if (b.filmRating - a.filmRating === 0) {
          return b.coomentsCount - a.commentsCount;
        } else {
          return b.filmRating - a.filmRating;
        }
      });
      break;
    case `Sort by comment count`:
      filteredArray.sort((a, b) => {
        if (b.commentsCount - a.commentsCount === 0) {
          return b.filmRating - a.filmRating;
        } else {
          return b.commentsCount - a.commentsCount;
        }
      });
      break;
    default:
      break;
  }

  return filteredArray;
};

export const clearElements = (parrentElement, deletedElements) => {
  for (let i = 0; i < deletedElements.length; i++) {
    parrentElement.removeChild(deletedElements[i]);
  }
};

export const setFormatDate = (date) => {
  if (date < 10) {
    return `0${date}`;
  } else {
    return `${date}`;
  }
};

export const RenderPosition = {
  AFTERBEGIN: `afterbegin`,
  BEFOREEND: `beforeend`,
};

export const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;

  return newElement.firstChild;
};

export const render = (container, element, place) => {
  switch (place) {
    case RenderPosition.AFTERBEGIN:
      container.prepend(element);
      break;
    case RenderPosition.BEFOREEND:
      container.append(element);
      break;
  }
};
