import {FilterType} from '../const.js';

export const getWatchlistCards = (cards) => {
  return cards.filter((card) => card.isWatchlist);
};

export const getHistoryCards = (cards) => {
  return cards.filter((card) => card.isWatched);
};

export const getFavoritesCards = (cards) => {
  return cards.filter((card) => card.isFavorite);
};

export const getCardsByFilter = (cards, filterType) => {
  switch (filterType) {
    case FilterType.ALL:
      return cards;
    case FilterType.HISTORY:
      return getHistoryCards(cards);
    case FilterType.WATCHLIST:
      return getWatchlistCards(cards);
    case FilterType.FAVORITES:
      return getFavoritesCards(cards);
  }

  return cards;
};
