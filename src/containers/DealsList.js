import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './DealsList.css';

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
        <li key={deal.reference} className="list-group-item">
          <div className="bmd-list-group-col">
            <div className="list-group-item-heading">
              <div className="deals-list--item-heading">{deal.departure} > {deal.arrival}</div>
              <div className="deals-list--item-price">
              {
                deal.discount ?
                  <div><s><span className="red">{deal.cost}{currency}</span></s><span className="green">{realCost}{currency}</span></div> :
                  <div>{deal.cost}{currency}</div>
              }
              </div>
            </div>
            <div className="list-group-item-text">
              
              <div>{deal.transport} {deal.reference} for {deal.duration.h}h {deal.duration.m}</div>
            </div>
          </div>
        </li>
      ));
      totalPrice += realCost;
      totalDuration += durationToMin(deal.duration);
    });

    routesList.push((
      <li key="total" className="list-group-item">
        Total: Duration: <span className="green">{durationToString(totalDuration)} </span> Price: <span className="green">{totalPrice}{currency}</span>
      </li>
    ));

    return routesList;
  }

  render() {
    return (
      <div className="deals-list">
        <h2>Route description</h2>
        <ul className="list-group">
          {this.renderRoutes()}
        </ul>
        <hr></hr>
        <button className="btn btn-raised btn-secondary" onClick={this.onReset}>Reset</button>
      </div>
    )
  }
}