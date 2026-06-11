from __future__ import annotations

import html
import re

MAX_OPTIONAL_CONTEXT_LENGTH = 700

_SCRIPT_STYLE_RE = re.compile(
  r"<(script|style)\b[^>]*>.*?</\1>",
  re.IGNORECASE | re.DOTALL,
)
_HTML_TAG_RE = re.compile(r"<[^>]+>")
_WHITESPACE_RE = re.compile(r"\s+")


def sanitize_optional_context(text: str | None) -> str | None:
  if text is None:
    return None

  without_script_or_style = _SCRIPT_STYLE_RE.sub(" ", text)
  without_tags = _HTML_TAG_RE.sub(" ", without_script_or_style)
  decoded = html.unescape(without_tags)
  normalized = _WHITESPACE_RE.sub(" ", decoded).strip()

  if not normalized:
    return None

  return normalized[:MAX_OPTIONAL_CONTEXT_LENGTH].strip()
