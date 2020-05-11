import React, {useEffect, useState} from 'react';
import {Col, Row, Button, Input} from "reactstrap";
import _ from 'lodash';
import Select from 'react-select';
import Fuse from 'fuse.js';

import {useVacanciesApi} from "./useVacanciesApi";
import {Link} from "react-router-dom";


const Component = () => {
  const [getAllVacancies, load] = useVacanciesApi();
  const [filters, setFilters] = useState({});
  const [fuseQuery, setFuseQuery] = useState(null);

  useEffect(() => {
    load();
  }, []);

  let filteredVacancy = _.filter(getAllVacancies, filters);
  const fuse = new Fuse(filteredVacancy, { keys: ['name'] });


  if(fuseQuery) {
    filteredVacancy = fuse.search(fuseQuery);
  }

  const getFields = (field) => {
    if(getAllVacancies.length === 0) return [];

    return getAllVacancies.reduce( (result, object) => {
      (Array.isArray(result) || (result = []));
      if(result.find( name => name.value === object[field].name)) return result;
      result.push({value: object[field].name, label: object[field].name});
      return result;
    }, []);
  };

  return (
    <div className="animated fadeIn">
      <Row>
        <Col lg="12" className="mb-3">
          <Row>
            <Col className="flex-grow-0"><h2 className="mb-0"> Вакансии </h2></Col>
            <Col lg="3">
              <Input onChange={
                event => {
                  if(event.target.value) {
                    const query = event.target.value.toString();
                    setFuseQuery(query);
                  } else {
                    setFuseQuery(null);
                  }
                }
              }
              />
            </Col>
            <Col lg="2">
              <Select
                placeholder={"Статус"}
                closeMenuOnSelect={true}
                options={ [{value: 'active', label: 'Активные'}, {value: 'stopped', label: 'Неактивные'}, {value: null, label: 'Все'}] }
                onChange={
                  (value) => {
                    setFilters(filters => {
                      if(value.value) {
                        return {...filters, status: value.value};
                      } else {
                        delete filters.status;
                        return {...filters};
                      }
                    });
                  }
                }
              />
            </Col>
            <Col lg="2">
              <Select
                placeholder={"Регион"}
                closeMenuOnSelect={true}
                options={ [...getFields('region'), {value: null, label: 'Все'}] }
                onChange={
                  (value) => {
                    setFilters( (filters) => {
                      if(value.value) {
                        return {...filters, region: {name: value.value}};
                      } else {
                        delete filters.region;
                        return {...filters};
                      }
                    });
                  }
                }
              />
            </Col>
            <Col lg="2">
              <Select
                placeholder={"Профиль"}
                closeMenuOnSelect={true}
                options={ [ ...getFields('profile'), {value: null, label: 'Все'}] }
                onChange={
                  (value) => {
                    setFilters( (filters) => {
                      if(value.value) {
                        return {...filters, profile: {name: value.value}};
                      } else {
                        delete filters.profile;
                        return {...filters};
                      }
                    });
                  }
                }/>
            </Col>
            <Col lg="1">
              <Link to={`/vacancies/create`} >
                <Button> Добавить </Button>
              </Link>
            </Col>
          </Row>
            <hr color="black"/>
            {
              _.map(filteredVacancy, (value, key) => {
                return (
                  <div key={key} className="vacancy">
                    <div className="d-flex justify-content-between">
                      <div className="name">
                        {`${value.name}`}, {`${value.region.name}`}
                        {_.map(value.profile.externalIds, field => { return field.system })}
                      </div>
                      <div className='d-flex flex-column align-items-end'>
                        <Link
                          className='mb-2'
                          to={`/vacancy/edit/${value.id}`}
                        >
                          <Button color="primary">Редактировать</Button>
                        </Link>
                        <Link to={`vacancy/${value.id}`}>
                          <Button color="primary">Подробнее</Button>
                        </Link>
                      </div>
                    </div>

                      <div className="d-inline-block align-top mr-5">
                        <table cellPadding="2">
                          <tbody>
                            <tr>
                              <td>
                                <div className="vacancy-field">
                                  <b>Профиль:</b>
                                </div>
                              </td>
                              <td>
                                {`${value.profile.name}`}
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <div className="vacancy-field">
                                  <b>Регион:</b>
                                </div>
                              </td>
                              <td>{`${value.region.name}`}</td>
                            </tr>
                            <tr>
                              <td>
                                <div className="vacancy-field">
                                  <b>Статус:</b>
                                </div>
                              </td>
                              <td>{`${value.status}`}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <div className="d-inline-block align-top">
                        <table cellPadding="2">
                          <tbody>
                            <tr>
                              <td>
                                <div className="vacancy-field">
                                  <b>Кампаний:</b>
                                </div>
                              </td>
                              <td>0</td>
                            </tr>
                            <tr>
                              <td>
                                <div className="vacancy-field">
                                  <b>Просмотров сегодня:</b>
                                </div>
                              </td>
                              <td>0</td>
                            </tr>
                            <tr>
                              <td>
                                <div className="vacancy-field">
                                  <b>Отликов сегодня:</b>
                                </div>
                              </td>
                              <td>0</td>
                            </tr>
                            <tr>
                              <td>
                                <div className="vacancy-field">
                                  <b>Интервью сегодня:</b>
                                </div>
                              </td>
                              <td>0</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                  </div>
                )
              })
            }
        </Col>
      </Row>
    </div>
  );
};

export default Component;
