export function extractError(err: any): string {
  const body = err?.error;
  if (body?.fields) return Object.values(body.fields).join(', ');
  return body?.error ?? 'Something went wrong. Is the backend running?';
}