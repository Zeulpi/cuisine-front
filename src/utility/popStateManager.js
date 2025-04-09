// utils/popstateManager.js
let handlerRef = null;

export const setPopStateHandler = (handler) => {
  handlerRef = handler;
  window.addEventListener('popstate', handlerRef);
};

export const clearPopStateHandler = () => {
  if (handlerRef) {
    window.removeEventListener('popstate', handlerRef);
    handlerRef = null;
  }
};
