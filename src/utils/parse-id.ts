export function parseId(text: string, id: string) {
  return id + "-" + text.trim().split(" ").join("-");
}
