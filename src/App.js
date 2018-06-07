import React, { Component } from 'react';
import SearchForm from './containers/SearchForm';
import DealsList from './containers/DealsList';
import { getAllDeals } from './services/deals';
import { findRoute } from './utils';
import './App.css';

class App extends Component {
  state = {
    showDeals: false,
    currency: 'EUR',
    deals: [],
    tripRoute: [],
    departure: '',
    arrival: '',
    filter: '',
  }

  componentWillMount() {
    getAllDeals()
      .then(({ currency, deals }) => this.setState({ currency, deals }))
      .catch((error) => console.error('Error getAllDeals', error));
  }

  onSearch = (departure, arrival, filter) => {
    const tripRoute = findRoute(this.state.deals, departure, arrival, filter);
    this.setState({ showDeals: true, tripRoute, departure, arrival, filter });
  }

  onReset = () => {
    this.setState({ showDeals: false });
  }

  render() {
    const { showDeals, deals, tripRoute, currency, departure, arrival, filter } = this.state;
    return (
      <div className="App">
        {showDeals ? 
          <DealsList
            triggerReset={this.onReset}
            deals={deals}
            tripRoute={tripRoute}
            currency={currency}
            /> :
          <SearchForm
            triggerSearch={this.onSearch}
            deals={deals}
            departure={departure}
            arrival={arrival}
            filter={filter} 
            />
        }
      </div>
    );
  }
}

export default App;
