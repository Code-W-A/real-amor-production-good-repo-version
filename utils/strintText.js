export function testString(str) {
  const pattern = /^variation-\d+-lang-\w+$/;
  return pattern.test(str);
}

export const normalizeString = (str) => {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
};

export const emailWithoutSpace = (email) => {
  const newEmail = email.replace(/\s/g, "");

  return newEmail;
};

export const handleDiacrtice = (text) => {
  return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
};

export function formatTitulatura(title) {
  return title
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}
