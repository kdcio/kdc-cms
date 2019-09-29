import React from "react";
import { Form, FormGroup, Label, Input, Button } from "reactstrap";
import Layout from "../../components/layout";

export default () => (
  <Layout className="vh-100 d-flex justify-content-center flex-column text-center">
    <div>
      <h1>Welcome to KDC CMS</h1>
      <Form style={{ maxWidth: 330, padding: 15, margin: "auto" }}>
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
        <Button size="lg" color="primary" block>
          Sign in
        </Button>
        <p className="mt-5 mb-3 text-muted">&copy; 2019</p>
      </Form>
    </div>
  </Layout>
);
