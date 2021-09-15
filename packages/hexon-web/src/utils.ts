export const forceReloadWindow = () => {
  window.onbeforeunload = () => {};
  window.location.reload();
};
