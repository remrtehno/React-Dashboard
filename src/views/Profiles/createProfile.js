import React, {useEffect, useState} from 'react';
import {Col, Row, Button, Input, Modal, ModalBody} from "reactstrap";
import _ from 'lodash';
import Select from 'react-select';
import {useProfileCreate} from "./useProfilesApi";


const Component = () => {
  const [profile, setProfile] = useState({name: " ", keywords: "", negativeKeywords: "", tasks: [], externalIds: [],});
  const [modal, setModal] = useState({modal: false});
  const [task, setTask] = useState({});
  const [profileCreate] = useProfileCreate();


  const toggle = () => {
    setModal({modal: !modal.modal, save: false, });
    setTask({});
  };

  const removeTask = (id) => {
    if(!id) return;
    return profile.tasks.filter( (task, index) => {
      if(index !== id) return task;
    })
  };

  const mergeTasks = () => {
    let index = task.index;
    delete task.index;
    let tasks =_.cloneDeep(profile.tasks);
    if(index) {
      tasks[index] = task;
    } else {
      tasks =_.concat(tasks, task);
    }
    setProfile({...profile, tasks: tasks });
  };

  return (
    <div className="animated fadeIn">
      <Row>
        <Col lg="12" className="mb-3"> <h2>  Создать профиль </h2> </Col>
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
          <Select type="text"

          //   value={ profile.keywords.map( field => {
          //   if(!field) return;
          //   return {value: field, label: field}
          // })
          // }
            isMulti
            closeMenuOnSelect={true}
            options = {[
              { value: 'strawberry', label: 'Strawberry' },
              { value: 'vanilla', label: 'Vanilla' }
            ]}
          />
        </Col>
        <Col lg="12" className="mb-3">
          Минус фразы
          <Select type="text"

            //value={

          //   profile.negativeKeywords.map( field => {
          //   if(!field) return;
          //   return {value: field, label: field }
          // })
          // }
            isMulti
            closeMenuOnSelect={true}
            options = {[
              { value: 'strawberry', label: 'Strawberry' },
              { value: 'vanilla', label: 'Vanilla' }
            ]}
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
                      <Button className="mx-1" onClick={ () =>  {
                            let filterTask = profile.tasks.filter( (id, offset) => offset !== index );
                            setProfile({ ...profile, tasks: filterTask, });
                        }
                      }>
                        <i className="fa fa-trash-o"></i>
                      </Button>
                    </div>
                  </li>
                )
              })
            }
          </ul>
          <Button onClick={ () => { toggle(); }} >Добавить задачу</Button>
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
            {
              profile.externalIds.map( (field, index) => {
                if(!field) return;
                return (
                  <li key={index} className="p-3 mb-3 bg-white">
                    <h5> {field.id} </h5>
                    <div> {field.system} </div>
                    <div className="action-buttons">
                      <Button className="mx-1" onClick={
                        () => {}
                      }>
                        <i className="fa fa-pencil"></i>
                      </Button>
                      <Button className="mx-1" onClick={ () =>  {}  }>
                        <i className="fa fa-trash-o"></i>
                      </Button>
                    </div>
                  </li>
                )
              })
            }
          </ul>
          <Button  onClick={ () => { toggle(); }} className="mb-3">Добавить внешние идентификаторы</Button>
          <br/>
          <Button onClick={ () => { profileCreate(profile); }}  >Создать</Button>
        </Col>
      </Row>
    </div>
  );
};

export default Component;
