import { findRoute } from '../index';
import data from '../../../public/api/response.json';

describe('findRoute', () => {
  let deals;

  beforeEach(() => {
    deals = data.deals;
  });

  it('return direct route', () => {
    expect(findRoute(deals, 'London', 'Paris', 'cheapest')).toMatchSnapshot();
  });

  it('fastest and cheapest should be diffrent', () => {
    const cheapest = findRoute(deals, 'London', 'Paris', 'cheapest');
    const fastest = findRoute(deals, 'London', 'Paris', 'fastest');
    expect(cheapest).not.toEqual(fastest);
  });

  it('route with one stop over', () => {
    expect(findRoute(deals, 'London', 'Madrid', 'cheapest')).toMatchSnapshot();
  });

  it('route with three stop overs', () => {
    expect(findRoute(deals, 'London', 'Stockholm', 'fastest')).toMatchSnapshot();
  });

  it('no route found', () => {
    expect(findRoute(deals, 'London', 'Kyiv', 'cheapest')).toMatchSnapshot();
  });
});
