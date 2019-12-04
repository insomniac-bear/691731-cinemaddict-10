const createNavigationMarkup = (navigation, isActive) => {
  const {name, count} = navigation;

  return (
    `<a href="#watchlist" class="main-navigation__item ${isActive ? `main-navigation__item--active` : ``}">
      ${name}${(name !== `All movies`) ? `<span class="main-navigation__item-count"> ${count}</span>` : ``}
    </a>`
  );
};

export const siteNavigationTemplate = (navigations) => {
  const navigationsMarkup = navigations.map((it, i) => createNavigationMarkup(it, i === 0)).join(`\n`);
  return (`
    <nav class="main-navigation">
      ${navigationsMarkup}
    </nav>
  `);
};
