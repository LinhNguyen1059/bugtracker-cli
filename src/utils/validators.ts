/**
 * Validates that input is not empty
 */
export function validateNotEmpty(input: string): true | string {
  if (!input || input.trim() === "") {
    return "This field is required";
  }
  return true;
}

/**
 * Validates API key input
 */
export function validateApiKey(input: string): true | string {
  if (!input || input.trim() === "") {
    return "API key is required";
  }
  return true;
}

/**
 * Validates issue URLs input
 */
export function validateIssueUrls(input: string): true | string {
  if (!input || input.trim() === "" || input.startsWith("e.g.,")) {
    return "Please enter valid issue URLs";
  }
  return true;
}

/**
 * Validates version input (allows empty)
 */
export function validateVersion(input: string): true | string {
  if (input && input.startsWith("e.g.,")) {
    return "Please enter a valid version ID";
  }
  return true;
}
