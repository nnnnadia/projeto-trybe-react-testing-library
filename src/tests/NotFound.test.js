import React from 'react';
import { render, screen } from '@testing-library/react';
import NotFound from '../pages/NotFound';

describe('Testa o componente <NotFound />', () => {
  test('A página contém um h2 com o texto \'Page requested not found 😭\'', () => {
    render(<NotFound />);
    const title = screen.getByRole('heading',
      { level: 2 });
    expect(title).toHaveTextContent(/page\srequested\snot\sfound\s😭/i);
    const image = screen.getByAltText(/pikachu\scrying/i);
    expect(image).toHaveAttribute('src', 'https://media.giphy.com/media/kNSeTs31XBZ3G/giphy.gif');
  });
});
