export const forceReloadWindow = () => {
  if (window.__UNIT_TESTING__) {
    return;
  }

  window.onbeforeunload = () => {};
  window.location.reload();
};
export function sortString(a, b) {
  return a.toLowerCase().localeCompare(b.toLowerCase());
}
export function array2dToArray1d(arr) {
  return arr.reduce((pre, cur) => pre.concat(cur), []);
}
export function fakeId() {
  return "fake" + new Date().valueOf();
}
