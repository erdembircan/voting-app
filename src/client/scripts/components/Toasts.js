import parseHtml from '../util/parseHtml';
import toastTemplate from '../../../server/templates/partials/toast.hbs';
import { setTimeout } from 'timers';

class Toasts {
  constructor(container) {
    this._toastContainer = parseHtml("<div class='toastContainer'></div>").firstChild;
    container.appendChild(this._toastContainer);
  }

  showToast(message) {
    const toast = new Toast(message, this._toastContainer);
    this._toastContainer.appendChild(toast._container);
  }
}

function Toast(message, container) {
  this._container = parseHtml(toastTemplate({ message })).firstChild;

  this._container.addEventListener('animationend', (e) => {
    if (e.animationName === 'disDown') {
      container.removeChild(this._container);
    }
  });
}

export default Toasts;
