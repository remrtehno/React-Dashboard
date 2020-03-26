import React, {useEffect} from 'react';
import {Col, Row, Button} from "reactstrap";
import {Link} from "react-router-dom";
import _ from "lodash";

import {useProfileApi} from "./useProfilesApi";

const Component = (props) => {
  const profileID = props.match.params.id;
  const [profile, loadApi] = useProfileApi();

  useEffect(() => {
    loadApi(profileID);
  }, []);

  return (
    <div className="animated fadeIn">
      <Row>
        <Col lg="12" className="mb-3">  <h2> Профиль: {profile.name} </h2> </Col>
        <Col lg="12" className="mb-2">
          <Link to="/">Инфо</Link>
          <hr/>
        </Col>
        <Col lg="4" className="mb-3">
          <div className="mb-3">
            <h5 className="mr-2 d-inline-block">Занятность</h5>
            { profile.employment }
          </div>
          <div className="mb-3">
            <h5 className="mr-2 d-inline-block">График</h5>
            { profile.schedule }
          </div>
          <div className="mb-3">
            <h5 className="mr-2 mb-3">Задачи</h5>
            <div className="pl-4">
              { _.isEmpty(profile.tasks) ? 'Не указаны' : "" }
              { _.map(profile.tasks, ({title, description}, index) => {
                return (
                  <div key={index}>
                    <div className="mb-4">
                      <h6 className="m-0">{title}</h6>
                      {description}
                    </div>
                  </div>
                  )
              }) }
            </div>
          </div>
        </Col>
        <Col lg="4" className="mb-3">
          <h5>Ключевые фразы</h5>
          <div className="vertical-scroll bg-transparent">
            { profile.keywords }
          </div>
        </Col>
        <Col lg="4" className="mb-3">
          <h5>Минус фразы</h5>
          <div className="vertical-scroll bg-transparent">
            { profile.negativeKeywords }
          </div>
        </Col>
        <Col lg="4" className="mb-3">
          <h5 className="mb-3">Описание</h5>
          {profile.description}
        </Col>
        <Col lg="12" className="mb-3">
          <Button onClick={ () => props.history.goBack() }>Назад</Button>
        </Col>
      </Row>
    </div>
  );
};

export default Component;
