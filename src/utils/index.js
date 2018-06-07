import _ from 'lodash';
import config from '../config';

const { LIMIT_DESTINATION_DEPTH } = config;

export function fetchGet(url) {
  return fetch(document.URL + url).then(responseHandler);
}

function responseHandler(res) {
  if (res.status >= 300) {
    return Promise.reject({
      status: res.status,
      text: res.statusText
    });
  }
  return res.json();
}

export function getAllDestinations(deals = []) {
  const result = {
    departureList: [],
    arrivalList: [],
  };

  deals.forEach((deals = {}) => {
    const departure = _.capitalize(deals.departure);
    const arrival = _.capitalize(deals.arrival);
    
    if (!_.includes(result.departureList, departure)) result.departureList.push(departure);
    if (!_.includes(result.arrivalList, arrival)) result.arrivalList.push(arrival);
  });

  return result;
}

/**
 * This function returns list of reference ids
 * ['REF123', 'REF23']
 * Algorithm:
 * 1. Group all deals by departure and filter arrival by value {London: {Amsterdam : {...deal}}}
 * 2. Assigne direct route as best if exists
 * 3. Recursivly iterate over departure options
 * 4. Stop recursive search when: depth 20 or nextBest.value > currentBest.value
 */
export function findRoute(deals = [], departure, arrival, filter) {
  const filterName = getSortingField(filter);
  const bestRoutes = deals.reduce((routes, deal) => {
    const dealKey = `${deal.departure}.${deal.arrival}`;
    const previousDeal = _.get(routes, dealKey);
    const currentDeal = prepareRouteOption(deal);

    if (!previousDeal) {
      _.set(routes, dealKey, currentDeal);
      return routes;
    }

    if (currentDeal[filterName] < previousDeal[filterName]) {
      _.set(routes, dealKey, currentDeal);
    }

    return routes;
  }, {});

  let bestRoute = { path: [], value: 0 };

  if (bestRoutes[departure][arrival]) {
    bestRoute.path.push(bestRoutes[departure][arrival].reference);
    bestRoute.value = bestRoutes[departure][arrival][filterName];
  };

  Object.values(bestRoutes[departure]).forEach((deal) => {
    let nextBest = { path: [deal.reference], value: deal[filterName] };
    nextBest = findIndirectRoutes(deal.arrival, arrival, nextBest);
    if ((bestRoute.value === 0 && nextBest) || (nextBest && nextBest.value < bestRoute.value)) {
      bestRoute = nextBest;
    }
  });

  function findIndirectRoutes(from, to, nextBest) {
    const deal = bestRoutes[from][to];
    if (deal) {
      nextBest.value += deal[filterName];
      nextBest.path.push(deal.reference);
      return nextBest;
    } else {
      for (let cityName in bestRoutes[from]) {
        const nextDeal = bestRoutes[from][cityName];
        if ((nextBest.path.length < LIMIT_DESTINATION_DEPTH && bestRoute.value === 0) || nextBest.value < bestRoute.value) {
          nextBest.value += nextDeal[filterName];
          nextBest.path.push(nextDeal.reference);
          return findIndirectRoutes(nextDeal.arrival, arrival, nextBest);
        } else {
          return null;
        }
      }
    }
  }

  return bestRoute.path;
}

function prepareRouteOption(deal) {
  const duration = durationToMin(deal.duration);
  const cost = getRealCost(deal);
  const { reference, arrival, departure } = deal;

  return {
    reference,
    arrival,
    departure,
    duration,
    cost,
  };
}

function getSortingField(filter) {
  return filter === 'cheapest' ? 'cost' : 'duration';
}

export function durationToMin(duration) {
  return (+duration.h * 60) + (+duration.m);
}

export function getRealCost(deal) {
  if (deal.discount > 0) {
    return deal.cost - (deal.cost * (deal.discount/100).toFixed(2));
  }

  return deal.cost;
}

export function durationToString(durationMin) {
  const hours = Math.floor(durationMin / 60);
  const min = durationMin % 60;
  return `${hours}h${min}`;
}
