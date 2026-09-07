export interface ApiError { status: number; message: string; url?: string; }

export function toApiError(error: unknown): ApiError {
  if (typeof error === 'object' && error !== null && 'status' in error) {
    const candidate = error as { status?: number; message?: string; url?: string };
    return { status: candidate.status ?? 0, message: candidate.message ?? 'The request could not be completed.', url: candidate.url };
  }
  return { status: 0, message: 'The request could not be completed.' };
}
