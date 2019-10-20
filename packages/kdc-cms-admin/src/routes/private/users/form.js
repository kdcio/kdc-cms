import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link, navigate } from '@reach/router';
import useForm from 'react-hook-form';
import { Col, Card, CardBody, CardHeader, Form, FormGroup, Label, Input, Button } from 'reactstrap';
import api from '../../../utils/api';
import LoadingOverlay from '../../../components/loadingOverlay';

const UsersForm = ({ username }) => {
  const { register, handleSubmit, reset } = useForm();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = (data) => {
    const { password, password2, ...user } = data;
    setIsLoading(true);

    const body = { ...user, password };
    if (username) {
      api(`users/${username}`, { body, method: 'PUT' })
        .then(() => navigate('/users'))
        .catch(() => setIsLoading(false));
    } else {
      api('users', { body })
        .then(() => navigate('/users'))
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
        <h3 className="m-0">{username ? `Edit ${username}` : 'Add User'}</h3>
        <Link className="btn btn-sm btn-danger" to="/users">
          Cancel
        </Link>
      </CardHeader>
      <CardBody>
        <LoadingOverlay isLoading={isLoading}>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <FormGroup row>
              <Label sm={2}>Full Name</Label>
              <Col sm={4}>
                <Input type="text" name="name" innerRef={register} />
              </Col>
              <Label sm={2}>Role</Label>
              <Col sm={2}>
                <Input type="select" name="role" innerRef={register}>
                  <option value="dev">Developer</option>
                  <option value="admin">Administrator</option>
                </Input>
              </Col>
            </FormGroup>
            <FormGroup row>
              <Label sm={2}>Username</Label>
              <Col sm={4}>
                <Input type="text" name="username" innerRef={register} />
              </Col>
              <Label sm={2}>Email</Label>
              <Col sm={4}>
                <Input type="email" name="email" innerRef={register} />
              </Col>
            </FormGroup>
            {username ? null : (
              <FormGroup row>
                <Label sm={2}>Password</Label>
                <Col sm={4}>
                  <Input type="password" name="password" innerRef={register} />
                </Col>
                <Label sm={2}>Confirm Password</Label>
                <Col sm={4}>
                  <Input type="password" name="password2" innerRef={register} />
                </Col>
              </FormGroup>
            )}

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
