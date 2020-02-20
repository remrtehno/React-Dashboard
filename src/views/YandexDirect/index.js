import React, {useEffect, useState} from 'react';
import { Table, Row, Col, Container, Button } from 'reactstrap';
import { useCompaniesApi } from "./useYandexDirectApi";
import Select from 'react-select';

const mockHeaders = [
  'Кампания',
  'Вакансии',
  'Бюджет',
  'Потрачено',
  'Клики / CPC',
  'Кандидаты / CPL',
  'Интервью / CPA',
];

const renderTableRows = (rows) => {
  if (rows.length > 0) {
    return rows.map(row => {
      const backgroundColor = row.state === 'on' ? 'bg-turquoise' : 'bg-secondary';
      const colClasses = `mr-1 ml-1 text-center align-middle ${backgroundColor}`;

      let iconsClasses = {
        active: 'fa fa-play-circle fa-2x',
        stopped: 'fa fa-stop-circle fa-2x mr-2',
        inEdition: 'fa fa-gear fa-2x mr-2'
      };

      switch (row.state) {
        case 'on':
          iconsClasses.active += ' text-black-50';
          break;
        case 'stop':
          iconsClasses.stopped += ' text-black-50';
          break;
        case 'edit':
          iconsClasses.inEdition += ' text-black-50';
          break;
        default:
          break
      }

      let profiles = '';

      row.profiles.map((vacancy, index) => {
        profiles += vacancy.name;
        if (index < (row.profiles.length-1)) {

          profiles += ', '
        }
      });

      return (
        <tr key={row.id}>
          <td className={colClasses}>
            <h6>
              Yandex
            </h6>
            <span className={'text-white'}>
            {row.state}
            </span>
            <div style={{minWidth: '90px'}}>
              <i className={iconsClasses.inEdition}/>
              <i className={iconsClasses.stopped}/>
              <i className={iconsClasses.active}/>
            </div>
          </td>
          <td className={colClasses}>
            <h6>
              {row.region.name}
            </h6>
            <p>
              <small>
                {profiles}
              </small>
            </p>
          </td>
          <td className={colClasses}>
            <div>
              <u className={'d-block'}>
                {row.weeklyBudget} &#8381;
              </u>
              <small>
                в неделю
              </small>
            </div>
            <div>
              <u className={'d-block'}>
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
            <div className={'border-top border-dark'}>
              {row.cpc}
            </div>
          </td>
          <td className={colClasses}>
            <div>
              {row.candidates}
            </div>
            <div className={'border-top border-dark'}>
              {row.cpl}
            </div>
          </td>
          <td className={colClasses}>
            <div>
              {row.interviews}
            </div>
            <div className={'border-top border-dark'}>
              {row.cpa}
            </div>
          </td>
        </tr>
      )
    })
  }

  return (
    <tr>
      <td colSpan={7} className={'text-center bg-secondary'}>
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
      options[row.region.name] = row.region.name
    });
  } else if (type === 'profiles') {
    rows.map(row => {
      row.profiles.map(vacancy => options[vacancy.name] = vacancy.name)
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
    filteredRows = filteredRows.filter(row => row.region.name === filters.region)
  }
  if (filters.profile !== 'Все') {
    filteredRows = filteredRows.filter(row => row.profiles.find(vacancy => vacancy.name === filters.profile))
  }

  return filteredRows
};

const Component = () => {
  const [getAllCompanies, load] = useCompaniesApi();
  const [filters, setFilters] = useState({
    company: 'Все',
    region: 'Все',
    profile: 'Все'
  });

  useEffect(() => {
    load();
  }, []);

  console.log(getAllCompanies)

  const filteredCompanies = filterCompanies(getAllCompanies, filters);

  return (
    <Container>
      <Row className={'mb-3'}>
        <Col className={'d-flex flex-row-reverse'}>
          <Button className={'bg-turquoise-button text-white'}> Новая кампания + </Button>
        </Col>
      </Row>
      <Row className={'mb-3'}>
        <Col>
          Кампании
          <Select
            closeMenuOnSelect={true}
            options={calcOptions(getAllCompanies)}
            onChange={ (selected) => setFilters({...filters, company: selected.value}) } />
        </Col>
        <Col>
          Города
          <Select
            closeMenuOnSelect={true}
            options={calcOptions(getAllCompanies, 'regions')}
            onChange={ (selected) => setFilters({...filters, region: selected.value}) } />
        </Col>
        <Col>
          Профили
          <Select
            closeMenuOnSelect={true}
            options={calcOptions(getAllCompanies, 'profiles')}
            onChange={ (selected) => setFilters({...filters, profile: selected.value}) } />
        </Col>
      </Row>
      <Table style={{borderCollapse: 'unset'}}>
        <thead>
          <tr>
            {
              mockHeaders.map((header, index) => {
                return (
                  <th key={index} className={'bg-turquoise text-center'}>
                    {header}
                  </th>
                )
              })
            }
          </tr>
        </thead>
        <tbody>
          {renderTableRows(filteredCompanies)}
        </tbody>
      </Table>
    </Container>
  );
};

export default Component;
