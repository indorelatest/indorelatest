import React from "react";

const URL_SOURCE = String.raw`(https?:\/\/[^\s<>"']+|www\.[^\s<>"']+)`;
const TRAILING_PUNCTUATION_RE = /[.,!?;:)]+$/;

export const textHasLinks = (text = "") =>
  new RegExp(URL_SOURCE, "i").test(String(text));

export const getTextTokensWithLinks = (text = "") => {
  const value = String(text);
  const tokens = [];
  const matcher = new RegExp(URL_SOURCE, "gi");
  let lastIndex = 0;
  let match;

  while ((match = matcher.exec(value)) !== null) {
    if (match.index > lastIndex) {
      tokens.push({ type: "text", value: value.slice(lastIndex, match.index) });
    }

    const rawUrl = match[0];
    const trailing = rawUrl.match(TRAILING_PUNCTUATION_RE)?.[0] || "";
    const cleanUrl = trailing ? rawUrl.slice(0, -trailing.length) : rawUrl;

    tokens.push({
      type: "link",
      value: cleanUrl,
      href: cleanUrl.startsWith("www.") ? `https://${cleanUrl}` : cleanUrl,
    });

    if (trailing) {
      tokens.push({ type: "text", value: trailing });
    }

    lastIndex = match.index + rawUrl.length;
  }

  if (lastIndex < value.length) {
    tokens.push({ type: "text", value: value.slice(lastIndex) });
  }

  return tokens;
};

export const renderHighlightedLinks = (
  text = "",
  linkClassName = "font-semibold text-brand-red underline underline-offset-4 decoration-2 hover:text-brand-red-hover",
) =>
  getTextTokensWithLinks(text).map((token, index) =>
    token.type === "link" ? (
      <a
        key={`${token.href}-${index}`}
        href={token.href}
        target="_blank"
        rel="noopener noreferrer"
        className={linkClassName}
      >
        {token.value}
      </a>
    ) : (
      <React.Fragment key={`text-${index}`}>{token.value}</React.Fragment>
    ),
  );
