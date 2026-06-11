from __future__ import annotations

from app.services.sanitizer import sanitize_optional_context


def test_sanitizer_strips_script_tags() -> None:
  result = sanitize_optional_context(
    "Hello <script>alert('x')</script> please explain first.",
  )

  assert result == "Hello please explain first."


def test_sanitizer_strips_html_tags() -> None:
  result = sanitize_optional_context(
    "<p>Please <strong>explain</strong> first.</p>",
  )

  assert result == "Please explain first."


def test_sanitizer_normalizes_whitespace() -> None:
  result = sanitize_optional_context(" Please\n\nexplain\t each   step. ")

  assert result == "Please explain each step."


def test_sanitizer_returns_none_for_empty_string() -> None:
  assert sanitize_optional_context("   \n\t   ") is None


def test_sanitizer_trims_to_700_characters() -> None:
  result = sanitize_optional_context("a" * 800)

  assert result is not None
  assert len(result) == 700
