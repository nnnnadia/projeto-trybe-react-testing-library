import React from 'react';
import { screen, render } from '@testing-library/react';
import About from '../pages/About';

describe('Testa o componente <About />', () => {
  test('O título principal é um h2 com o texto \'About Pokédex\'', () => {
    render(<About />);
    const title = screen.getByRole('heading',
      { level: 2, name: /about\spokédex/i });
    expect(title).toBeDefined();
  });

  test('Existem 2 parágrafos com texto sobre a Pokédex', () => {
    render(<About />);
    const fstText = 'This application simulates a Pokédex, a'
    + ' digital encyclopedia containing all Pokémons';
    const sndText = 'One can filter Pokémons by type, and see'
    + ' more details for each one of them';
    const fstParagraph = screen.getByText(fstText);
    expect(fstParagraph).toBeDefined();
    const sndParagraph = screen.getByText(sndText);
    expect(sndParagraph).toBeDefined();
  });

  test('A imagem correta é renderizada', () => {
    render(<About />);
    const imgUrl = 'https://cdn2.bulbagarden.net/upload/thumb/8/86/Gen_I_Pok%C3%A9dex.png/800px-Gen_I_Pok%C3%A9dex.png';
    const renderedImg = screen.getByRole('img');
    expect(renderedImg).toHaveAttribute('src', imgUrl);
  });
});
