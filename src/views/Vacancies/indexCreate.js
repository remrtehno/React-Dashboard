import React, {useEffect, useState} from 'react';
import {
  Col,
  Row,
  Input,
  Button,
  Modal,
  ModalBody,
  FormGroup,
  FormFeedback,
  Table,
} from "reactstrap";
import _ from 'lodash';
import Select from 'react-select'
import {useHistory} from 'react-router-dom';

import {useLocalRegions} from '../Regions/useRegionsApi';
import {get, post} from '../../api';

const toggle = (setModal) => {
  setModal(modal => !modal);
};

const addExternalIds = (newExternalId, setVacancy) => {
  setVacancy(vacancy => {
    let newVacancy = _.cloneDeep(vacancy);
    if (!vacancy.externalIds) {
      newVacancy.externalIds = [{...newExternalId}]
    } else {
      newVacancy.externalIds = [...newVacancy.externalIds, {...newExternalId}]
    }

    return newVacancy
  })
};

const uploadVacancy = (vacancy, setInvalidFields, history) => {
  const requiredFields = ['region', 'profile', 'name'];
  let invalidFields = [];

  if (!vacancy.salary || !vacancy.salary.from) invalidFields.push('salary');

  requiredFields.forEach(field => {
    if (_.isEmpty(vacancy[field])) invalidFields.push(field)
  });

  if (invalidFields.length) {
    setInvalidFields(invalidFields);
  } else {
    post('/api/vacancies', vacancy)
      .then(res => {
        if (res && res.status === 200) {
          history.push('/vacancies')
        }
      })
  }
};

const renderExternalIdsTable = (vacancy, setVacancy) => {
  if (vacancy.externalIds && vacancy.externalIds.length) {
    return (
      <Col lg="12">
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
              vacancy.externalIds.map((item, index) => {
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
      </Col>
    )
  }
}

const deleteExternalId = (setVacancy, selectedId) => {
  setVacancy(vacancy => {
    const filteredExternalIds = vacancy.externalIds.filter(item => item.id !== selectedId);
    return {...vacancy, externalIds: filteredExternalIds}
  })
};

const Component = () => {
  let history = useHistory();
  const [allRegion, searchField, loadRegionsAll] = useLocalRegions();
  const [allProfiles, setProfiles] = useState([]);

  const [invalidFields, setInvalidFields] = useState([]);
  const [modal, setModal] = useState(false);
  const [newExternalId, setNewExternalId] = useState({});
  const [vacancy, setVacancy] = useState({
    salary: {
      currency: 'Rub'
    },
    status: 'Active'
  });

  useEffect(() => {
    get('/api/profiles')
      .then(res => setProfiles(res.items));
    loadRegionsAll();
  }, []);

  useEffect(() => {
    let newInvalidFields = [...invalidFields];

    const isFilledSalaryField = vacancy.salary && !_.isEmpty(vacancy.salary.from);
    if (isFilledSalaryField) {
      newInvalidFields = newInvalidFields.filter(field => field !== 'salary');
    }

    invalidFields.forEach(field => {
      const isFilledField = vacancy[field] && !_.isEmpty(vacancy[field]);
      if (isFilledField) {
        newInvalidFields = newInvalidFields.filter(f => field !== f)
      }
    });

    setInvalidFields(newInvalidFields)
  }, [vacancy]);

  if (!modal && !_.isEmpty(newExternalId)) setNewExternalId({});    // clear externalId when close modal

  return (
    <div className="animated fadeIn">
      <Row>
        <Col lg="12" className="mb-3">
          <h2> Сохранить в базу </h2>
        </Col>
        <Col lg="6" className="mb-3">
          <h5> Регион </h5>
          <div>
            <Select
              className={invalidFields.includes('region') && 'border rounded border-danger'}
              closeMenuOnSelect={true}
              options={searchField}
              onChange={value => setVacancy({
                ...vacancy,
                region: {
                  id: value.id,
                  name: value.label
                }
              })}
            />
            <div
              className={`invalid-feedback ${invalidFields.includes('region') && 'd-block'}`}
            >
              Поле обязательное для заполнения
            </div>
          </div>
        </Col>
        <Col lg="6" className="mb-3">
          <h5> Профиль </h5>
          <div>
            <Select
              className={invalidFields.includes('profile') && 'border rounded border-danger'}
              closeMenuOnSelect={true}
              options={allProfiles}
              getOptionLabel={option => option.name}
              getOptionValue={option => option.id}
              onChange={value => setVacancy({
                ...vacancy,
                profile: {
                  id: value.id,
                  name: value.name
                }
              })}
            />
            <div
              className={`invalid-feedback ${invalidFields.includes('profile') && 'd-block'}`}
            >
              Поле обязательно для заполнения
            </div>
          </div>
        </Col>
        <Col lg="6" className="mb-3">
          <h5> Название вакансии </h5>
          <FormGroup>
            <Input
              invalid={invalidFields.includes('name')}
              type="text"
              onChange={event => setVacancy({
                ...vacancy,
                name: event.target.value
              })}
            />
            <FormFeedback>
              Поле обязательно для заполнения
            </FormFeedback>
          </FormGroup>
        </Col>
        <Col lg="6" className="mb-3">
          <h5> Количество открытых вакансий </h5>
          <Input
            type="number"
            onChange={event => setVacancy({
              ...vacancy,
              openPositions: +event.target.value
            })}
          />
        </Col>
        <Col lg="12" className="mb-3">
          <h5> Зарплата </h5>
          <Row>
            <Col lg="5" className="mb-3">
              <FormGroup>
                <Input
                  invalid={invalidFields.includes('salary')}
                  type="number"
                  placeholder='От'
                  min='4'
                  onChange={event => setVacancy({
                    ...vacancy,
                    salary: {
                      ...vacancy.salary,
                      from: +event.target.value
                    }
                  })}
                />
                <FormFeedback>
                  Поле обязательно для заполнения
                </FormFeedback>
              </FormGroup>
            </Col>
            <Col lg="5" className="mb-3">
              <Input
                type="text"
                placeholder='До'
                onChange={event => setVacancy({
                  ...vacancy,
                  salary: {
                    ...vacancy.salary,
                    to: +event.target.value
                  }
                })}
              />
            </Col>
            <Col lg="2" className="mb-3">
              <Select
                placeholder={"Rub"}
                closeMenuOnSelect={true}
                defaultValue={{value: 'Rub', label: 'Rub'}}
                options={ [{value: 'Rub', label: 'Rub'}, {value: 'Usd', label: 'Usd'}, {value: 'Eur', label: 'Eur'}] }
                onChange={value => setVacancy({
                  ...vacancy,
                  salary: {
                    ...vacancy.salary,
                    currency: value.value
                  }
                })}
              />
            </Col>
          </Row>
        </Col>
        <Col lg="6" className="mb-3">
          <h5> Статус вакансии </h5>
          <Select
            closeMenuOnSelect={true}
            defaultValue={{value: 'Active', label: 'Активная'}}
            options={ [{value: 'Active', label: 'Активная'}, {value: 'Stopped', label: 'Остановленная'}] }
            onChange={status => setVacancy({
              ...vacancy,
              status: status.value
            })}
          />
          <Button
            className="mt-3"
            onClick={() => uploadVacancy(vacancy, setInvalidFields, history)}
          >
            Отправить
          </Button>
        </Col>
        <Col lg="6" className="mb-3">
          <h5> Внешние ID </h5>
          <Row>
            {renderExternalIdsTable(vacancy, setVacancy)}
            <Col lg="6">
              <Button onClick={() => toggle(setModal)} className="mr-1">Добавить</Button>
            </Col>
          </Row>
          <Modal isOpen={modal} toggle={() => toggle(setModal)} >
            <ModalBody>
              <Input
                className="mb-3"
                type="text"
                onChange={e => setNewExternalId({...newExternalId, id: e.target.value})}
                placeholder='ID'
              />
              <Select
                className="mb-3"
                placeholder={"System"}
                closeMenuOnSelect={true}
                options={ [{value: 'Skillaz', label: 'Skillaz'}, {value: 'SuccessFactors', label: 'SuccessFactors'}] }
                onChange={value => setNewExternalId({...newExternalId, system: value.value})} />
              <Button
                disabled={_.isEmpty(newExternalId)}
                onClick={() => {
                  addExternalIds(newExternalId, setVacancy);
                  toggle(setModal);
                }}
                className="mr-1"
              >
                Добавить
              </Button>
            </ModalBody>
          </Modal>
        </Col>
      </Row>
    </div>
  );
};

export default Component;
