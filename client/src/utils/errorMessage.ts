export function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    if (
      "response" in error &&
      error.response &&
      typeof error.response === "object" &&
      "data" in error.response &&
      error.response.data &&
      typeof error.response.data === "object" &&
      "message" in error.response.data
    )
      return error.response.data.message as string;
    return error.message as string;
  }
  return String(error);
}
