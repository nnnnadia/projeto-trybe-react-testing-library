import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import renderWithRouter from './renderWithRouter';
import Pokemon from '../components/Pokemon';
import Routes from '../routes';
import { makePokemonsSamples } from './testData';

describe('Testa o componente <Pokedex />', () => {
  test('É renderizado um card com as informações do pokémon:\n\t'
  + '- nome\n\t'
  + '- tipo\n\t'
  + '- peso médio (Average weight: {value} {unit})\n\t'
  + '- imagem (scr, alt)', () => {
    const pokemon = makePokemonsSamples(1)[0];
    renderWithRouter(<Pokemon pokemon={ pokemon } isFavorite={ false } />);
    const {
      name,
      type,
      averageWeight: {
        value,
        measurementUnit,
      },
      image,
    } = pokemon;
    const screenName = screen.getByTestId('pokemon-name');
    expect(screenName).toHaveTextContent(name);
    const screenType = screen.getByTestId('pokemon-type');
    expect(screenType).toHaveTextContent(type);
    const screenWeight = screen.getByTestId('pokemon-weight');
    const weight = new RegExp(`average\\sweight:\\s${value}\\s${measurementUnit}`, 'i');
    expect(screenWeight).toHaveTextContent(weight);
    const altText = new RegExp(`${name}\\ssprite`, 'i');
    const screenImg = screen.getByAltText(altText);
    expect(screenImg).toHaveAttribute('src', image);
  });

  test('No card há um link para exibir detalhes deste pokémon\n\t'
  + '- a URL deve ser \'/pokemons/{id}\'', () => {
    const pokemon = makePokemonsSamples(1)[0];
    renderWithRouter(<Pokemon pokemon={ pokemon } isFavorite={ false } />);
    const detailsLink = screen.getByRole('link', { name: /more\sdetails/i });
    expect(detailsLink).toHaveAttribute('href', `/pokemons/${pokemon.id}`);
  });

  test('  - clicar no link \'More details\' redireciona para a página'
  + ' de detalhes de pokémon', () => {
    const pokemons = makePokemonsSamples(1);
    renderWithRouter(
      <Routes
        onUpdateFavoritePokemons={ () => {} }
        isPokemonFavoriteById={ { [pokemons[0].id]: true } }
        pokemons={ pokemons }
        favoritePokemons={ pokemons }
      />,
      {/* <Pokemon pokemon={ pokemons[0] } isFavorite /> */},
    );
    const detailsLink = screen.getByRole('link', { name: /more\sdetails/i });
    userEvent.click(detailsLink);
    const titleRegEx = new RegExp(`${pokemons[0].name}\\sdetails`, 'i');
    const title = screen.getByRole('heading',
      { level: 2, name: titleRegEx });
    expect(title).toBeInTheDocument();
  });

  test('  - a URL do navegador após o clique passa a ser \'/pokemons/{id}\'', () => {
    const pokemons = makePokemonsSamples(1);
    const { history } = renderWithRouter(
      <Routes
        onUpdateFavoritePokemons={ () => {} }
        isPokemonFavoriteById={ { [pokemons[0].id]: true } }
        pokemons={ pokemons }
        favoritePokemons={ pokemons }
      />,
    );
    const detailsLink = screen.getByRole('link', { name: /more\sdetails/i });
    userEvent.click(detailsLink);
    const { location: { pathname } } = history;
    expect(pathname).toBe(`/pokemons/${pokemons[0].id}`);
  });

  test('Pokémons favoritados possuem uma estrela\n\t'
  + '- src tem o caminho \'/star-icon.svg\'\n\t'
  + '- alt possui texto \'{pokemon} is marked as favorite\'', () => {
    const pokemons = makePokemonsSamples(1);
    renderWithRouter(
      <Routes
        onUpdateFavoritePokemons={ () => {} }
        isPokemonFavoriteById={ { [pokemons[0].id]: true } }
        pokemons={ pokemons }
        favoritePokemons={ pokemons }
      />,
    );
    const altText = new RegExp(`${pokemons[0].name}\\sis\\smarked\\sas\\sfavorite`, 'i');
    const favIcon = screen.getByAltText(altText);
    expect(favIcon).toHaveAttribute('src', '/star-icon.svg');
  });
});
