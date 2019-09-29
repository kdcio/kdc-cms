import React from "react";
import { Container } from "reactstrap";

import "bootstrap/dist/css/bootstrap.css";

export default props => (
  <Container className={props.className ? props.className : null}>
    {props.children}
  </Container>
);
