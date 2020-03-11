import React, {useEffect, useState} from 'react';
import {Col, Row, Button, Input, Modal, ModalBody} from "reactstrap";
import _ from 'lodash';
import Select from 'react-select';
import {useProfileApi, useProfileUpdate, useProfileDelete} from "./useProfilesApi";


const Component = (props) => {
  const profileID = props.match.params.id;
  const [profile, getProfile, setProfile] = useProfileApi();
  const [updateProfile] = useProfileUpdate();
  const [deleteProfile] = useProfileDelete();

  const [modal, setModal] = useState({modal: false, modalExternalId: false});
  const [task, setTask] = useState({});
  const [externalId, setExternalId] = useState({});

  useEffect(() => {
    getProfile(profileID);
  }, []);

  const toggle = () => {
    setModal({modal: !modal.modal, save: false, modalExternalId: false, });
    setTask({});
  };
  const toggleExternalId = () => {
    setModal({modal: false, modalExternalId: !modal.modalExternalId, });
  };

  const mergeTasks = () => {
    let index = task.index;
    delete task.index;
    let tasks =_.cloneDeep(profile.tasks);
    if(index >= 0) {
      tasks[index] = task;
   } else {
     tasks =_.concat(tasks, task);
    }
    setProfile({...profile, tasks: tasks });
  };

  return (
    <div className="animated fadeIn">
      <Row>
        <Col lg="12" className="mb-3"> <h2> Редактировать профиль </h2> </Col>
        <Col lg="12" className="mb-3">
          Название
          <Input type="text"  value={ profile.name }
            onChange={
              (selected) => setProfile({ ...profile, name: selected.target.value} )
            }
          />
        </Col>
        <Col lg="12" className="mb-3">
          Описание
           <textarea type="text"  className="d-block w-100 p-1" value={ profile.description }
             onChange={
               (selected) => setProfile({ ...profile, description: selected.target.value} )
             }
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
            onChange={
              (selected) => setProfile({ ...profile, schedule: selected.value} )
            }
            value={ { value: profile.schedule, label: profile.schedule }  }
            options = {[
              { value: "Без выходных", label: "Без выходных" },
              { value: "пятидневная рабочая неделя, плавающие выходные", label: "пятидневная рабочая неделя, плавающие выходные" }
            ]}
          />
        </Col>
        <Col lg="12" className="mb-3">
          Ключевые слова
          <textarea type="text"  className="d-block w-100 p-1" value={ profile.keywords }
            onChange={
              (selected) => setProfile({ ...profile, keywords: selected.target.value} )
            }
          />
        </Col>
        <Col lg="12" className="mb-3">
          Минус фразы
          <textarea type="text"  className="d-block w-100 p-1" value={ profile.negativeKeywords }
            onChange={
              (selected) => setProfile({ ...profile, negativeKeywords: selected.target.value} )
            }
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
                      <Button className="mx-1" onClick={
                        () => {
                          setModal({modal: true, save: true});
                          setTask({...task, title: field.title, description: field.description, index: index, })
                        }
                      }>
                        <i className="fa fa-pencil"></i>
                      </Button>
                      <Button className="mx-1" onClick={ () => {
                        let filterTask = profile.tasks.filter( (id, offset) => offset !== index );
                        setProfile({ ...profile, tasks: filterTask, });
                      }}>
                        <i className="fa fa-trash-o"></i>
                      </Button>
                    </div>
                  </li>
                )
              })
            }
          </ul>
          <Button onClick={ () => { toggle(); }} className="align-self-center">Добавить задачу</Button>
          <Modal isOpen={modal.modal} toggle={toggle} >
            <ModalBody>
              <Input className="mb-3" type="text" onChange={ title => { setTask({...task, title: title.target.value}) } } value={task.title} placeholder={'Название'} />
              <Input className="mb-3" type="text" onChange={ description => { setTask({...task, description: description.target.value}) } } value={task.description} placeholder={'Описание'} />
              <Button disabled={_.isEmpty(task)} onClick={ () => { mergeTasks(); toggle(); }} className={modal.save ? 'd-none' : ""}>Добавить</Button>
              <Button disabled={_.isEmpty(task)} onClick={ () => { mergeTasks(); toggle(); }} className={!modal.save ? 'd-none' : ""} >Изменить</Button>
            </ModalBody>
          </Modal>
        </Col>
        <Col lg="12" className="mb-3">
          <h4 className="mb-2"> Внешние идентификаторы </h4>
          <ul className="p-0 tasks" type="none">
            { _.isEmpty(profile.externalIds) ? "Не указано" : "" }
            {/*{*/}
            {/*  profile.externalIds.map( (field, index) => {*/}
            {/*    if(!field) return;*/}
            {/*    return (*/}
            {/*      <li key={index} className="p-3 mb-3 bg-white">*/}
            {/*        <h5> {field.id} </h5>*/}
            {/*        <div> {field.system} </div>*/}
            {/*        <div className="action-buttons">*/}
            {/*          <Button className="mx-1" onClick={*/}
            {/*            () => {*/}
            {/*              setExternalId({id:  field.id, system: field.system });*/}
            {/*              toggleExternalId();*/}
            {/*            }*/}
            {/*          }>*/}
            {/*            <i className="fa fa-pencil"></i>*/}
            {/*          </Button>*/}
            {/*          <Button className="mx-1" onClick={*/}
            {/*            () =>  {*/}
            {/*              let filterIds = profile.externalIds.filter( (id, offset) => offset !== index );*/}
            {/*              setProfile({ ...profile, externalIds: filterIds, });*/}
            {/*            }*/}
            {/*          }>*/}
            {/*            <i className="fa fa-trash-o"></i>*/}
            {/*          </Button>*/}
            {/*        </div>*/}
            {/*      </li>*/}
            {/*    )*/}
            {/*  })*/}
            {/*}*/}
          </ul>
          <Button  onClick={ () => { toggleExternalId(); }} className="mb-3">Добавить внешние идентификаторы</Button>
          <Modal isOpen={modal.modalExternalId} toggle={toggleExternalId} >
            <ModalBody>
              <Input className="mb-3" type="text" onChange={ id => { setExternalId({...externalId, id:  id.target.value }) } } value={externalId.id} placeholder={'ID'} />
              <Input className="mb-3" type="text" onChange={ system => { setExternalId({...externalId, system: system.target.value}) } } value={externalId.system} placeholder={'Система'} />
              <Button onClick={ () => { setProfile({ ...profile, externalIds: [...profile.externalIds, externalId], }); toggleExternalId(); }}>Добавить</Button>
            </ModalBody>
          </Modal>
          <br/>
          <div className="d-flex justify-content-between">
            <Button onClick={ () => { updateProfile(profileID, profile); } } className="btn-success">Сохранить</Button>
            <Button onClick={ () => { deleteProfile(profileID); } } className="btn-danger">Удалить профиль</Button>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default Component;
