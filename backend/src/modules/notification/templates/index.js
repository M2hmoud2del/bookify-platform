import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import handlebars from "handlebars";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const templateCache = new Map();

export const renderTemplate = (templateName, data = {}) => {
  if (!templateCache.has(templateName)) {
    const templatePath = path.join(__dirname, `${templateName}.hbs`);
    const source = fs.readFileSync(templatePath, "utf8");
    templateCache.set(templateName, handlebars.compile(source));
  }

  return templateCache.get(templateName)(data);
};
