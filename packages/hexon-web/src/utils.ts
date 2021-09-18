export const forceReloadWindow = () => {
  window.onbeforeunload = () => {};
  window.location.reload();
};
export const DEV = process.env.NODE_ENV !== "production";
