export const hideUser = (username) => {
  const dom = document.querySelector(`[href="/${username}"]`);

  const wrapperDom =
    dom.parentElement.parentElement.parentElement.parentElement.parentElement
      .parentElement.parentElement.parentElement;

  // Delete DOM from list
  wrapperDom.style.display = "none";
};
