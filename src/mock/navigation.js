const navigationName = [
  `All movies`, `Watchlist`, `History`, `Favorites`
];

const generateNavigation = () => {
  return navigationName.map((it) => {
    return {
      name: it,
      count: Math.floor(Math.random() * 15),
    };
  });
};

export {generateNavigation};
