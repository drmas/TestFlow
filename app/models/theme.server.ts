// Mock theme storage - replace with actual database implementation
let currentTheme: "light" | "dark" = "light";

export async function getTheme() {
  return currentTheme;
}

export async function setTheme(theme: "light" | "dark") {
  currentTheme = theme;
  return currentTheme;
}