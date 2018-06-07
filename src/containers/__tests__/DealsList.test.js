import React from 'react';
import { shallow } from 'enzyme';
import DealsList from '../DealsList';
import data from '../../../public/api/response.json';

describe('DealsList', () => {
  let deals;

  beforeEach(() => {
    deals = data.deals;
  });

  it('renders without crashing', () => {
    const wrapper = shallow(<DealsList />);
    const title = <h2>Route description</h2>;
    expect(wrapper.contains(title)).toEqual(true);
  });

  it('renders route description', () => {
    const tripRoute = [deals[0].reference];
    const wrapper = shallow(<DealsList deals={deals} tripRoute={tripRoute}/>);
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('no route found', () => {
    const wrapper = shallow(<DealsList deals={deals} tripRoute={[]} />);
    const message = <div>Sorry, no connection found</div>;
    expect(wrapper.contains(message)).toEqual(true);
  })

});