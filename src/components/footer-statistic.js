import AbstractComponent from './abstract-component.js';

const footerStatisticTemplate = (statistic) => {
  return (
    `<section class="footer__statistics">
      <p>${statistic} movies inside</p>
    </section>`
  );
};

export default class FooterStatistic extends AbstractComponent {
  constructor(statistic) {
    super();

    this._statistic = statistic;
  }

  getTemplate() {
    return footerStatisticTemplate(this._statistic);
  }
}
