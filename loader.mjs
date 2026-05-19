import { fileURLToPath, pathToFileURL } from "url";
import path from "path";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)));

export function resolve(specifier, context, nextResolve) {
  if (specifier.startsWith("$lib/")) {
    const relative = specifier.slice("$lib/".length);
    const absolutePath = path.join(projectRoot, "src/lib", relative);
    const fileUrl = pathToFileURL(absolutePath).href;

    return { url: fileUrl,
      shortCircuit: true };
  }

  return nextResolve(specifier, context);
}