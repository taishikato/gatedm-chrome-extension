export const getDomList = () => {
  const dom = document.querySelector('[href="/finereli"]');

  const wrapperDom =
    dom.parentElement.parentElement.parentElement.parentElement.parentElement
      .parentElement.parentElement.parentElement;

  // Delete DOM from list
  wrapperDom.style.display = "none";
};
