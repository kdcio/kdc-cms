import React from "react";
import {
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Spinner,
  Alert,
  Card,
  CardHeader,
  CardBody
} from "reactstrap";
import { useAuth } from "../../context/auth";
import Layout from "../../components/layout";
import useBodyClass from "../../components/bodyClass";
import useCallbackStatus from "../../utils/useCallbackStatus";

export default () => {
  const { login } = useAuth();
  const { isPending, isRejected, error, run } = useCallbackStatus();
  useBodyClass("bg-dark");
  return (
    <Layout>
      <Card className="card-login mx-auto mt-5">
        <CardHeader>KDC CMS - Login</CardHeader>
        <CardBody>
          <Form
            onSubmit={e => {
              e.preventDefault();
              const { email, password } = e.target.elements;
              run(login({ email: email.value, password: password.value }));
            }}
          >
            {isRejected ? (
              <Alert color="danger" fade={true}>
                {error ? error.message : null}
              </Alert>
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
              />
            </FormGroup>
            <Button color="primary" block type="submit">
              Login {isPending ? <Spinner size="sm" /> : null}
            </Button>
          </Form>
        </CardBody>
      </Card>
    </Layout>
  );
};
