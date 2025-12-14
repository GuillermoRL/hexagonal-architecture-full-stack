import { SearchQuery } from './search-query.vo';

describe('SearchQuery Value Object', () => {
  describe('isPalindrome', () => {
    it('should detect simple palindromes', () => {
      const palindromes = ['radar', 'ana', 'oso', 'reconocer'];

      palindromes.forEach((word) => {
        expect(new SearchQuery(word).isPalindrome()).toBe(true);
      });
    });

    it('should detect palindromes ignoring case', () => {
      const palindromes = ['Radar', 'ANA', 'OsO', 'ReCOnocer'];

      palindromes.forEach((word) => {
        expect(new SearchQuery(word).isPalindrome()).toBe(true);
      });
    });

    it('should detect palindromes with spaces', () => {
      const palindromes = [
        'anita lava la tina',
        'A man a plan a canal Panama',
      ];

      palindromes.forEach((phrase) => {
        expect(new SearchQuery(phrase).isPalindrome()).toBe(true);
      });
    });

    it('should return false for non-palindromes', () => {
      const nonPalindromes = ['laptop', 'producto', 'mouse', 'keyboard'];

      nonPalindromes.forEach((word) => {
        expect(new SearchQuery(word).isPalindrome()).toBe(false);
      });
    });

    it('should return false for empty or whitespace strings', () => {
      expect(new SearchQuery('').isPalindrome()).toBe(false);
      expect(new SearchQuery('  ').isPalindrome()).toBe(false);
    });

    it('should return false for single characters', () => {
      expect(new SearchQuery('a').isPalindrome()).toBe(false);
      expect(new SearchQuery('Z').isPalindrome()).toBe(false);
    });
  });

  describe('toString', () => {
    it('should return the original value', () => {
      const query = new SearchQuery('test query');
      expect(query.toString()).toBe('test query');
    });
  });
});
