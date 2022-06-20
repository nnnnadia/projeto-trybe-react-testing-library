import React from 'react';
import { screen } from '@testing-library/react';
import { within } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import renderWithRouter from './renderWithRouter';
import App from '../App';

describe('Testa o componente <App />', () => {
  test('O topo da aplicação possui 3 links de navegação na ordem: \n\t'
  + '- \'Home\',\n\t'
  + '- \'About\',\n\t'
  + '- \'Favorites Pokémons\'\n      '
  + 'Ao clicar nos links a aplicação é redirecionada para:', () => {
    renderWithRouter(<App />);
    const menuNav = screen.getByRole('navigation');
    const navLinks = within(menuNav).getAllByRole('link');
    const numberOfLinks = 3;
    expect(navLinks.length).toBe(numberOfLinks);

    const homeLink = within(navLinks[0]).getByText(/home/i);
    expect(homeLink).toBeDefined();

    const aboutLink = within(navLinks[1]).getByText(/about/i);
    expect(aboutLink).toBeDefined();

    const favLink = within(navLinks[2]).getByText(/favorite\spokémons/i);
    expect(favLink).toBeDefined();
  });
  test('  - Home (ou primeiro link): página inicial - URL => \'/\'', () => {
    const { history } = renderWithRouter(<App />);
    const menuNav = screen.getByRole('navigation');
    const homeLink = within(menuNav).getByRole('link', { name: /home/i });
    userEvent.click(homeLink);
    const { location: { pathname: fstPath } } = history;
    expect(fstPath).toBe('/');
    const navLinks = within(menuNav).getAllByRole('link');
    userEvent.click(navLinks[0]);
    const { location: { pathname: sndPath } } = history;
    expect(sndPath).toBe('/');
  });

  test('  - About (ou segundo link): página About - URL => \'/about\'', () => {
    const { history } = renderWithRouter(<App />);
    const menuNav = screen.getByRole('navigation');
    const aboutLink = within(menuNav).getByRole('link', { name: /about/i });
    userEvent.click(aboutLink);
    const { location: { pathname: fstPath } } = history;
    expect(fstPath).toBe('/about');
    const navLinks = within(menuNav).getAllByRole('link');
    userEvent.click(navLinks[1]);
    const { location: { pathname: sndPath } } = history;
    expect(sndPath).toBe('/about');
  });

  test('  - Favorite Pokémons (ou terceiro link): página Favorite'
  + ' Pokémons - URL => \'/favorites\'', () => {
    const { history } = renderWithRouter(<App />);
    const menuNav = screen.getByRole('navigation');
    const favLink = within(menuNav).getByRole('link', { name: /favorite\spokémons/i });
    userEvent.click(favLink);
    const { location: { pathname: fstPath } } = history;
    expect(fstPath).toBe('/favorites');
    const navLinks = within(menuNav).getAllByRole('link');
    userEvent.click(navLinks[2]);
    const { location: { pathname: sndPath } } = history;
    expect(sndPath).toBe('/favorites');
  });

  test('A aplicação é redirecionada para a página Not Found ao entrar em uma '
  + 'URL desconhecida', () => {
    const { history } = renderWithRouter(<App />);
    history.push('/a-page-that-for-sure/doesnt-exist');
    const title = screen.getByRole('heading',
      { level: 2, name: /page\srequested\snot\sfound/i });
    expect(title).toBeDefined();
  });
});
