import { render, screen } from '@testing-library/react';
import App from './App';
import data from './data.json'

describe('Starwars APP', () => {
  beforeAll(() => jest.spyOn(window, 'fetch'))

  it("Debe de regresar caracteres de la api", async () => {
    window.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => data,
    })

    render(<App/>)

    expect(window.fetch).toHaveBeenCalledTimes(1);
    expect(window.fetch).toHaveBeenCalledWith("https://swapi.dev/api/people");

    for (let character of data.results){
      expect(await screen.findByText(character.name)).toBeInTheDocument();
    }
  })

  it("Debe de mostrar un error cuando falle la red", async () => {
    window.fetch.mockRejectedValueOnce(new Error("Network error"));
    render (<App/>)
    expect (await screen.findByText("Network error")).toBeInTheDocument();
  })

  

});
