import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { getAllDestinations } from '../utils';

const CHEAPEST_FILTER = 'cheapest';
const FASTEST_FILTER = 'fastest';

export default class SearchForm extends Component {
  static propTypes = {
    triggerSearch: PropTypes.func,
    deals: PropTypes.array,
    departure: PropTypes.string,
    arrival: PropTypes.string,
    filter: PropTypes.string,
  };

  static defaultProps = {
    triggerSearch: () => {},
    deals: [],
    departure: '',
    arrival: '',
    filter: '',
  };

  constructor(props) {
    super(props);

    const { departure, arrival, filter } = this.props;
    this.state = {
      departure,
      arrival,
      filter: filter || CHEAPEST_FILTER,
      departureList: [],
      arrivalList: [],
      invalidForm: {},
    }
  }

  componentWillMount() {
    this.prepareDropdownOptions(this.props.deals);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.deals !== this.props.deals) {
      this.prepareDropdownOptions(nextProps.deals);
    }
  }

  prepareDropdownOptions(deals) {
    if (deals.length === 0) return;

    const { departureList, arrivalList } = getAllDestinations(deals);
    this.setState({ departureList, arrivalList });
  }

  onSearch = () => {
    const { departure, arrival, filter } = this.state;
    if (!departure) {
      return this.setState({ invalidForm: { message: 'Please select departure' }})
    }

    if (!arrival) {
      return this.setState({ invalidForm: { message: 'Please select arrival' }})
    }

    this.props.triggerSearch(departure, arrival, filter);
  }

  onDropdownChange = (filedName) => (event) => {
    this.setState({ [filedName]: event.target.value, invalidForm: {} });
  }

  onOptionChange = (event) => {
    this.setState({ filter: event.target.value });
  }

  renderDropdown(filedName, options) {
    return (
      <select onChange={this.onDropdownChange(filedName)} value={this.state[filedName]} >
        <option key={1} value="1"></option>
        {options.map((option) => {
          return (<option key={option} value={option}>{option}</option>);
        })}
      </select>
    );
  }

  renderFilters() {
    const { filter } = this.state;
    return (
    <div>
      <label>
          <input type="radio" value={CHEAPEST_FILTER} checked={filter === CHEAPEST_FILTER} onChange={this.onOptionChange} />
          Cheapest
        </label>
        <label>
          <input type="radio" value="fastest" checked={filter === FASTEST_FILTER} onChange={this.onOptionChange} />
          Fastest
        </label>
    </div>
    );
  }

  render() {
    const { deals } = this.props;
    const { departureList, arrivalList, departure, arrival, invalidForm: { message } } = this.state;
    const departureOptions = departureList.filter((item) => item !== arrival);
    const arrivalOptions = arrivalList.filter((item) => item !== departure);
    
    return (
      <div>
        <h2>SearchForm</h2>
        {message}
        {!deals.length && 'Loading all possible destinations...'}
        <br />
        <label>
          From:
          {this.renderDropdown('departure', departureOptions)}
        </label>
        <label>
          To:
          {this.renderDropdown('arrival', arrivalOptions)}
        </label>
        {this.renderFilters()}
        <button onClick={this.onSearch}>Search</button>
      </div>
    )
  }
}