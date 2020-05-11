import React, {useEffect, useState} from 'react';
import {Col, Row, Button, Input, Modal, ModalBody} from "reactstrap";
import _ from 'lodash';
import Select from 'react-select';
import {useHistory} from 'react-router-dom';

import {useProfileApi, useProfileUpdate, useProfileDelete} from "./useProfilesApi";

const saveTask = (modal, setModal, setProfile) => {
  const {title, description} = modal;

  setProfile(profile => {
    let newTasks = profile.tasks ? [...profile.tasks] : [];

    if (typeof modal.index === "number") {
      newTasks[modal.index] = {title, description};
      return {...profile, tasks: newTasks}
    }

    newTasks.push({title, description})
    return {...profile, tasks: newTasks}
  });

  setModal({
    isOpen: false,
    title: '',
    description: ''
  })
};

const uploadProfile = (profile, history, updateProfile) => {
  updateProfile(profile.id, profile)
    .then(res => {
      if (res.status === 200) {
        history.push('/profiles')
      } else {
        alert('Ошибка')
      }

    })
};

const Component = (props) => {
  let history = useHistory();
  const profileID = props.match.params.id;
  const [profile, getProfile, setProfile] = useProfileApi();
  const [updateProfile] = useProfileUpdate();
  const [deleteProfile] = useProfileDelete();

  const [modal, setModal] = useState({isOpen: false, title: '', description: ''});

  useEffect(() => {
    getProfile(profileID);
  }, []);

  return (
    <div className="animated fadeIn">
      <Row>
        <Col lg="12" className="mb-3">
          <h2> Редактировать профиль </h2>
        </Col>
        <Col lg="12" className="mb-3">
          Название
          <Input
            type="text"
            defaultValue={ profile.name }
            onChange={
              (selected) => setProfile({ ...profile, name: selected.target.value} )
            }
          />
        </Col>
        <Col lg="12" className="mb-3">
          Описание
           <textarea className="d-block w-100 p-1" value={ profile.description }
             onChange={e => setProfile({ ...profile, description: e.target.value} )}
           />
        </Col>
        <Col lg="6" className="mb-3">
          Занятность
          <Select type="text"
            onChange={
              (selected) => setProfile({ ...profile, employment: selected.value} )
            }
            value={ { value: profile.employment, label: profile.employment } }
            options = {
              [{ value: "Полная занятность", label: "Полная занятность" },
               { value: 'Неполная занятность', label: 'Неполная занятность' }]
            }
          />
        </Col>
        <Col lg="6" className="mb-3">
          График
          <Select type="text"
            onChange={selected => setProfile({ ...profile, schedule: selected.value} )}
            value={{ value: profile.schedule, label: profile.schedule }}
            options = {[
              { value: "Без выходных", label: "Без выходных" },
              { value: "пятидневная рабочая неделя, плавающие выходные", label: "пятидневная рабочая неделя, плавающие выходные" }
            ]}
          />
        </Col>
        <Col lg="12" className="mb-3">
          Ключевые слова
          <textarea
            className="d-block w-100 p-1"
            value={ profile.keywords }
            onChange={e => setProfile({...profile, keywords: e.target.value})}
          />
        </Col>
        <Col lg="12" className="mb-3">
          Минус фразы
          <textarea
            className="d-block w-100 p-1"
            value={ profile.negativeKeywords }
            onChange={e => setProfile({...profile, negativeKeywords: e.target.value})}
          />
        </Col>
        <Col lg="12" className="mb-3">
          <h4 className="mb-2"> Задачи </h4>
          <ul className="p-0 tasks" type="none">
            {
              profile.tasks.map( (field, index) => {
                if(!field) return;
                return (
                  <li key={index} className="p-3 mb-3 bg-white">
                    <h5> {field.title} </h5>
                    <div> {field.description} </div>
                    <div className="action-buttons">
                      <Button
                        className="mx-1"
                        onClick={() => setModal({
                          isOpen: true,
                          title: field.title,
                          description: field.description,
                          index
                        })}
                      >
                        <i className="fa fa-pencil"/>
                      </Button>
                      <Button className="mx-1" onClick={ () => {
                        let filterTask = profile.tasks.filter( (id, offset) => offset !== index );
                        setProfile({ ...profile, tasks: filterTask, });
                      }}>
                        <i className="fa fa-trash-o"/>
                      </Button>
                    </div>
                  </li>
                )
              })
            }
          </ul>
          <Button
            className="align-self-center"
            onClick={() => setModal({...modal, isOpen: true})}
          >
            Добавить задачу
          </Button>
          <Modal
            isOpen={modal.isOpen}
            toggle={() => setModal({...modal, isOpen: false})}
          >
            <ModalBody>
              <Input
                className="mb-3"
                defaultValue={modal.title}
                type="text"
                placeholder={'Название'}
                onChange={e => setModal({...modal, title: e.target.value})}
              />
              <Input
                className="mb-3"
                defaultValue={modal.description}
                type="text"
                placeholder={'Описание'}
                onChange={e => setModal({...modal, description: e.target.value})}
              />
              <Button
                disabled={_.isEmpty(modal.title) || _.isEmpty(modal.description)}
                onClick={() => saveTask(modal, setModal, setProfile)}
              >
                Добавить
              </Button>
            </ModalBody>
          </Modal>
        </Col>
        <Col sm='12' className="d-flex justify-content-between mb-3">
          <Button onClick={() => uploadProfile(profile, history, updateProfile)} color='primary'>Сохранить</Button>
          <Button onClick={() => deleteProfile(profileID)} color="danger">Удалить профиль</Button>
        </Col>
      </Row>
    </div>
  );
};

export default Component;
