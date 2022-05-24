export const getDmListFromDom = () => {
  const list = Array.from(
    document.querySelectorAll('[data-testid="DM_Conversation_Avatar"]')
  ).map((v) => v.attributes[0].nodeValue?.slice(1));

  return list;
};
