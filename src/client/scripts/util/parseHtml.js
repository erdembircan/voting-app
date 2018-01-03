const range = document.createRange();
range.setStart(document.body, 0);

export default function parseStr(str) {
  return range.createContextualFragment(str);
}
