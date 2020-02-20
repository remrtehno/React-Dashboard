import React, {useEffect, useState} from 'react';
import {Col, Row, Button, Input, Modal, ModalBody} from "reactstrap";
import _ from 'lodash';
import Select from 'react-select';
import Fuse from 'fuse.js';

import {useVacanciesApi} from "./useVacanciesApi";
import {Link} from "react-router-dom";


const Component = () => {
  const [getAllVacancies, load] = useVacanciesApi();
  const [filters, setFilters] = useState({});
  const [fuseQuery, setFuseQuery] = useState({});
  const [modal, setModal] = useState({modal: false});

  useEffect(() => {
    load();
  }, []);

  let filteredVacancy = _.filter(getAllVacancies, filters);
  const fuse = new Fuse(filteredVacancy, { keys: ['name'] });
  const toggle = () => {
    setModal({modal: !modal.modal, });
  };

  //console.log(fuse.search({}));

  const getFields = (field) => {
    if(getAllVacancies.length === 0) return; 
    return getAllVacancies.reduce( (result, object) => {
      (Array.isArray(result) || (result = []));
      if(result.find( name => name.value === object[field].name)) return result;
      result.push({value: object[field].name, label: object[field].name});
      return result; 
    });
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
                    setFuseQuery( (filters) => {
                      return {...filters, name: query };
                    }); 
                  } else {
                    delete filters.name;
                    setFuseQuery({...filters}); 
                  }                
                } 
              }
              />
            </Col>
            <Col lg="2">
              <Select
                    placeholder={"Статус"}
                    closeMenuOnSelect={true}
                    options={ [{value: 'active', label: 'Активные'}, {value: 'stopped', label: 'Неактивные'}] } 
                    onChange={ 
                      (value) => { 
                        setFilters( (filters) => {
                          return {...filters, status: value.value};
                        }); 
                      } 
                    }
                    />
            </Col>
            <Col lg="2">
              <Select
                  placeholder={"Регион"}
                  closeMenuOnSelect={true}
                  options={ getFields('region') } 
                  onChange={ (value) => {   } }
                  />
            </Col>
            <Col lg="2">
              <Select
                placeholder={"Профиль"}
                closeMenuOnSelect={true}
                options={ getFields('profile') } 
               />
            </Col>
            <Col lg="1">
              <Button onClick={toggle}> Добавить </Button>
              <Modal isOpen={modal.modal} toggle={toggle} >
                <ModalBody>
                  
                </ModalBody>
              </Modal>
            </Col>
          </Row>
            <hr color="black"/>
            {
              _.map(filteredVacancy, (value, key) => {
                return (
                  <Link key={key} className="vacancy" to={`vacancy/${value.id}`} >
                    <div className="d-flex justify-content-between">
                      <div className="name">
                        {`${value.name}`}, {`${value.region.name}`}
                        {_.map(value.profile.externalIds, field => { return field.system })}
                      </div>
                      <div>
                          <Link to={`/vacancy/edit/${value.id}`} >
                            <Button color="primary">Редактировать</Button>
                          </Link>
                      </div>
                    </div>

                      <div className="d-inline-block align-top mr-5">
                        <table cellPadding="2">
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
                        </table>
                      </div>
                      <div className="d-inline-block align-top">
                        <table cellPadding="2">
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
                        </table>
                      </div>
                  </Link>
                )
              })
            }
        </Col>
      </Row>
    </div>
  );
};

export default Component;
