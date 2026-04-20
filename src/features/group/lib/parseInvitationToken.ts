const URL_SCHEME_PATTERN = /^([a-z][a-z0-9+.-]*):/i;

const LOCAL_HTTP_ORIGIN_PATTERN = /^http:\/\/(localhost|127\.0\.0\.1)(?::\d+)?/i;

function isAllowedAbsoluteUrlScheme(scheme: string, fullInput: string): boolean {
  const s = scheme.toLowerCase();
  if (s === 'https') return true;
  if (s === 'http') return LOCAL_HTTP_ORIGIN_PATTERN.test(fullInput);
  return false;
}

const TOKEN_QUERY_PARAM_PATTERN = /[?&]token=([^&#]+)/;

function decodeCapturedTokenValue(rawTokenValue: string): string {
  return decodeURIComponent(rawTokenValue);
}

export function parseInvitationToken(input: string): string | null {
  const trimmedInput = input.trim();
  if (!trimmedInput) return null;

  const schemeMatch = trimmedInput.match(URL_SCHEME_PATTERN);
  if (schemeMatch && !isAllowedAbsoluteUrlScheme(schemeMatch[1], trimmedInput)) {
    return null;
  }

  const tokenQueryMatch = trimmedInput.match(TOKEN_QUERY_PARAM_PATTERN);
  if (tokenQueryMatch) {
    try {
      return decodeCapturedTokenValue(tokenQueryMatch[1]);
    } catch {
      return null;
    }
  }

  /** `?` `/` 없이 붙여 넣은 순수 토큰 문자열 */
  if (!/[/?]/.test(trimmedInput)) {
    return trimmedInput;
  }

  return null;
}
