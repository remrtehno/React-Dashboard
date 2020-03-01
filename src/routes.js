import React from 'react';

const Breadcrumbs = React.lazy(() => import('./views/Base/Breadcrumbs'));
const Cards = React.lazy(() => import('./views/Base/Cards'));
const Carousels = React.lazy(() => import('./views/Base/Carousels'));
const Collapses = React.lazy(() => import('./views/Base/Collapses'));
const Dropdowns = React.lazy(() => import('./views/Base/Dropdowns'));
const Forms = React.lazy(() => import('./views/Base/Forms'));
const Jumbotrons = React.lazy(() => import('./views/Base/Jumbotrons'));
const ListGroups = React.lazy(() => import('./views/Base/ListGroups'));
const Navbars = React.lazy(() => import('./views/Base/Navbars'));
const Navs = React.lazy(() => import('./views/Base/Navs'));
const Paginations = React.lazy(() => import('./views/Base/Paginations'));
const Popovers = React.lazy(() => import('./views/Base/Popovers'));
const ProgressBar = React.lazy(() => import('./views/Base/ProgressBar'));
const Switches = React.lazy(() => import('./views/Base/Switches'));
const Tables = React.lazy(() => import('./views/Base/Tables'));
const Tabs = React.lazy(() => import('./views/Base/Tabs'));
const Tooltips = React.lazy(() => import('./views/Base/Tooltips'));
const BrandButtons = React.lazy(() => import('./views/Buttons/BrandButtons'));
const ButtonDropdowns = React.lazy(() => import('./views/Buttons/ButtonDropdowns'));
const ButtonGroups = React.lazy(() => import('./views/Buttons/ButtonGroups'));
const Buttons = React.lazy(() => import('./views/Buttons/Buttons'));
const Charts = React.lazy(() => import('./views/Charts'));
const Dashboard = React.lazy(() => import('./views/Dashboard'));
const CoreUIIcons = React.lazy(() => import('./views/Icons/CoreUIIcons'));
const Flags = React.lazy(() => import('./views/Icons/Flags'));
const FontAwesome = React.lazy(() => import('./views/Icons/FontAwesome'));
const SimpleLineIcons = React.lazy(() => import('./views/Icons/SimpleLineIcons'));
const Alerts = React.lazy(() => import('./views/Notifications/Alerts'));
const Badges = React.lazy(() => import('./views/Notifications/Badges'));
const Modals = React.lazy(() => import('./views/Notifications/Modals'));
const Colors = React.lazy(() => import('./views/Theme/Colors'));
const Typography = React.lazy(() => import('./views/Theme/Typography'));
const Widgets = React.lazy(() => import('./views/Widgets/Widgets'));
const Users = React.lazy(() => import('./views/Users/Users'));
const User = React.lazy(() => import('./views/Users/User'));
const UserEdit = React.lazy(() => import('./views/Users/UserEdit'));
const UserCreate = React.lazy(() => import('./views/Users/UserCreate'));
const TablesMd = React.lazy(() => import('./views/Tables'));
const Reports = React.lazy(() => import('./views/Reports'));
const Regions = React.lazy(() => import('./views/Regions'));
const RegionEdit = React.lazy(() => import('./views/Regions/RegionEdit'));
const RegionDetail = React.lazy(() => import('./views/Regions/RegionDetail'));
const RegionsIndexEdit = React.lazy(() => import('./views/Regions/indexEdit'));
const RegionsIndexCreate = React.lazy(() => import('./views/Regions/indexCreate'));
const Vacancies = React.lazy(() => import('./views/Vacancies/'));
const VacanciesEdit = React.lazy(() => import('./views/Vacancies/indexEdit'));
const VacancyEdit = React.lazy(() => import('./views/Vacancies/VacancyEdit'));
const VacanciesCreate = React.lazy(() => import('./views/Vacancies/indexCreate'));
const VacancyDetail = React.lazy(() => import('./views/Vacancies/VacancyDetail'));
const YandexDirect = React.lazy(() => import('./views/YandexDirect'));
const CreateCompany = React.lazy(() => import('./views/YandexDirect/createCompany/CreateCompany'));



// https://github.com/ReactTraining/react-router/tree/master/packages/react-router-config
const routes = [
  { path: '/', exact: true, name: 'Главная' },
  { path: '/dashboard', name: 'Динамика', component: Dashboard },
  { path: '/tables', name: 'Источники', component: TablesMd },
  { path: '/theme', exact: true, name: 'Theme', component: Colors },
  { path: '/theme/colors', name: 'Colors', component: Colors },
  { path: '/theme/typography', name: 'Typography', component: Typography },
  { path: '/base', exact: true, name: 'Base', component: Cards },
  { path: '/base/cards', name: 'Cards', component: Cards },
  { path: '/base/forms', name: 'Forms', component: Forms },
  { path: '/base/switches', name: 'Switches', component: Switches },
  { path: '/base/tables', name: 'Tables', component: Tables },
  { path: '/base/tabs', name: 'Tabs', component: Tabs },
  { path: '/base/breadcrumbs', name: 'Breadcrumbs', component: Breadcrumbs },
  { path: '/base/carousels', name: 'Carousel', component: Carousels },
  { path: '/base/collapses', name: 'Collapse', component: Collapses },
  { path: '/base/dropdowns', name: 'Dropdowns', component: Dropdowns },
  { path: '/base/jumbotrons', name: 'Jumbotrons', component: Jumbotrons },
  { path: '/base/list-groups', name: 'List Groups', component: ListGroups },
  { path: '/base/navbars', name: 'Navbars', component: Navbars },
  { path: '/base/navs', name: 'Navs', component: Navs },
  { path: '/base/paginations', name: 'Paginations', component: Paginations },
  { path: '/base/popovers', name: 'Popovers', component: Popovers },
  { path: '/base/progress-bar', name: 'Progress Bar', component: ProgressBar },
  { path: '/base/tooltips', name: 'Tooltips', component: Tooltips },
  { path: '/buttons', exact: true, name: 'Buttons', component: Buttons },
  { path: '/buttons/buttons', name: 'Buttons', component: Buttons },
  { path: '/buttons/button-dropdowns', name: 'Button Dropdowns', component: ButtonDropdowns },
  { path: '/buttons/button-groups', name: 'Button Groups', component: ButtonGroups },
  { path: '/buttons/brand-buttons', name: 'Brand Buttons', component: BrandButtons },
  { path: '/icons', exact: true, name: 'Icons', component: CoreUIIcons },
  { path: '/icons/coreui-icons', name: 'CoreUI Icons', component: CoreUIIcons },
  { path: '/icons/flags', name: 'Flags', component: Flags },
  { path: '/icons/font-awesome', name: 'Font Awesome', component: FontAwesome },
  { path: '/icons/simple-line-icons', name: 'Simple Line Icons', component: SimpleLineIcons },
  { path: '/notifications', exact: true, name: 'Notifications', component: Alerts },
  { path: '/notifications/alerts', name: 'Alerts', component: Alerts },
  { path: '/notifications/badges', name: 'Badges', component: Badges },
  { path: '/notifications/modals', name: 'Modals', component: Modals },
  { path: '/widgets', name: 'Widgets', component: Widgets },
  { path: '/charts', name: 'Charts', component: Charts },
  { path: '/users', exact: true,  name: 'Пользователи', component: Users },
  { path: '/users/:id', exact: true, name: 'Просмотр пользователя', component: User },
  { path: '/users/edit/:id', exact: true, name: 'Редактировать пользователя', component: UserEdit },
  { path: '/user/create/', exact: true, name: 'Создать пользователя', component: UserCreate },
  { path: '/reports', exact: true, name: 'Скачать в Excel', component: Reports },
  { path: '/regions', exact: true, name: 'Регионы', component: Regions },
  { path: '/region/:id', exact: true, name: 'Регионы', component: RegionDetail },
  { path: '/regions/create/', exact: true, name: 'Регионы', component: RegionsIndexCreate },
  { path: '/regions/edit-page/', exact: true, name: 'Регионы', component: RegionsIndexEdit },
  { path: '/regions/edit/:id', exact: true, name: 'Редактировать Регион', component: RegionEdit },
  { path: '/vacancies', exact: true, name: 'Вакансии', component: Vacancies },
  { path: '/vacancies/create', exact: true, name: 'Вакансии', component: VacanciesCreate },
  { path: '/vacancies/edit', exact: true, name: 'Вакансии', component: VacanciesEdit },
  { path: '/vacancy/edit/:id', exact: true, name: 'Вакансии', component: VacancyEdit },
  { path: '/vacancy/:id', exact: true, name: 'Вакансии', component: VacancyDetail },
  { path: '/yandex-direct', exact: true, name: 'Yandex direct', component: YandexDirect },
  { path: '/yandex-direct/create-company', exact: true, name: 'Create company', component: CreateCompany },
];

export default routes;
