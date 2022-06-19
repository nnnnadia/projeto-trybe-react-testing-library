import React from 'react';
import { screen, render,  } from '@testing-library/react';
import renderWithRouter from './renderWithRouter';
import FavoritePokemons from '../pages/FavoritePokemons';

describe('Testa o componente <FavoritePokemons />', () => {
  test('É exibido na tela \'No favorite pokemon found\' se'
  + ' nenhum pokémon estiver favoritado', () => {
    render(<FavoritePokemons />);
    const noFavRegEx = /no\sfavorite\spokemon\sfound/i;
    const noFavElem = screen.getByText(noFavRegEx);
    expect(noFavElem).toBeDefined();
  });

  test('E apenas quando nenhum pokémon estiver favoritado', () => {
    const pikachu = {
      averageWeight: {
        measurementUnit: 'kg',
        value: '6.0',
      },
      id: 25,
      image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png',
      name: 'Pikachu',
      type: 'Electric',
    };
    renderWithRouter(<FavoritePokemons pokemons={ [pikachu] } />);
    const noFavRegEx = /no\sfavorite\spokemon\sfound/i;
    const noFavNotFound = screen.queryByText(noFavRegEx);
    expect(noFavNotFound).toBeNull();
  });

  test('São exibidos todos os cards de pokémons favoritados', () => {
    const pokemonsList = [{
      averageWeight: {
        measurementUnit: 'kg',
        value: '6.0',
      },
      id: 25,
      image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png',
      name: 'Pikachu',
      type: 'Electric',
    }, {
      averageWeight: {
        measurementUnit: 'kg',
        value: '6.9',
      },
      id: 23,
      image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/23.png',
      name: 'Ekans',
      type: 'Poison',
    }];
    renderWithRouter(<FavoritePokemons pokemons={ pokemonsList } />);
    const pikachuName = screen.getByText(/pikachu/i);
    expect(pikachuName).toHaveTextContent(pokemonsList[0].name);
    const pikachuType = screen.getByText(/electric/i);
    expect(pikachuType).toHaveTextContent(pokemonsList[0].type);
    const pokemonsWeights = screen.getAllByText(/average\sweight/i);
    expect(pokemonsWeights[0]).toHaveTextContent(/6.0 kg/i);
    const pikachuImg = screen.getByAltText(/pikachu\ssprite/i);
    expect(pikachuImg).toHaveAttribute('src', pokemonsList[0].image);
    const ekansName = screen.getByText(/ekans/i);
    expect(ekansName).toHaveTextContent(pokemonsList[1].name);
    const ekansType = screen.getByText(/poison/i);
    expect(ekansType).toHaveTextContent(pokemonsList[1].type);
    expect(pokemonsWeights[1]).toHaveTextContent(/6.9 kg/i);
    const ekansImg = screen.getByAltText(/ekans\ssprite/i);
    expect(ekansImg).toHaveAttribute('src', pokemonsList[1].image);
  });
});
