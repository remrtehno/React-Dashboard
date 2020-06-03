import React, {useEffect, useState} from 'react';
import {Col, Row, Input, Button, Modal, ModalBody, Table} from "reactstrap";
import _ from 'lodash';
import Select from 'react-select';
import {useHistory} from 'react-router-dom';

import {useVacancyApi, useVacancyPutApi} from "./useVacanciesApi";
import {get} from '../../api'

const deleteExternalId = (setVacancy, id) => {
  setVacancy(vacancy => {
    const newVacancy = _.cloneDeep(vacancy);
    newVacancy.externalIds = newVacancy.externalIds.filter(item => item.id !== id);

    return newVacancy
  })
};

const renderExternalIdsTable = (exIds, setVacancy) => {
  if (exIds && exIds.length) {
    return (
      <div className='col-lg-6 p-0'>
        <Table className='table table-sm'>
          <thead>
          <tr className='table-secondary'>
            <td> System </td>
            <td> ID </td>
            <td/>
          </tr>
          </thead>
          <tbody>
          {
            exIds.map((item, index) => {
              return (
                <tr key={item.id + index}>
                  <td> {item.system} </td>
                  <td
                    style={{maxWidth: '100px'}}
                    className='text-truncate'
                  >
                    {item.id}
                  </td>
                  <td className='text-right'>
                    <i
                      className='cui-trash icon text-danger cursor-pointer'
                      onClick={() => deleteExternalId(setVacancy, item.id)}
                    />
                  </td>
                </tr>
              )
            })
          }
          </tbody>
        </Table>
      </div>
    )
  }
};

const getDataBySearch = (url, setData, search = "") => {
  if (search.length) {
    get(url)
      .then(res => setData(res.items.filter(item => item.name.includes(search))))
  }
};

const Component = (props) => {
  let history = useHistory();
  const vacancyId = props.match.params.id;
  const [vacancy, setVacancy, load] = useVacancyApi();
  const [loadPut] = useVacancyPutApi();
  const [modal, setModal] = useState({modal: false});
  const [externalIds, setExternalIds] = useState({});
  const [regions, setRegions] = useState([]);
  const [profiles, setProfiles] = useState([]);

  const toggle = () => {
    setModal({modal: !modal.modal, });
  };

  useEffect(() => {
    load(vacancyId);
  }, []);

  const editVacancy = (value, key, key2 = null) => {
    setVacancy((vacancy) => {
      const newVacancy = _.cloneDeep(vacancy);
      if(key2) {
        newVacancy[key][key2] = value;
        return newVacancy;
      }
      newVacancy[key] = value;
      return newVacancy;
    });
  };

  const addExternalIds = (value, key) => {
    setExternalIds({...externalIds, [key]: value });
  };

  const addToVacancy = (value, key) => {
    setVacancy( vacancy => {
      const newVacancy = _.cloneDeep(vacancy);
      newVacancy[key].push(value);
      return newVacancy;
    });
  };

  const exIds = vacancy.externalIds.map(field => ({ system: field.system, id: field.id }));


  return (
    <div className="animated fadeIn">
      <Row>
        <Col lg="12" className="mb-3"> <h2> Редактировать вакансию </h2> </Col>
        <Col lg="12" className="mb-3">
          Название
          <Input type="text" onChange={(event) => { editVacancy(event.target.value, 'name', null) } } value={vacancy.name} />
        </Col>
        <Col lg="12" className="mb-3">
          Регион
          <Select
            value={vacancy.region}
            getOptionLabel={option => option.name}
            getOptionValue={option => option.id}
            closeMenuOnSelect
            options={regions}
            onInputChange={(val) => getDataBySearch('/api/regions', setRegions, val)}
            onChange={region => setVacancy({...vacancy, region: {name: region.name, id: region.id}})}
          />
        </Col>
        <Col lg="12" className="mb-3">
          Профиль
          <Select
            value={vacancy.profile}
            closeMenuOnSelect
            getOptionLabel={option => option.name}
            getOptionValue={option => option.id}
            options={profiles}
            onInputChange={val => getDataBySearch('/api/profiles', setProfiles, val)}
            onChange={profile => setVacancy({...vacancy, profile: {name: profile.name, id: profile.id}})}
          />
        </Col>
        <Col lg="5" className="mb-3">
          Зарплата От
          <Input type="number" onChange={(event) => { editVacancy(+event.target.value, 'salary','from') } } value={vacancy.salary ? vacancy.salary.from : ''}/>
        </Col>
        <Col lg="5" className="mb-3">
          Зарплата До
          <Input type="number" onChange={(event) => { editVacancy(+event.target.value, 'salary','to') } } value={vacancy.salary ? vacancy.salary.to : ''}  />
        </Col>
        <Col lg="2" className="mb-3">
          Валюта
          <Select
            value={vacancy.salary && {value: vacancy.salary.currency, label: vacancy.salary.currency}}
            closeMenuOnSelect={true}
            options={ [{value: 'Rub', label: 'Rub'}, {value: 'Usd', label: 'Usd'}, {value: 'Eur', label: 'Eur'}] }
            onChange={ (value) => { editVacancy(value.value, 'salary', 'currency')} } />
        </Col>
        <Col lg="12" className="mb-3">
          Места
          <Input type="number"  onChange={(event) => { editVacancy(+event.target.value, 'openPositions') } } value={vacancy.openPositions}  />
        </Col>
        <Col lg="12" className="mb-3">
          Внешние ID
          <div className="d-lg-flex">
            {renderExternalIdsTable(exIds, setVacancy)}
            <Button disabled={_.isEmpty('externalIds')} onClick={ () => toggle()} className="ml-lg-3 align-self-start">Добавить</Button>
          </div>
          <Modal isOpen={modal.modal} toggle={toggle} >
            <ModalBody>
              <Input className="mb-3" type="text" onChange={(event) => { addExternalIds(event.target.value, 'id') } } placeholder={'ID'} />
              <Select
                className="mb-3"
                placeholder={"System"}
                closeMenuOnSelect={true}
                options={ [{value: 'Skillaz', label: 'Skillaz'}, {value: 'SuccessFactors', label: 'SuccessFactors'}] }
                onChange={ (value) => addExternalIds(value.value, 'system')} />
              <Button disabled={_.isEmpty(externalIds)} onClick={ () => { addToVacancy(externalIds, 'externalIds');  toggle(); }} className="mr-1">Добавить</Button>
            </ModalBody>
          </Modal>
        </Col>
        <Col lg="12" className="mb-3">
          Статус
          <Select
            className="mb-3"
            value={{value: vacancy.status, label: vacancy.status}}
            closeMenuOnSelect={true}
            options={ [{value: 'Active', label: 'Active'}, {value: 'Stopped', label: 'Stopped'}] }
            onChange={ (value) => { editVacancy(value.value, 'status')} } />
        </Col>
        <Col lg="12" className="mb-3">
          <Button
            className="mt-3"
            color="primary"
            onClick={() => {
              loadPut(vacancyId, vacancy)
                .then(res => {
                  if (res) history.push('/vacancies')
                })
            }}
          >
            Сохранить
          </Button>
        </Col>
      </Row>
    </div>
  );
};

export default Component;
