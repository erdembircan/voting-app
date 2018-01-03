const range = document.createRange();
range.setStart(document.body, 0);

export default function parseHtml(str) {
  return range.createContextualFragment(str);
}
