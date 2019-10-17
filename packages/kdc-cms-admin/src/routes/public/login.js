import React from 'react';
import {
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Spinner,
  Row,
  Col,
  Card,
  CardBody,
} from 'reactstrap';
import { useAuth } from '../../context/auth';
import Layout from '../../components/layoutPublic';
import useBodyClass from '../../components/bodyClass';

const Login = () => {
  const [error, setError] = React.useState(null);
  const [isLoggingIn, setIsLoggingIn] = React.useState(false);
  const { login } = useAuth();
  useBodyClass('bg-gradient-primary');

  return (
    <Layout>
      <Row className="justify-content-md-center">
        <Col xl={5} lg={6} md={8}>
          <Card className="o-hidden border-0 shadow-lg my-5">
            <CardBody className="p-0">
              <div className="p-5">
                <div className="text-center">
                  <h1 className="h4 text-gray-900 mb-4">Welcome Back!</h1>
                </div>
                <Form
                  className="user"
                  onSubmit={(event) => {
                    event.preventDefault();
                    setIsLoggingIn(true);
                    const { username, password } = event.target.elements;

                    login({ username: username.value, password: password.value }).catch((e) => {
                      setIsLoggingIn(false);
                      setError(e);
                    });
                  }}
                >
                  {error ? <p className="text-danger">{error ? error.message : null}</p> : null}
                  <FormGroup>
                    <Label htmlFor="username" className="sr-only">
                      Email address
                    </Label>
                    <Input
                      type="text"
                      name="username"
                      id="username"
                      placeholder="Username"
                      required
                      autoFocus
                      className="form-control-user"
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label htmlFor="password" className="sr-only">
                      Password
                    </Label>
                    <Input
                      type="password"
                      name="password"
                      id="password"
                      placeholder="Password"
                      required
                      className="form-control-user"
                    />
                  </FormGroup>
                  <Button
                    color="primary"
                    block
                    type="submit"
                    className="btn-user"
                    disabled={isLoggingIn}
                  >
                    Login {isLoggingIn ? <Spinner size="sm" /> : null}
                  </Button>
                </Form>
                <hr />
                <div className="text-center">
                  Powered by{' '}
                  <a
                    className="small"
                    href="https://github.com/ianpogi5/kdc-cms"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    KDC CMS
                  </a>
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Layout>
  );
};

export default Login;
