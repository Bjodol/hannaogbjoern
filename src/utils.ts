export const formatNames = (names: string[]) =>
  names.join(", ").replace(/, ([^,]*)$/, " og $1");

export const formatMultiple = <G = string>(
  names: G[],
  { single, multiple } = { single: "du", multiple: "dere" }
) => (names.length > 1 ? multiple : single);

export const getChoiceText = (
  value: null | string,
  options: { [key: string]: string }
) => {
  return options[`${value}`];
};
