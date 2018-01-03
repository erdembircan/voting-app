import Toasts from './components/Toasts';

class IndexController {
  constructor(containerId) {
    this._container = document.querySelector(containerId);
    this._toasts = new Toasts(this._container);
  }

  showToast(message) {
    this._toasts.showToast(message);
  }
}

export default IndexController;
