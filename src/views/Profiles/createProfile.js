import React, {useState, useEffect} from 'react';
import {
  Col,
  Row,
  Button,
  Input,
  Modal,
  ModalBody,
  InputGroup,
  FormFeedback,
} from "reactstrap";
import _ from 'lodash';
import {useHistory} from 'react-router-dom';

import {useProfileCreate} from "./useProfilesApi";

const saveTask = (modal, setModal, setProfile) => {
  const {title, description} = modal;
  let task = {title, description};

  setModal({
    isOpen: false,
    title: '',
    description: ''
  });

  if (task.title && task.description) {
    setProfile(profile => {
      const newTasks = [...profile.tasks, task];

      return {...profile, tasks: [...newTasks]}
    })
  }
};

const uploadProfile = (profile, setInvalidProfile, createProfile, history) => {
  if (profile.name.length) {
    createProfile(profile)
      .then(res => {
        if (res.status === 200) {
          history.push('/profiles')
        }
      })
  } else {
    setInvalidProfile(true)
  }
};

const Component = () => {
  let history = useHistory();
  const [invalidProfile, setInvalidProfile] = useState(false);
  const [profile, setProfile] = useState({name: "", keywords: "", negativeKeywords: "", tasks: []});
  const [modal, setModal] = useState({
    isOpen: false,
    title: '',
    description: ''
  });

  useEffect(() => {
    setInvalidProfile(false)
  }, [profile.name]);

  const [createProfile] = useProfileCreate();

  return (
    <div className="animated fadeIn">
      <Row>
        <Col lg="12" className="mb-3">
          <h2> Создать профиль </h2>
        </Col>
        <Col lg="12" className="mb-3">
          Название
          <InputGroup>
            <Input
              type="text"
              invalid={invalidProfile}
              value={ profile.name }
              onChange={selected => setProfile({ ...profile, name: selected.target.value})}
            />
            <FormFeedback>
              Поле обязательно для заполнения
            </FormFeedback>
          </InputGroup>
        </Col>
        <Col lg="12" className="mb-3">
          Описание
          <textarea className="d-block w-100 p-1" value={ profile.description }
            onChange={e => setProfile({ ...profile, description: e.target.value} )}
          />
        </Col>
        <Col lg="6" className="mb-3">
          Занятность
          <Input
            type='text'
            onChange={e => setProfile({...profile, employment: e.target.value})}
          />
        </Col>
        <Col lg="6" className="mb-3">
          График
          <Input
            type='text'
            onChange={e => setProfile({...profile, schedule: e.target.value})}
          />
        </Col>
        <Col lg="12" className="mb-3">
          Ключевые слова
          <Input
            type='text'
            onChange={e => setProfile({...profile, keywords: e.target.value})}
          />
        </Col>
        <Col lg="12" className="mb-3">
          Минус фразы
          <Input
            type='text'
            onChange={e => setProfile({...profile, negativeKeywords: e.target.value})}
          />
        </Col>
        <Col sm="8" className="mb-3">
          <h4 className="mb-2"> Задачи </h4>
          <ul className="p-0 tasks" type="none">
            {
              profile.tasks.map((field, index) => {
                if(!field) return;
                return (
                  <li key={index} className="p-3 mb-3 bg-white">
                    <h5> {field.title} </h5>
                    <div> {field.description} </div>
                    <div className="action-buttons">
                      <Button
                        className="mx-1"
                        onClick={() => {
                          let filterTask = profile.tasks.filter((id, offset) => offset !== index );
                          setProfile({ ...profile, tasks: filterTask, });
                        }
                      }>
                        <i className="fa fa-trash-o"/>
                      </Button>
                    </div>
                  </li>
                )
              })
            }
          </ul>
          <Button onClick={() => setModal({...modal, isOpen: true})} >Добавить задачу</Button>
          <Modal isOpen={modal.isOpen} toggle={() => setModal({...modal, isOpen: false})} >
            <ModalBody>
              <Input
                className="mb-3"
                type="text"
                placeholder='Название'
                onChange={e => setModal({...modal, title: e.target.value})}
              />
              <Input
                className="mb-3"
                type="text"
                placeholder='Описание'
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
        <Col sm='4' className='d-flex align-items-end'>
          <Button
            color="primary"
            onClick={() => uploadProfile(profile, setInvalidProfile, createProfile, history)}
          >
            Создать
          </Button>
        </Col>
      </Row>
    </div>
  );
};

export default Component;
