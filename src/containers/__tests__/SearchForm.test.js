import React from 'react';
import { shallow } from 'enzyme';
import SearchForm from '../SearchForm';
import data from '../../../public/api/response.json';

describe('SearchForm', () => {
  let deals;

  beforeEach(() => {
    deals = data.deals;
  });

  it('renders without crashing', () => {
    const wrapper = shallow(<SearchForm />);
    const title = <h2>Trip Sorter</h2>;
    expect(wrapper.contains(title)).toEqual(true);
  });

  it('no deals provided yet', () => {
    const wrapper = shallow(<SearchForm />);
    const text = 'Loading all possible destinations...';
    expect(wrapper.contains(text)).toEqual(true);
  });

  it('submit invalid form should show error', () => {
    const wrapper = shallow(<SearchForm />);
    const text = 'Please select departure';
    wrapper.find('button').simulate('click', { preventDefault: jest.fn() });
    expect(wrapper.contains(text)).toEqual(true);
  });

  it('should render options From and To', () => {
    const wrapper = shallow(<SearchForm deals={deals} />);
    expect(wrapper.find('option').length).toEqual(34);
  });

  it('trigger search with valid params', () => {
    const triggerSearch = jest.fn();
    const wrapper = shallow(<SearchForm deals={deals} triggerSearch={triggerSearch}/>);
    wrapper.find('select#departure').simulate('change', { target: { value: 'London' }});
    wrapper.find('select#arrival').simulate('change', { target: { value: 'Kyiv' }});
    wrapper.find('button').simulate('click', { preventDefault: jest.fn() });
    expect(triggerSearch).toBeCalledWith('London', 'Kyiv', 'cheapest');
  });
});

