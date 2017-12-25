window.onload = () => {
  window.onunload = () => {
    window.opener.location.reload();
  };
  window.close();
};
