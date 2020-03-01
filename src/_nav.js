export default {
  items: [
    {
      name: 'Dashboard',
      url: '/dashboard',
      icon: 'icon-speedometer',
    },
    {
      title: true,
      name: 'Main',
      wrapper: {            // optional wrapper object
        element: '',        // required valid HTML5 element tag
        attributes: {}        // optional valid JS object with JS API naming ex: { className: "my-class", style: { fontFamily: "Verdana" }, id: "my-id"}
      },
      class: ''             // optional class names space delimited list for title item ex: "text-center"
    },
    {
      name: 'Динамика',
      url: '/',
      icon: 'icon-pie-chart',
    },
    {
      name: 'Источники',
      url: '/tables',
      icon: 'icon-pie-chart',
    },
    {
      name: 'Скачать отчет в Excel',
      url: '/reports',
      icon: 'icon-pie-chart',
    },
    {
      name: 'Регионы',
      url: '/regions',
      icon: 'icon-settings',
      children: [
        {
          name: 'Просмотреть',
          url: '/regions',
          icon: 'icon-puzzle',
        },
        {
          name: 'Добавить',
          url: '/regions/create',
          icon: 'icon-puzzle',
        },
        {
          name: 'Редактировать',
          url: '/regions/edit-page/',
          icon: 'icon-puzzle',
        }
      ]
    },
    {
      name: 'Вакансии',
      url: '/vacancies',
      icon: 'icon-settings',
    },
    {
      name: 'Профили',
      url: '/profiles',
      icon: 'icon-settings',
    },
    {
      name: 'Пользователи',
      url: '/users',
      icon: 'icon-settings',
      children: [
        {
          name: 'Все пользователи',
          url: '/users',
          icon: 'icon-puzzle',
        },
        {
          name: 'Добавить',
          url: '/user/create/',
          icon: 'icon-puzzle',
        },
      ]
    },
    {
      name: 'Yandex direct',
      url: '/yandex-direct',
      icon: 'icon-settings',
    },
  ],
};
