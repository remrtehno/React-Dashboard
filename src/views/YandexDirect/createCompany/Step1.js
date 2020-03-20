import React, {useState, useEffect} from 'react';
import Select from "react-select";
import {Button, CustomInput, FormGroup} from "reactstrap";
import {Link} from 'react-router-dom';
import {get} from '../../../api';

const handleCheck = (e, profiles, selectedProfiles, setProfiles) => {
  const isChecked = e.currentTarget.checked;
  const currentProfile = profiles.find(profile => profile.id === e.currentTarget.value);

  if (selectedProfiles.length <= 3) {
    let newSelectedProfiles = selectedProfiles;
    if (isChecked) {
      newSelectedProfiles = [...selectedProfiles, currentProfile];
    } else {
      newSelectedProfiles = selectedProfiles.filter(profile => profile.id !== currentProfile.id);
    }

    setProfiles(newSelectedProfiles)
  }
};

const getProfilesByRegionId = (RegionId, setAllProfiles) => {
  get('/api/yandex-direct/creation-wizard/profiles', {RegionId})
    .then(res => {
      res && setAllProfiles(res)
    })
};

const Component = ({selectedProfiles ,setStep, setCity, setProfiles}) => {
  const [allRegions, setAllRegions] = useState([]);
  const [allProfiles, setAllProfiles] = useState([]);

  useEffect(() => {
    get('/api/yandex-direct/creation-wizard/regions')
      .then(res => {
        res && setAllRegions(res)
      })
  }, []);

  const isFullSelectedProfiles = selectedProfiles.length >= 3;

  return (
    <div style={{width: '400px'}} className='d-flex flex-column align-items-center mx-auto'>
      <h2>
        Шаг 1: Выбор вакансии
      </h2>
      <span className='mb-3'>
        Для начала, выберите город
      </span>
      <Select
        className='col-12 pl-0 pr-0 mb-4'
        closeMenuOnSelect={true}
        getOptionLabel={option => option.name}
        getOptionValue={option => option.id}
        options={allRegions}
        onChange={(selected) => {
          getProfilesByRegionId(selected.id, setAllProfiles);
          setCity(selected)
        }}
      />
      <span className='mb-4'>
        Затем, выберите от одного до трех профилей кандидатов
      </span>
      <div className='d-flex flex-column w-100 mb-3'>
        {
          allProfiles.map(profile => {
            const isSelected = selectedProfiles.find(item => item.id === profile.id);
            return (
              <FormGroup key={profile.id}>
                <CustomInput
                  disabled={isFullSelectedProfiles ? !isSelected : false}
                  type='checkbox'
                  label={profile.name}
                  id={profile.id}
                  value={profile.id}
                  onChange={(e) => handleCheck(e, allProfiles, selectedProfiles, setProfiles)}
                />
              </FormGroup>
            )
          })
        }
      </div>
      <div className='d-flex justify-content-between w-100'>
        <Link to='/yandex-direct'>
          <Button className='mr-2 px-6'>
            &lt; Назад
          </Button>
        </Link>
        <Button
          className='ml-2 px-6 bg-turquoise-button text-white'
          onClick={() => setStep(2)}
        >
          Далее &gt;
        </Button>
      </div>
    </div>
  )
};

export default Component;
