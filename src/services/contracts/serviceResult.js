export function ok(data) {
  return { data, error: null };
}

export function fail(error) {
  return {
    data: null,
    error: {
      code: error?.code || 'SERVICE_ERROR',
      message: error?.message || 'Unknown service error',
    },
  };
}
