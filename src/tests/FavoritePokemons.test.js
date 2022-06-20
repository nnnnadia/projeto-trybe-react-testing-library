import React from 'react';
import { screen, render } from '@testing-library/react';
import renderWithRouter from './renderWithRouter';
import FavoritePokemons from '../pages/FavoritePokemons';
import makePokemonsSamples from './testData';

describe('Testa o componente <FavoritePokemons />', () => {
  test('É exibido na tela \'No favorite pokemon found\' se'
  + ' nenhum pokémon estiver favoritado', () => {
    render(<FavoritePokemons />);
    const noFavRegEx = /no\sfavorite\spokemon\sfound/i;
    const noFavElem = screen.getByText(noFavRegEx);
    expect(noFavElem).toBeDefined();
  });

  test('E apenas quando nenhum pokémon estiver favoritado', () => {
    const pokemon = makePokemonsSamples(1);
    renderWithRouter(<FavoritePokemons pokemons={ pokemon } />);
    const noFavRegEx = /no\sfavorite\spokemon\sfound/i;
    const noFavNotFound = screen.queryByText(noFavRegEx);
    expect(noFavNotFound).toBeNull();
  });

  test('São exibidos todos os cards de pokémons favoritados', () => {
    const pokemons = makePokemonsSamples(2);
    renderWithRouter(<FavoritePokemons pokemons={ pokemons } />);
    pokemons.forEach(({
      name,
      type,
      averageWeight: {
        value: weight,
      },
      image,
    }, i) => {
      const screenName = screen.getByText(name);
      expect(screenName).toBeInTheDocument();
      const screenType = screen.queryAllByText(type);
      expect(screenType.length).toBeGreaterThanOrEqual(1);
      expect(screenType.length).toBeLessThanOrEqual(pokemons.length);
      const pokemonsWeights = screen.getAllByText(/average\sweight/i);
      expect(pokemonsWeights[i]).toHaveTextContent(weight);
      const altTextRegEx = new RegExp(`${name}\\ssprite`, 'i');
      const screenImg = screen.getByAltText(altTextRegEx);
      expect(screenImg).toHaveAttribute('src', image);
    });
  });
});
