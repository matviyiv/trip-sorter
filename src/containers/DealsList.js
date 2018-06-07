import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { getRealCost, durationToMin, durationToString } from '../utils';

export default class SearchForm extends Component {
  static propTypes = {
    triggerReset: PropTypes.func,
    tripRoute: PropTypes.array,
    deals: PropTypes.array,
    currency: PropTypes.string,
  };

  static defaultProps = {
    triggerReset: () => {},
    tripRoute: [],
    deals: [],
    currency: '',
  };

  onReset = () => {
    this.props.triggerReset();
  }

  renderRoutes() {
    const { tripRoute, deals, currency } = this.props;
    const dealsList = tripRoute.map((reference) => deals.find((deal) => deal.reference === reference));
    if (dealsList.length === 0) {
      return (<div>Sorry, no connection found</div>);
    }

    const routesList = [];
    let totalPrice = 0;
    let totalDuration = 0;

    dealsList.forEach((deal) => {
      const realCost = getRealCost(deal);
      routesList.push((
        <li key={deal.reference}>
          <div>{deal.departure} > {deal.arrival}</div>
          {deal.discount ?
            <div><s>{deal.cost}{currency}</s>{realCost}{currency}</div> :
            <div>{deal.cost}{currency}</div>
          }
          <div>{deal.transport} {deal.reference} for {deal.duration.h}h {deal.duration.m}</div>
        </li>
      ));
      totalPrice += realCost;
      totalDuration += durationToMin(deal.duration);
    });

    routesList.push((<li key="total">Total: {durationToString(totalDuration)} {totalPrice}{currency}</li>));

    return routesList;
  }

  render() {
    return (
      <div>
        <h2>Route description</h2>
        <ul>
          {this.renderRoutes()}
        </ul>
        <button onClick={this.onReset}>Reset</button>
      </div>
    )
  }
}