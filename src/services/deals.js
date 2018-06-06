import { fetchGet } from '../utils';
import config from '../config';

export const getAllDeals = async () => {
  try {
    const deals = await fetchGet(config.api.dealsUrl);
    console.log('deals', deals);
    return deals;
  } catch (error) {
    console.error('services/deals.getAllDeals', error);
  }
}
