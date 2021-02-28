/**
 * Decodes the user roles from the authentication token
 */
export function getUserRoles(token: string | null): null | string[] {
  if (token === null) {
    return null;
  }

  const base64EncodedPayload = token.split(".")[1];
  const serializedPayload = atob(base64EncodedPayload);

  const result: string[] = JSON.parse(serializedPayload).authorities;
  return result;
}
