/**
 * 將模板字串中的 {{key}} 替換為 placeholders[key]。
 * @param {string} template - e.g. "Hello {{name}}, your phone is {{phone}}."
 * @param {object} placeholders - e.g. { name: "Alice", phone: "0922xxx" }
 * @returns {string}
 */
export function compileTemplate(template, placeholders) {
  let output = template || "";

  for (const [key, value] of Object.entries(placeholders)) {
    // new RegExp(`{{${key}}}`, "g") => 尋找所有 {{key}} 並全域替換
    output = output.replace(new RegExp(`{{${key}}}`, "g"), value);
  }

  return output;
}
