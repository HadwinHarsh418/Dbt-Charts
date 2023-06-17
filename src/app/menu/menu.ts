import { CoreMenu } from '@core/types';

export const menu: CoreMenu[] = [
  {
    id: 'dashboard',
    title: 'Dashboard',
    type: 'item',
    icon: 'home',
    url: 'dashboard'
  },
  {
    id: 'chartSettings',
    title: 'Chart Settings',
    type: 'item',
    fontAwesomeIcon: ' fa fa-cogs',
    icon: '',
    url: 'setting'
  },
  {
    id: 'chart',
    title: 'Charts',
    type: 'item',
    fontAwesomeIcon: ' fa fa-area-chart',
    icon: '',
    url: 'chart'
  },
  {
    id: 'RetrieveChart',
    title: 'Retrieve Chart',
    type: 'item',
    fontAwesomeIcon: ' fa fa-area-chart',
    icon: '',
    url: 'Retrieve-Chart'
  },

];
