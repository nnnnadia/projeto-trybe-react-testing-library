import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import renderWithRouter from './renderWithRouter';
import Pokedex from '../pages/Pokedex';
import { makePokemonsSamples, makeIsPokemonFavoriteById } from './testData';

describe('Testa o componente <Pokedex />', () => {
  test('A página contém um h2 com o texto \'Encountered pokémons\'', () => {
    const pokemons = makePokemonsSamples(2);
    renderWithRouter(<Pokedex
      pokemons={ pokemons }
      isPokemonFavoriteById={ makeIsPokemonFavoriteById(pokemons) }
    />);
    const title = screen.getByRole('heading', { level: 2 });
    expect(title).toHaveTextContent(/encountered\spokémons/i);
  });

  test('O botão\'Próximo pokémon\' existe e mostra os pokémons salvos na pokedex'
  + ', após o último volta pro início', () => {
    const sampleSize = 3;
    const pokemons = makePokemonsSamples(sampleSize);
    renderWithRouter(<Pokedex
      pokemons={ pokemons }
      isPokemonFavoriteById={ makeIsPokemonFavoriteById(pokemons) }
    />);
    const nextButton = screen.getByRole('button', { name: /próximo\spokémon/i });
    expect(nextButton).toBeInTheDocument();
    for (let i = 0; i < sampleSize; i += 1) {
      const pokemonName = screen.getByText(pokemons[i].name);
      expect(pokemonName).toBeInTheDocument();
      userEvent.click(nextButton);
    }
    const pokemonName = screen.getByText(pokemons[0].name);
    expect(pokemonName).toBeInTheDocument();
  });

  test('É mostrado apenas um pokémon por vez', () => {
    const sampleSize = 3;
    const pokemons = makePokemonsSamples(sampleSize);
    renderWithRouter(<Pokedex
      pokemons={ pokemons }
      isPokemonFavoriteById={ makeIsPokemonFavoriteById(pokemons) }
    />);
    const weight = screen.getByText(/average\sweight/i);
    expect(weight).toBeInTheDocument();
    const sprite = screen.getByAltText(/sprite/i);
    expect(sprite).toBeInTheDocument();
  });

  test('A Pokedex possui botões de filtro para cada tipo de pokémon salvos nela,'
  + ' ao clicar neles é mostrado apenas os pokémons daquele tipo', () => {
    const sampleSize = 5;
    const pokemons = makePokemonsSamples(sampleSize);
    renderWithRouter(<Pokedex
      pokemons={ pokemons }
      isPokemonFavoriteById={ makeIsPokemonFavoriteById(pokemons) }
    />);
    const pokemonsTypes = [...new Set(pokemons.map((poke) => poke.type))];
    const typeButtons = screen.getAllByTestId('pokemon-type-button');
    expect(pokemonsTypes.length).toEqual(typeButtons.length);
    pokemonsTypes.forEach((type) => {
      const typeButton = screen.getByRole('button', { name: type });
      expect(typeButton).toBeInTheDocument();
      userEvent.click(typeButton);
      let typeText = screen.getByTestId('pokemon-type');
      expect(typeText).toHaveTextContent(type);
      const nextButton = screen.getByRole('button', { name: /próximo\spokémon/i });
      if (!nextButton.disabled) {
        userEvent.click(nextButton);
        typeText = screen.getByTestId('pokemon-type');
        expect(typeText).toHaveTextContent(type);
      }
    });
  });

  test('Existe um botão com texto \'All\' que reseta os filtros, ao carregar a'
  + ' página é o filtro selecionado', () => {
    const sampleSize = 5;
    const pokemons = makePokemonsSamples(sampleSize);
    renderWithRouter(<Pokedex
      pokemons={ pokemons }
      isPokemonFavoriteById={ makeIsPokemonFavoriteById(pokemons) }
    />);
    const nextButton = screen.getByRole('button', { name: /próximo\spokémon/i });
    for (let i = 0; i < sampleSize; i += 1) {
      userEvent.click(nextButton);
    }
    let nameText = screen.getByTestId('pokemon-name');
    expect(nameText).toHaveTextContent(pokemons[0].name);
    const typeButton = screen.getByRole('button', { name: pokemons[0].type });
    userEvent.click(typeButton);
    const allButton = screen.getByRole('button', { name: /all/i });
    userEvent.click(allButton);
    for (let i = 0; i < sampleSize; i += 1) {
      userEvent.click(nextButton);
    }
    nameText = screen.getByTestId('pokemon-name');
    expect(nameText).toHaveTextContent(pokemons[0].name);
  });
});
