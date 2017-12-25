window.onload = () => {
  document.querySelectorAll('#popUp').forEach((item) => {
    item.addEventListener('click', (e) => {
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      const popUpWidth = 600;
      const popUpHeight = 300;
      window.open(
        '/login',
        'Sign in with Twitter',
        `width=${popUpWidth},height=${popUpHeight}, top=${(windowHeight - popUpHeight) /
          2}, left=${(windowWidth - popUpWidth) / 2}`,
      );
      return false;
    });
  });
};
