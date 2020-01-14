import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import AbstractSmartComponent from './abstract-smart-component.js';
import {UserRank, FilterType} from '../const.js';
import {getCardsByFilter} from '../utils/filter.js';

const getAllTimesOfMovies = (movies) => {
  return movies.reduce((acc, it) => acc + it.filmInfo.runtime, 0);
};

const generateUserRank = (countOfWatchedFilms) => {
  if (countOfWatchedFilms <= 0) {
    return ``;
  } else if (countOfWatchedFilms >= 1 && countOfWatchedFilms <= 10) {
    return UserRank.NOVICE;
  } else if (countOfWatchedFilms >= 11 && countOfWatchedFilms <= 20) {
    return UserRank.FAN;
  } else {
    return UserRank.MOVIE_BUFF;
  }
};

const getAllGenres = (films) => {
  const genresList = new Set();
  films.forEach((film) => {
    film.filmInfo.genre.forEach((genre) => {
      genresList.add(genre);
    });
  });

  return Array.from(genresList);
};

const calcGenre = (films, genre) => {
  const filmOfGenre = [];
  films.forEach((film) => {
    const styles = Array.from(film.filmInfo.genre);
    if (styles.some((it) => it === genre)) {
      filmOfGenre.push(film);
    }
  });

  return filmOfGenre.length;
};

const renderBar = (barCtx, cards) => {
  const watchedFilms = getCardsByFilter(cards.getCardsAll(), FilterType.HISTORY);
  const allGenere = getAllGenres(watchedFilms).map((it) => {
    return {
      name: it,
      count: calcGenre(watchedFilms, it),
    };
  });

  allGenere.sort((a, b) => {
    return b.count - a.count;
  });

  const legend = allGenere.map((it) => it.name);
  const count = allGenere.map((it) => it.count);

  return new Chart(barCtx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: legend,
      datasets: [{
        data: count,
        backgroundColor: `#ffe800`,
        borderColor: `#ffe800`,
        barPercentage: 0.6,
      }],
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 22,
          },
          color: `#ffffff`,
          anchor: `start`,
          align: `start`,
          offset: 10,
        },
      },
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true,
            display: true,
            fontColor: `#ffffff`,
            fontSize: 22,
            padding: 30,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
        }],
        xAxes: [{
          ticks: {
            beginAtZero: true,
            display: false,
          },
          gridLines: {
            display: false,
          },
        }],
      },
      legend: {
        display: false,
      },
      tooltips: {
        enabled: false,
      },
    }
  });
};

const createStatisticTemplate = ({cards}) => {
  const watchedFilms = getCardsByFilter(cards, FilterType.HISTORY);
  const moviesCount = watchedFilms.length;
  const totalFilmDuration = getAllTimesOfMovies(watchedFilms);
  const allGenere = getAllGenres(watchedFilms).map((it) => {
    return {
      name: it,
      count: calcGenre(watchedFilms, it),
    };
  });

  allGenere.sort((a, b) => {
    return b.count - a.count;
  });

  return (
    `<section class="statistic">
      <p class="statistic__rank">
        Your rank
        <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
        <span class="statistic__rank-label">${generateUserRank(watchedFilms.length)}</span>
      </p>

      <form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
        <p class="statistic__filters-description">Show stats:</p>

        <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-all-time" value="all-time" checked>
        <label for="statistic-all-time" class="statistic__filters-label">All time</label>

        <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-today" value="today">
        <label for="statistic-today" class="statistic__filters-label">Today</label>

        <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-week" value="week">
        <label for="statistic-week" class="statistic__filters-label">Week</label>

        <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-month" value="month">
        <label for="statistic-month" class="statistic__filters-label">Month</label>

        <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-year" value="year">
        <label for="statistic-year" class="statistic__filters-label">Year</label>
      </form>

      <ul class="statistic__text-list">
        <li class="statistic__text-item">
          <h4 class="statistic__item-title">You watched</h4>
          <p class="statistic__item-text">${moviesCount} <span class="statistic__item-description">movies</span></p>
        </li>
        <li class="statistic__text-item">
          <h4 class="statistic__item-title">Total duration</h4>
          <p class="statistic__item-text">${Math.trunc(totalFilmDuration / 60)} <span class="statistic__item-description">h</span> ${totalFilmDuration % 60} <span class="statistic__item-description">m</span></p>
        </li>
        <li class="statistic__text-item">
          <h4 class="statistic__item-title">Top genre</h4>
          <p class="statistic__item-text">${allGenere[0].name}</p>
        </li>
      </ul>

      <div class="statistic__chart-wrap">
        <canvas class="statistic__chart" width="1000"></canvas>
      </div>

    </section>`
  );
};

export default class Statistics extends AbstractSmartComponent {
  constructor({cards}) {
    super();

    this._cards = cards;

    this._barChart = null;
  }

  getTemplate() {
    return createStatisticTemplate({cards: this._cards.getCardsAll()});
  }

  show() {
    super.show();

    this._renderChart();
  }

  _renderChart() {
    const element = this.getElement();

    const chartCtx = element.querySelector(`.statistic__chart`);
    this._barChart = renderBar(chartCtx, this._cards);
  }

  _resetChart() {
    if (this._barChart) {
      this._barChart.destroy();
      this._barChart = null;
    }
  }
}
