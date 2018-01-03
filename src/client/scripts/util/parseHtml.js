const range = document.createRange();

export default function parseHtml(str, start = document.body) {
  range.setStart(start, 0);
  return range.createContextualFragment(str);
}
