/**
 * Motor de template minimalista (estilo Mustache/Handlebars, só o
 * necessário) para preencher o HTML do contrato sem precisar de uma
 * dependência externa. Suporta:
 *   {{variavel}}            -> saída com escape de HTML
 *   {{{variavel}}}          -> saída sem escape (HTML já pronto)
 *   {{#if variavel}}...{{else}}...{{/if}}
 *   {{#each lista}}...{{this.campo}}...{{@index}}...{{/each}}
 */

type TemplateContext = Record<string, unknown>;

export function renderTemplate(template: string, context: TemplateContext): string {
  return renderBlock(template, context);
}

function renderBlock(str: string, ctx: TemplateContext): string {
  let result = "";
  let i = 0;

  while (i < str.length) {
    const start = str.indexOf("{{", i);
    if (start === -1) {
      result += str.slice(i);
      break;
    }
    result += str.slice(i, start);

    if (str.startsWith("{{#each ", start)) {
      const tagClose = str.indexOf("}}", start);
      if (tagClose === -1) throw new Error("Tag {{#each}} malformada.");
      const varName = str.slice(start + "{{#each ".length, tagClose).trim();
      const { contentEnd, tagEnd } = findMatchingClose(str, tagClose + 2, "each");
      const innerTemplate = str.slice(tagClose + 2, contentEnd);
      const items = getPath(ctx, varName);
      if (Array.isArray(items)) {
        items.forEach((item, idx) => {
          const itemCtx: TemplateContext = {
            ...ctx,
            this: item,
            "@index": idx,
            "@number": idx + 1,
          };
          result += renderBlock(innerTemplate, itemCtx);
        });
      }
      i = tagEnd;
      continue;
    }

    if (str.startsWith("{{#if ", start)) {
      const tagClose = str.indexOf("}}", start);
      if (tagClose === -1) throw new Error("Tag {{#if}} malformada.");
      const varName = str.slice(start + "{{#if ".length, tagClose).trim();
      const { contentEnd, tagEnd } = findMatchingClose(str, tagClose + 2, "if");
      let innerTemplate = str.slice(tagClose + 2, contentEnd);
      let elseTemplate = "";
      const elseIdx = findTopLevelElse(innerTemplate);
      if (elseIdx !== -1) {
        elseTemplate = innerTemplate.slice(elseIdx + "{{else}}".length);
        innerTemplate = innerTemplate.slice(0, elseIdx);
      }
      const truthy = isTruthy(getPath(ctx, varName));
      result += renderBlock(truthy ? innerTemplate : elseTemplate, ctx);
      i = tagEnd;
      continue;
    }

    if (str.startsWith("{{{", start)) {
      const tagClose = str.indexOf("}}}", start);
      if (tagClose === -1) throw new Error("Tag {{{ }}} malformada.");
      const varName = str.slice(start + 3, tagClose).trim();
      result += String(getPath(ctx, varName) ?? "");
      i = tagClose + 3;
      continue;
    }

    const tagClose = str.indexOf("}}", start);
    if (tagClose === -1) throw new Error("Tag {{ }} malformada.");
    const varName = str.slice(start + 2, tagClose).trim();
    result += escapeHtml(String(getPath(ctx, varName) ?? ""));
    i = tagClose + 2;
  }

  return result;
}

function findMatchingClose(
  str: string,
  fromIndex: number,
  type: "each" | "if"
): { contentEnd: number; tagEnd: number } {
  const openPrefix = `{{#${type} `;
  const closeTag = `{{/${type}}}`;
  let depth = 1;
  let idx = fromIndex;

  while (depth > 0) {
    const nextOpen = str.indexOf(openPrefix, idx);
    const nextClose = str.indexOf(closeTag, idx);
    if (nextClose === -1) {
      throw new Error(`Tag ${closeTag} não encontrada no template.`);
    }
    if (nextOpen !== -1 && nextOpen < nextClose) {
      depth++;
      idx = nextOpen + openPrefix.length;
    } else {
      depth--;
      if (depth === 0) {
        return { contentEnd: nextClose, tagEnd: nextClose + closeTag.length };
      }
      idx = nextClose + closeTag.length;
    }
  }
  throw new Error("unreachable");
}

function findTopLevelElse(str: string): number {
  let depth = 0;
  let i = 0;
  while (i < str.length) {
    const nextTag = str.indexOf("{{", i);
    if (nextTag === -1) return -1;

    if (str.startsWith("{{#if ", nextTag) || str.startsWith("{{#each ", nextTag)) {
      depth++;
      const close = str.indexOf("}}", nextTag);
      i = close === -1 ? str.length : close + 2;
      continue;
    }
    if (str.startsWith("{{/if}}", nextTag) || str.startsWith("{{/each}}", nextTag)) {
      depth--;
      i = nextTag + (str.startsWith("{{/if}}", nextTag) ? 7 : 9);
      continue;
    }
    if (depth === 0 && str.startsWith("{{else}}", nextTag)) {
      return nextTag;
    }
    i = nextTag + 2;
  }
  return -1;
}

function getPath(ctx: TemplateContext, path: string): unknown {
  if (path.startsWith("@")) return ctx[path];
  if (path === "this") return ctx.this;
  if (path.startsWith("this.")) {
    const key = path.slice(5);
    const thisValue = ctx.this as Record<string, unknown> | undefined;
    return thisValue ? thisValue[key] : undefined;
  }
  return ctx[path];
}

function isTruthy(value: unknown): boolean {
  if (Array.isArray(value)) return value.length > 0;
  return Boolean(value);
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
