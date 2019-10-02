import React from "react";
import { Container } from "reactstrap";
import SideBar from "./sideBar";
import TopBar from "./topBar";

export default props => (
  <div id="wrapper">
    <SideBar />
    <div id="content-wrapper" className="d-flex flex-column">
      <TopBar title={props.title} />
      <Container className={props.className ? props.className : null} fluid>
        {props.children}
      </Container>
    </div>
  </div>
);
