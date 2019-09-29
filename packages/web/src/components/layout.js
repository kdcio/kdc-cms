import React from "react";
import { Container } from "reactstrap";

export default props => (
  <Container className={props.className ? props.className : null}>
    {props.children}
  </Container>
);
