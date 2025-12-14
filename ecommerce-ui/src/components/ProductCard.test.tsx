import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ProductCard } from './ProductCard';
import { Product } from '@/domain/entities/product.entity';
import { Promotion } from '@/domain/entities/promotion.entity';

describe('ProductCard Component', () => {
  it('should render product without promotion', () => {
    const product = new Product(
      1,
      'Laptop Gamer Pro',
      'High-end gaming laptop',
      1299.99,
      'https://example.com/laptop.jpg',
    );

    render(<ProductCard product={product} />);

    expect(screen.getByText('Laptop Gamer Pro')).toBeInTheDocument();
    expect(screen.getByText('High-end gaming laptop')).toBeInTheDocument();
    expect(screen.getByText('$1299.99')).toBeInTheDocument();
  });

  it('should render product with promotion', () => {
    const promotion = new Promotion(1, 'SAVE20', 20);
    const product = new Product(
      1,
      'Laptop Gamer Pro',
      'High-end gaming laptop',
      1000,
      'https://example.com/laptop.jpg',
      promotion,
    );

    render(<ProductCard product={product} />);

    expect(screen.getByText('20% OFF')).toBeInTheDocument();
    expect(screen.getByText('SAVE20')).toBeInTheDocument();
    expect(screen.getByText('$1000.00')).toBeInTheDocument(); // Original price
    expect(screen.getByText('$800.00')).toBeInTheDocument(); // Discounted price
  });

  it('should apply green ring for palindrome discount', () => {
    const promotion = new Promotion(1, 'PALINDROME', 50);
    const product = new Product(
      1,
      'Radar Device',
      'Radar sensor',
      1000,
      null,
      promotion,
      true, // isPalindromeDiscount
    );

    const { container } = render(<ProductCard product={product} />);

    const card = container.querySelector('[class*="ring-green"]');
    expect(card).toBeInTheDocument();
  });

  it('should not apply green ring for normal promotions', () => {
    const promotion = new Promotion(1, 'SAVE20', 20);
    const product = new Product(
      1,
      'Laptop',
      'Gaming laptop',
      1000,
      null,
      promotion,
      false, // isPalindromeDiscount
    );

    const { container } = render(<ProductCard product={product} />);

    const card = container.querySelector('[class*="ring-green"]');
    expect(card).toBeNull();
  });

  it('should show image when imageUrl is provided', () => {
    const product = new Product(
      1,
      'Laptop',
      'Gaming laptop',
      1000,
      'https://example.com/laptop.jpg',
    );

    render(<ProductCard product={product} />);

    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('src', 'https://example.com/laptop.jpg');
    expect(img).toHaveAttribute('alt', 'Laptop');
  });

  it('should show placeholder when imageUrl is null', () => {
    const product = new Product(1, 'Laptop', 'Gaming laptop', 1000, null);

    render(<ProductCard product={product} />);

    expect(screen.getByText('P')).toBeInTheDocument();
  });

  it('should handle null description', () => {
    const product = new Product(1, 'Laptop', null, 1000, null);

    render(<ProductCard product={product} />);

    expect(screen.getByText('Laptop')).toBeInTheDocument();
  });
});
