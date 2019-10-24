import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link, navigate } from '@reach/router';
import useForm from 'react-hook-form';
import { Col, Card, CardBody, CardHeader, Form, FormGroup, Label, Input, Button } from 'reactstrap';
import { ROLE_APP } from 'kdc-cms-roles';
import uuidv4 from 'uuid/v4';
import api from '../../../utils/api';
import LoadingOverlay from '../../../components/loadingOverlay';

const UsersForm = ({ username }) => {
  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      name: '',
      username: uuidv4(),
      password: uuidv4(),
    },
  });
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = (data) => {
    const user = {
      name: data.name,
      username: data.username,
      password: data.password,
      role: ROLE_APP,
    };

    setIsLoading(true);

    const body = { ...user };
    if (username) {
      api(`users/${username}`, { body, method: 'PUT' })
        .then(() => navigate('/apps'))
        .catch(() => setIsLoading(false));
    } else {
      api('users', { body })
        .then(() => navigate(`/apps/edit/${data.username}`))
        .catch(() => setIsLoading(false));
    }
  };

  useEffect(() => {
    if (!username) return;
    const fetchUser = () => {
      setIsLoading(true);
      api(`users/${username}`)
        .then((data) => reset(data))
        .then(() => setIsLoading(false))
        .catch(() => setIsLoading(false));
    };
    fetchUser();
  }, [username, reset]);

  return (
    <Card>
      <CardHeader className="d-flex justify-content-between">
        <h3 className="m-0">{username ? 'Edit App' : 'Add App'}</h3>
        <Link className="btn btn-sm btn-danger" to="/apps">
          Cancel
        </Link>
      </CardHeader>
      <CardBody>
        <LoadingOverlay isLoading={isLoading}>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <FormGroup row>
              <Label sm={2}>App Name</Label>
              <Col sm={4}>
                <Input type="text" name="name" innerRef={register} />
              </Col>
            </FormGroup>
            <FormGroup row>
              <Label sm={2}>App ID</Label>
              <Col sm={4}>
                <Input type="text" name="username" innerRef={register} readOnly />
              </Col>
              <Label sm={2}>App Secret</Label>
              <Col sm={4}>
                <Input type="text" name="password" innerRef={register} readOnly />
              </Col>
            </FormGroup>
            {username ? (
              <FormGroup row>
                <Label sm={2}>App Token</Label>
                <Col sm={10}>
                  <Input type="text" name="token" innerRef={register} readOnly />
                </Col>
              </FormGroup>
            ) : null}

            <hr />
            <Button type="submit" color="primary">
              Save
            </Button>
          </Form>
        </LoadingOverlay>
      </CardBody>
    </Card>
  );
};

UsersForm.propTypes = {
  username: PropTypes.string,
};

export default UsersForm;
