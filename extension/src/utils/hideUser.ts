export const hideUser = (username: string) => {
  const dom = document.querySelector(`[href="/${username}"]`);

  const wrapperDom =
    dom?.parentElement?.parentElement?.parentElement?.parentElement
      ?.parentElement?.parentElement?.parentElement?.parentElement;

  // Delete DOM from list
  if (!wrapperDom) return;

  wrapperDom.style.display = "none";
};
