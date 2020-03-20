import React, {useState, useEffect} from 'react';
import moment from "moment";
import {debounce} from 'lodash';
import {Col, Row, Input} from "reactstrap";
import Select from 'react-select';

import {get} from '../../api';

const getAllState = async () => {
  const leads = await get('/api/leads'),
    vacancies = await get('/api/vacancies'),
    regions = await get('/api/regions'),
    sources = await get('​/api/sources/main');

  return {
    leads,
    vacancies: vacancies && vacancies.items,
    regions: regions && regions.items,
    sources
  }
};

const getLeadsByFilter = async (filterValues) => {
  let params = {};
  const filterFields = Object.keys(filterValues);
  filterFields.map(field => {
    params[field] = filterValues[field]
  });

  if (Object.keys(params).length) {
    return await get('/api/leads', JSON.stringify(params))
  }
  return false
};

const getCampaignsByRegion = async (regionIds) => {
  if (regionIds.length) {
    const campaigns = await get('/api/yandex-direct/campaigns', {regionIds});
    return campaigns.items
  }
  return []
};

const handleSearch = (e, filterValues, setFilterValues) => {
  setFilterValues({...filterValues, TextSearch: e.target.value})
};

const renderLeadsCards = (leads) => {
  return leads.map(lead => {
    const {
      firstName,
      lastName,
      middleName,
      mobilePhone,
      region,
      vacancy,
      emailAddress,
      id,
      createdAt,
      generatedId,
      mainSource,
      campaign,
      utmRegion,
      utmSource,
      utmCampaign
    } = lead;

    const createdDate = moment(createdAt).format('DD.MM.YYYY HH:mm');

    return (
      <div className="vacancy" key={id}>
        <div className='d-flex justify-content-between'>
          <div className='d-flex flex-column'>
            <div className='name d-flex flex-wrap'>
              <div className='mr-4'>{`${firstName} ${lastName} ${middleName}`}</div>
              <div className='mr-4'>{region.name}</div>
              <div><u>{vacancy.name}</u></div>
            </div>
            <a
              href={`mailto:${emailAddress}`}
              className='name m-0'
            >
              {emailAddress}
            </a>
            <a
              href={`tel:${mobilePhone}`}
              className='name'
            >
              {mobilePhone}
            </a>
          </div>
          <table style={{maxWidth: '40%'}} className='table table-borderless table-sm'>
            <tbody>
              <tr>
                <td>{createdDate}</td>
                <td>{mainSource || 'Кампания отсутствует'}</td>
              </tr>
              <tr>
                <td>{generatedId}</td>
                <td>{campaign && campaign.name || 'Кампания отсутствует'}</td>
              </tr>
              <tr>
                <td>utmCity</td>
                <td>{utmRegion}</td>
              </tr>
              <tr>
                <td>utmCampaign</td>
                <td>{utmCampaign}</td>
              </tr>
              <tr>
                <td>utmSource</td>
                <td>{utmSource}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    )
  })
};

const Component = () => {
  const [initialData, setInitialData] = useState({
    leads: [],
    vacancies: [],
    regions: [],
    sources: [],
    campaigns: []
  });

  const [filterValues, setFilterValues] = useState({});

  useEffect(() => {
    const {leads, vacancies, region} = initialData;
    const isAllDataLoaded = leads.length && vacancies.length && region.length;

    if (!isAllDataLoaded) {
      getAllState()
        .then(data => {
          setInitialData({...initialData, ...data});
        })
    }
  }, []);

  useEffect(() => {
    const { RegionIds } = filterValues;
    if (RegionIds)
    getCampaignsByRegion(RegionIds)
      .then(campaigns => {
        setInitialData({...initialData, campaigns})
      })
  }, [filterValues.RegionIds]);

  useEffect(() => {
    getLeadsByFilter(filterValues).then(leads => {
      if (leads) {
        setInitialData({...initialData, leads})
      }
    })
  }, [filterValues]);

  const delayedSearch = debounce(handleSearch, 600);

  return (
    <div className="animated fadeIn">
      <Row>
        <Col lg="12" className="mb-3">
          <Row>
            <Col className='d-flex align-middle mb-3' xl='4' >
              <h2 className="mb-0 mr-3">Лиды</h2>
              <Input
                placeholder='Поиск'
                onChange={(e) => {
                  e.persist();
                  delayedSearch(e, filterValues, setFilterValues)
                }}
              />
            </Col>
            <Col xl="8">
              <Row>
                <Col>
                  <Select
                    placeholder='Вакансии'
                    getOptionLabel={option => option.name}
                    getOptionValue={option => option.id}
                    isMulti
                    closeMenuOnSelect={false}
                    options={initialData.vacancies}
                    onChange={vacancies => (
                      setFilterValues({...filterValues, vacancyIds: vacancies.map(vacancy => vacancy.id)})
                    )}
                  />
                </Col>
                <Col>
                  <Select
                    placeholder='Регионы'
                    getOptionLabel={option => option.name}
                    getOptionValue={option => option.id}
                    isMulti
                    closeMenuOnSelect={false}
                    options={initialData.regions}
                    onChange={regions => (
                      setFilterValues({...filterValues, RegionIds: regions.map(region => region.id)})
                    )}
                  />
                </Col>
                <Col>
                  <Select
                    placeholder='Источник'
                    getOptionLabel={option => option}
                    getOptionValue={option => option}
                    options={initialData.sources}
                    onChange={MainSource => setFilterValues({...filterValues, MainSource})}
                  />
                </Col>
                <Col>
                  <Select
                    isDisabled={!initialData.campaigns.length}
                    placeholder='Кампании'
                    getOptionLabel={option => option.name}
                    getOptionValue={option => option.id}
                    isMulti
                    closeMenuOnSelect={false}
                    options={initialData.campaigns}
                    onChange={campaigns => (
                      setFilterValues({...filterValues, CampaignIds: campaigns.map(campaign => campaign.id)})
                    )}
                  />
                </Col>
              </Row>
            </Col>
          </Row>
          <hr color="black"/>
          {renderLeadsCards(initialData.leads)}
        </Col>
      </Row>
    </div>
  );
};

export default Component;
