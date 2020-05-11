import React, {useEffect, useState} from 'react';
import { Table, Row, Col, Container, Button, Input, Label } from 'reactstrap';
import { get, post } from '../../api';
import { Link } from 'react-router-dom';
import Select from 'react-select';

const headers = [
  {label: 'Кампания'},
  {label: 'Вакансии'},
  {
    label: 'Бюджет',
    sortField: 'Budget'
  },
  {
    label: 'Потрачено',
    sortField: 'Cost'
  },
  {
    label: 'Клики',
    secondLabel: 'CPC',
    sortField: 'Clicks',
    secondSortField: 'Cpc'
  },
  {
    label: 'Кандидаты',
    secondLabel: 'CPL',
    sortField: 'Candidates',
    secondSortField: 'Cpl'
  },
  {
    label: 'Интервью',
    secondLabel: 'CPA',
    sortField: 'Interviews',
    secondSortField: 'Cpa'
  }
];

const changeCompanyStatus = (row, status, allCompanies, setAllCompanies) => {
  const newCompanyStatus = status === 'start' ? 'on' : 'off';

  if (newCompanyStatus !== row.state) {
    post(`/api/yandex-direct/campaigns/${row.id}/${status}`)
      .then(res => {
        if (res.status === 200) {
          const newCompanies = allCompanies.map(company => {
            if (company.id === row.id) {
              return {...company, state: newCompanyStatus};
            }

            return company
          });

          setAllCompanies(newCompanies)
        }
      });
  }
};

const renderTableRows = (rows, allCompanies, setAllCompanies) => {
  if (rows.length > 0) {
    return rows.map(row => {
      if (row.state === 'archived') {
        return null
      }
      const backgroundColor = row.state === 'on' ? 'bg-turquoise' : 'bg-secondary';
      const colClasses = `mr-1 ml-1 text-center align-middle ${backgroundColor}`;

      let iconsClasses = {
        active: 'fa fa-play-circle fa-2x cursor-pointer',
        stopped: 'fa fa-stop-circle fa-2x mr-2 cursor-pointer',
        inEdition: 'fa fa-gear fa-2x mr-2 cursor-pointer'
      };

      switch (row.state) {
        case 'on':
          iconsClasses.active += ' text-black-50';
          iconsClasses.active = iconsClasses.active.replace('cursor-pointer', '');
          break;
        case 'off':
          iconsClasses.stopped += ' text-black-50';
          iconsClasses.stopped = iconsClasses.stopped.replace('cursor-pointer', '');
          break;
        case 'edit':
          iconsClasses.inEdition += ' text-black-50';
          iconsClasses.inEdition = iconsClasses.inEdition.replace('cursor-pointer', '');
          break;
        default:
          break
      }

      let vacancies = '';

      row.vacancies.map((vacancy, index) => {
        vacancies += vacancy.name;
        if (index < (row.vacancies.length-1)) {
          vacancies += ', '
        }
      });

      return (
        <tr key={row.id}>
          <td className={colClasses}>
            <h6>
              Yandex
            </h6>
            <span className='text-white'>
            {row.state}
            </span>
            <div style={{minWidth: '90px'}}>
              <i className={iconsClasses.inEdition}/>
              <i
                className={iconsClasses.stopped}
                onClick={() => changeCompanyStatus(row, 'stop', allCompanies, setAllCompanies)}
              />
              <i
                className={iconsClasses.active}
                onClick={() => changeCompanyStatus(row, 'start', allCompanies, setAllCompanies)}
              />
            </div>
          </td>
          <td className={colClasses}>
            <h6>
              {row.region ? row.region.name : 'Город не выбран'}
            </h6>
            <p>
              <small>
                {vacancies}
              </small>
            </p>
          </td>
          <td className={colClasses}>
            <div>
              <u className='d-block'>
                {row.weeklyBudget} &#8381;
              </u>
              <small>
                в неделю
              </small>
            </div>
            <div>
              <u className='d-block'>
                {row.maxCPC} &#8381;
              </u>
              <small>
                макс. CPC
              </small>
            </div>
          </td>
          <td className={colClasses}>
            {row.spent} руб.
          </td>
          <td className={colClasses}>
            <div>
              {row.clicks}
            </div>
            <div className='border-top border-dark'>
              {row.cpc}
            </div>
          </td>
          <td className={colClasses}>
            <div>
              {row.candidates}
            </div>
            <div className='border-top border-dark'>
              {row.cpl}
            </div>
          </td>
          <td className={colClasses}>
            <div>
              {row.interviews}
            </div>
            <div className='border-top border-dark'>
              {row.cpa}
            </div>
          </td>
        </tr>
      )
    })
  }

  return (
    <tr>
      <td colSpan={7} className='text-center bg-secondary'>
          No data...
      </td>
    </tr>
  )
};

const calcOptions = (rows = [], type = null) => {
  let options = {
    'Все': 'Все',
  };

  if (type === 'regions') {
    rows.map(row => {
      if (row.region) {
        options[row.region.name] = row.region.name
      }
    });
  } else if (type === 'profiles') {
    rows.map(row => {
      row.vacancies.map(vacancy => options[vacancy.name] = vacancy.name)
    })
  } else {
    options = {
      ...options,
      'Активные': 'on',
      'Остановленные': 'off',
      'Требуют доработки': 'suspended'
    }
  }

  let result = [];

  for (let [key, value] of Object.entries(options)) {
    result.push({label: key, value})
  }

  return result;
};

const filterCompanies = (rows, filters) => {
  let filteredRows = rows;
  if (filters.company !== 'Все') {
    filteredRows = filteredRows.filter(row => row.state === filters.company)
  }
  if (filters.region !== 'Все') {
    filteredRows = filteredRows.filter(row => row.region && row.region.name === filters.region)
  }
  if (filters.profile !== 'Все') {
    filteredRows = filteredRows.filter(row => row.profiles.find(vacancy => vacancy.name === filters.profile))
  }

  return filteredRows
};

const renderSortTriangle = (sortBy, sortField) => {
  const isSortedField = sortField === sortBy.Sort;

  if (isSortedField) {
    if (sortBy.Direction === 'Asc') {
      return (
        <span className='ml-1'>
          &#9650;
        </span>
      )
    }
    if (sortBy.Direction === 'Desc') {
      return (
        <span className='ml-1'>
          &#9660;
        </span>
      )
    }
  }

  return null
};

const sortCompanies = (sortField, setSortBy) => {
  if (sortField) {
    const isAscDirection = sortField === 'Cpc' ||
      sortField === 'Cpl' ||
      sortField === 'Cpa';

    const defaultDirection = isAscDirection ? 'Asc' : 'Desc';

    setSortBy(sortBy => {
      let newDirection = defaultDirection;
      if (sortBy.Sort === sortField) {
        newDirection = sortBy.Direction === 'Desc' ? 'Asc' : 'Desc';
      }

      const newSortBy = {
        Sort: sortField,
        Direction: newDirection
      };

      return newSortBy
    })
  }
};

const Component = () => {
  const [allCompanies, setAllCompanies] = useState([]);
  const [filters, setFilters] = useState({
    company: 'Все',
    region: 'Все',
    profile: 'Все'
  });
  const [sortBy, setSortBy] = useState({
    Sort: '',
    Direction: ''
  });

  useEffect(() => {
    get('/api/yandex-direct/campaigns').then(res => {
      if (res && res.items) setAllCompanies(res.items)
    })
  }, []);

  useEffect(() => {
    get('/api/yandex-direct/campaigns', sortBy)
      .then(res => setAllCompanies(res.items))
  }, [sortBy]);

  const filteredCompanies = filterCompanies(allCompanies, filters);

  return (
    <Container fluid={true}>
      <Row className='mb-3'>
        <Col className='d-flex justify-content-between'>
          <h2>Yandex direct</h2>
          <Link to='/yandex-direct/create-company'>
            <Button className='bg-turquoise-button text-white'>
              Новая кампания +
            </Button>
          </Link>
        </Col>
      </Row>
      <Row className='mb-3'>
        <Col>
          Кампании
          <Select
            closeMenuOnSelect={true}
            options={calcOptions(allCompanies)}
            onChange={ (selected) => setFilters({...filters, company: selected.value}) }
            defaultValue={calcOptions(allCompanies)[0]}
          />
        </Col>
        <Col>
          Города
          <Select
            closeMenuOnSelect={true}
            options={calcOptions(allCompanies, 'regions')}
            onChange={ (selected) => setFilters({...filters, region: selected.value}) }
            defaultValue={calcOptions(allCompanies, 'regions')[0]}
          />
        </Col>
        <Col>
          Профили
          <Select
            closeMenuOnSelect={true}
            options={calcOptions(allCompanies, 'profiles')}
            onChange={ (selected) => setFilters({...filters, profile: selected.value}) }
            defaultValue={calcOptions(allCompanies, 'profiles')[0]}
          />
        </Col>
        <Col>
          <Label className='w-100'>
            Начало периода
            <Input
              type="date"
              name="date"
            />
          </Label>
        </Col>
        <Col>
          <Label className='w-100'>
            Конец периода
            <Input
              type="date"
              name="date"
            />
          </Label>
        </Col>
      </Row>
      <Table style={{borderCollapse: 'unset'}}>
        <thead>
          <tr>
            {
              headers.map((header, index) => {
                const isSortableCol = Boolean(header.sortField);
                const colClass = isSortableCol ? 'cursor-pointer' : ' text-decoration-none';

                return (
                  <th key={index} className='bg-turquoise'>
                    <div>
                      <u
                        className={colClass}
                        onClick={() => sortCompanies(header.sortField, setSortBy)}
                      >
                        {header.label}
                        {header.sortField && renderSortTriangle(sortBy, header.sortField)}
                      </u>
                      {
                        header.secondLabel && (
                          <u
                            className={colClass}
                            onClick={() => sortCompanies(header.secondSortField, setSortBy)}
                          >
                            {' / ' + header.secondLabel}
                            {renderSortTriangle(sortBy, header.secondSortField)}
                          </u>
                        )
                      }
                    </div>
                  </th>
                )
              })
            }
          </tr>
        </thead>
        <tbody>
          {renderTableRows(filteredCompanies, allCompanies, setAllCompanies)}
        </tbody>
      </Table>
    </Container>
  );
};

export default Component;
