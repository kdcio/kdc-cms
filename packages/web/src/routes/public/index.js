import React from "react";
import { Form, FormGroup, Label, Input, Button } from "reactstrap";
import { useAuth } from "../../context/auth";
import Layout from "../../components/layout";

export default () => {
  const { login } = useAuth();
  return (
    <Layout className="vh-100 d-flex justify-content-center flex-column text-center">
      <div>
        <h1>Welcome to KDC CMS</h1>
        <Form
          style={{ maxWidth: 330, padding: 15, margin: "auto" }}
          onSubmit={e => {
            e.preventDefault();
            const { email, password } = e.target.elements;
            login({ email: email.value, password: password.value });
          }}
        >
          <h3 className="h3 mb-3 font-weight-normal">Please sign in</h3>
          <FormGroup>
            <Label htmlFor="email" className="sr-only">
              Email
            </Label>
            <Input
              type="email"
              name="email"
              id="email"
              placeholder="Email address"
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
            />
          </FormGroup>
          <FormGroup check className="mb-3">
            <Label check>
              <Input type="checkbox" value="remember-me" /> Remember me
            </Label>
          </FormGroup>
          <Button size="lg" color="primary" block type="submit">
            Sign in
          </Button>
          <p className="mt-5 mb-3 text-muted">&copy; 2019</p>
        </Form>
      </div>
    </Layout>
  );
};
