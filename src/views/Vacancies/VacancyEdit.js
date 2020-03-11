import React, {useEffect, useState} from 'react';
import {Col, Row, Input, Button, Modal, ModalBody} from "reactstrap";
import _ from 'lodash';
import Select from 'react-select'

import {useVacancyApi, useVacancyPutApi} from "./useVacanciesApi";

const Component = (props) => {
  const vacancyId = props.match.params.id;
  const [vacancy, setVacancy, load] = useVacancyApi();
  const [loadPut] = useVacancyPutApi();
  const [modal, setModal] = useState({modal: false});
  const [externalIds, setExternalIds] = useState({});

  const toggle = () => {
    setModal({modal: !modal.modal, });
  };

  useEffect(() => {
    load(vacancyId);
  }, []);

  const editVacancy = (value, key, key2 = null) => {
    setVacancy((oldArray) => {
      return _.cloneDeep(oldArray).map( field => {
        if(key2) {
          field[key][key2] = value;
          return field;
        }
        field[key] = value;
        return field;
      })
    });
  };

  const addExternarIds = (value, key) => {
    setExternalIds({...externalIds, [key]: value });
  };

  const addToVacancy = (value, key) => {
    setVacancy( oldArray => {
      return _.cloneDeep(oldArray).map( field => {
        field[key].push(value);
        return field;
      })
    });
  };

  const exIds = () => {
    const [{externalIds}] = vacancy;
    return externalIds.map( field => {
      return { value: field.id, label: field.system, id: field.id }
    });
  };

  console.log(vacancy);

  return (
    <div className="animated fadeIn">
      <Row>
        <Col lg="12" className="mb-3"> <h2> Редактировать вакансию </h2> </Col>
        <Col lg="12" className="mb-3">
          Название
          <Input type="text" onChange={(event) => { editVacancy(event.target.value, 'name', null) } } value={vacancy.map( field => field.name )} />
        </Col>
        <Col lg="12" className="mb-3">
          Регион
          <Input type="text" onChange={(event) => { editVacancy(event.target.value, 'region','name') } } value={vacancy.map( field => field.region.name )} />
        </Col>
        <Col lg="12" className="mb-3">
          Профиль
          <Input type="text" onChange={(event) => { editVacancy(event.target.value, 'profile','name') } } value={vacancy.map( field => field.profile.name )} />
        </Col>
        <Col lg="5" className="mb-3">
          Зарплата От
          <Input type="text" onChange={(event) => { editVacancy(event.target.value.replace (/[^0-9]+$/, ''), 'salary','from') } } value={vacancy.map( field => field.salary.from )}  />
        </Col>
        <Col lg="5" className="mb-3">
          Зарплата До
          <Input type="text"  onChange={(event) => { editVacancy(event.target.value.replace (/[^0-9]+$/, ''), 'salary','to') } } value={vacancy.map( field => field.salary.to )}  />
        </Col>
        <Col lg="2" className="mb-3">
          Валюта
          <Select
            value={ { value: vacancy.map( field => field.salary.currency), label: vacancy.map( field => field.salary.currency) }}
            closeMenuOnSelect={true}
            options={ [{value: 'rub', label: 'rub'}, {value: '$', label: '$'}] }
            onChange={ (value) => { editVacancy(value.value, 'salary', 'currency')} } />
        </Col>
        <Col lg="12" className="mb-3">
          Места
          <Input type="text"  onChange={(event) => { editVacancy(event.target.value, 'openPositions') } } value={vacancy.map( field => field.openPositions )}  />
        </Col>
        <Col lg="12" className="mb-3">
          Внешние ID
          <div className="d-sm-flex">
          <Select
            className="flex-grow-1 mb-3 mb-sm-0"
            value={  exIds() }
            options={ exIds() }
            isMulti
            closeMenuOnSelect={true}
            onChange={(value) => {
              editVacancy( _.map(value, ({label, id}) => { return { system: label, id: id, } }), 'externalIds' )
            }} />
          <Button disabled={_.isEmpty('externalIds')} onClick={ () => { toggle(); }} className="ml-sm-3 align-self-center">Добавить</Button>
          </div>
          <Modal isOpen={modal.modal} toggle={toggle} >
            <ModalBody>
              <Input className="mb-3" type="text" onChange={(event) => { addExternarIds(event.target.value, 'id') } } placeholder={'ID'} />
              <Select
                className="mb-3"
                placeholder={"System"}
                closeMenuOnSelect={true}
                options={ [{value: 'Skillaz', label: 'Skillaz'}, {value: 'SF', label: 'SF'}] }
                onChange={ (value) => { addExternarIds(value.value, 'system')} } />
              <Button disabled={_.isEmpty(externalIds)} onClick={ () => { addToVacancy(externalIds, 'externalIds');  toggle(); }} className="mr-1">Добавить</Button>
            </ModalBody>
          </Modal>
        </Col>
        <Col lg="12" className="mb-3">
          Статус
          <Select
            className="mb-3"
            value={ { value: vacancy.map( field => field.status), label: vacancy.map( field => field.status) } }
            closeMenuOnSelect={true}
            options={ [{value: 'active', label: 'Active'}, {value: 'stopped', label: 'Stopped'}] }
            onChange={ (value) => { editVacancy(value.value, 'status')} } />
        </Col>
        <Col lg="12" className="mb-3">
          <Button className="mt-3" onClick={ () => loadPut(vacancyId, vacancy[0]) } color="primary">Сохранить</Button>
        </Col>
      </Row>
    </div>
  );
};

export default Component;
