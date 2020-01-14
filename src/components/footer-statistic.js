import AbstractComponent from './abstract-component.js';

const footerStatisticTemplate = (statistic) => {
  return (
    `<section class="footer__statistics">
      <p>${statistic} movies inside</p>
    </section>`
  );
};

export default class FooterStatistic extends AbstractComponent {
  constructor({cards}) {
    super();

    this._statistic = cards.getCardsAll().length;
  }

  getTemplate() {
    return footerStatisticTemplate(this._statistic);
  }
}
