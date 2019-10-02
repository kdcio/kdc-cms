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
import useCallbackStatus from '../../utils/useCallbackStatus';

const Login = () => {
  const { login } = useAuth();
  const { isPending, isRejected, error, run } = useCallbackStatus();
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
                  onSubmit={(e) => {
                    e.preventDefault();
                    const { email, password } = e.target.elements;
                    run(login({ email: email.value, password: password.value }));
                  }}
                >
                  {isRejected ? (
                    <p className="text-danger">{error ? error.message : null}</p>
                  ) : null}
                  <FormGroup>
                    <Label htmlFor="email" className="sr-only">
                      Email address
                    </Label>
                    <Input
                      type="email"
                      name="email"
                      id="email"
                      placeholder="Email address"
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
                  <Button color="primary" block type="submit" className="btn-user">
                    Login {isPending ? <Spinner size="sm" /> : null}
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
