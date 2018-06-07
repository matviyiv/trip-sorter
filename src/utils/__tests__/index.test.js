import data from '../../../public/api/response.json';
import {
  findRoute,
  getAllDestinations,
  durationToMin,
  getRealCost,
  durationToString,
} from '../index';

describe('utils.index', () => {
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

  describe('getAllDestinations', () => {
    let deals;

    beforeEach(() => {
      deals = data.deals;
    });

    it('should return departureList and arrivalList', () => {
      expect(getAllDestinations(deals)).toMatchSnapshot();
    });
  });

  describe('durationToMin', () => {
    it('convert duration object with one hour', () => {
      expect(durationToMin({h: '01', m: '00'})).toBe(60);
    });

    it('convert duration object with 3 hours and 45 min', () => {
      expect(durationToMin({h: '03', m: '45'})).toBe(225);
    });

    it('fail to convert string values into integer', () => {
      expect(durationToMin({h: 'xx', m: 'yy'})).toEqual(NaN);
    });

    it('fail without parameter', () => {
      expect(durationToMin(undefined)).toEqual(NaN);
    });
  });

  describe('getRealCost', () => {
    it('cost without discount', () => {
      expect(getRealCost({cost: 100, discount: 0})).toBe(100);
    });

    it('cost with 50% discount', () => {
      expect(getRealCost({cost: 100, discount: 50})).toBe(50);
    });
  });

  describe('durationToString', () => {
    it('1h0', () => {
      expect(durationToString(60)).toBe('1h0');
    });
    it('1h40', () => {
      expect(durationToString(100)).toBe('1h40');
    });
  });
});
