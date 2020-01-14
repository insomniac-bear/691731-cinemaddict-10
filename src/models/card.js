export default class Card {
  constructor(data) {
    this.id = data[`id`];
    this.comments = data[`comments`];
    this.filmInfo = {
      title: data[`film_info`].title,
      alternativeTitle: data[`film_info`].alternative_title,
      totalRating: data[`film_info`].total_rating,
      poster: data[`film_info`].poster,
      ageRating: data[`film_info`].age_rating,
      director: data[`film_info`].director,
      writers: data[`film_info`].writers,
      actors: data[`film_info`].actors,
      release: {
        date: new Date(data[`film_info`].release.date),
        releaseCountry: data[`film_info`].release.release_country,
      },
      runtime: data[`film_info`].runtime,
      genre: data[`film_info`].genre,
      description: data[`film_info`].description,
    };
    this.userDetails = {
      personalRating: data[`user_details`].personal_rating,
      isWatchlist: Boolean(data[`user_details`].watchlist),
      isWatched: Boolean(data[`user_details`].already_watched),
      watchingDate: data[`user_details`].watching_date ? new Date(data[`user_details`].watching_date) : null,
      isFavorite: Boolean(data[`user_details`].favorite),
    };
  }

  toRAW() {
    return {
      'id': this.id,
      'comments': this.comments,
      'film_info': {
        'title': this.filmInfo.title,
        'alternative_title': this.filmInfo.alternativeTitle,
        'total_rating': this.filmInfo.totalRating,
        'poster': this.filmInfo.poster,
        'age_rating': this.filmInfo.ageRating,
        'director': this.filmInfo.director,
        'writers': this.filmInfo.writers,
        'actors': this.filmInfo.actors,
        'release': {
          'date': this.filmInfo.release.date,
          'release_country': this.filmInfo.release.releaseCountry,
        },
        'runtime': this.filmInfo.runtime,
        'genre': this.filmInfo.genre,
        'description': this.filmInfo.description,
      },
      'user_details': {
        'personal_rating': this.userDetails.personalRating,
        'watchlist': this.userDetails.isWatchlist,
        'already_watched': this.userDetails.isWatched,
        'watching_date': this.userDetails.watchingDate,
        'favorite': this.userDetails.isFavorite,
      },
    };
  }

  static parseCard(data) {
    return new Card(data);
  }

  static parseCards(data) {
    return data.map(Card.parseCard);
  }

  static clone(data) {
    return new Card(data.toRAW());
  }
}
