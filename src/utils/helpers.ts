import { ISSUE_URL_PATTERN } from "../constants.js";

/**
 * Parses issue URLs or IDs and returns an array of issue IDs
 * @param input - Comma-separated string of URLs or IDs
 * @returns Array of issue IDs
 */
export function parseIssueIds(input: string): number[] {
  return input
    .split(",")
    .map((item) => {
      const trimmed = item.trim();

      // Try to extract ID from URL pattern: /issues/12345
      const match = trimmed.match(ISSUE_URL_PATTERN);
      if (match?.[1]) {
        return parseInt(match[1]);
      }

      // If it's just a number, parse it directly
      const num = parseInt(trimmed);
      return isNaN(num) ? null : num;
    })
    .filter((id): id is number => id !== null);
}

/**
 * Filters an array of items based on a search term
 * @param items - Array of items with name property
 * @param searchTerm - Search term to filter by
 * @returns Filtered array
 */
export function filterByName<T extends { name: string }>(
  items: T[],
  searchTerm: string
): T[] {
  const term = searchTerm.toLowerCase();
  return items.filter((item) => item.name.toLowerCase().includes(term));
}

/**
 * Moves a selected item to the top of an array
 * @param items - Array of items
 * @param predicate - Function to identify the selected item
 * @returns Array with selected item at the top
 */
export function moveToTop<T>(items: T[], predicate: (item: T) => boolean): T[] {
  const index = items.findIndex(predicate);
  if (index <= 0) return items;

  const result = [...items];
  const [selected] = result.splice(index, 1);
  if (selected) {
    result.unshift(selected);
  }
  return result;
}
