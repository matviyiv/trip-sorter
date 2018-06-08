import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './SearchForm.css';

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

  onSearch = (e) => {
    const { departure, arrival, filter } = this.state;
    e.preventDefault();

    if (!departure) {
      return this.setState({ invalidForm: { message: 'Please select departure' }})
    }

    if (!arrival) {
      return this.setState({ invalidForm: { message: 'Please select arrival' }})
    }

    this.props.triggerSearch(departure, arrival, filter);
  }

  onDropdownChange = (fieldName) => (event) => {
    this.setState({ [fieldName]: event.target.value, invalidForm: {} });
  }

  onOptionChange = (event) => {
    this.setState({ filter: event.target.value });
  }

  renderDropdown(fieldName, options) {
    return (
      <select 
        onChange={this.onDropdownChange(fieldName)}
        value={this.state[fieldName]}
        id={fieldName}
        className="form-control"
        >
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
    <span className="radio-holder">
      <div className="radio">
        <label>
          <input type="radio" value={CHEAPEST_FILTER} checked={filter === CHEAPEST_FILTER} onChange={this.onOptionChange} />
          <span className="bmd-radio"></span>
          Cheapest
        </label>
        <label>
          <input type="radio" value="fastest" checked={filter === FASTEST_FILTER} onChange={this.onOptionChange} />
          <span className="bmd-radio"></span>
          Fastest
        </label>
      </div>
    </span>
    );
  }

  render() {
    const { deals } = this.props;
    const { departureList, arrivalList, departure, arrival, invalidForm: { message } } = this.state;
    const departureOptions = departureList.filter((item) => item !== arrival);
    const arrivalOptions = arrivalList.filter((item) => item !== departure);
    
    return (
      <div className="search-form">
        <h2>Trip Sorter</h2>
        {message}
        {!deals.length && 'Loading all possible destinations...'}
        <form>
          <div className="bmd-form-group is-filled">
            <label htmlFor="departure" className="bmd-label-floating">
              From
            </label>
            {this.renderDropdown('departure', departureOptions)}
          </div>
          <div className="bmd-form-group is-filled">
            <label htmlFor="arrival" className="bmd-label-floating">
              To
            </label>
            {this.renderDropdown('arrival', arrivalOptions)}
          </div>
          <div className="form-group">
            {this.renderFilters()}
          </div>
          <button onClick={this.onSearch} className="btn btn-primary btn-raised">
            Search
          </button>
        </form>
      </div>
    )
  }
}