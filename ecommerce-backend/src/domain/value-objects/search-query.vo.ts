export class SearchQuery {
  constructor(public readonly value: string) {}

  /**
   * Checks if the search query is a palindrome
   * Ignores spaces, case, and special characters
   */
  isPalindrome(): boolean {
    if (!this.value || this.value.trim().length === 0) {
      return false;
    }

    // Normalize: lowercase and remove non-alphanumeric characters
    const normalized = this.value
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '');

    if (normalized.length < 2) {
      return false;
    }

    // Check if it reads the same forwards and backwards
    const reversed = normalized.split('').reverse().join('');
    return normalized === reversed;
  }

  toString(): string {
    return this.value;
  }
}
