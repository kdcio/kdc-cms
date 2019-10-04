import React from 'react';
import { Link } from '@reach/router';
import { Card, CardBody, CardHeader, Table } from 'reactstrap';

const PagesList = () => (
  <Card>
    <CardHeader className="d-flex justify-content-between">
      <h3 className="m-0">List</h3>
      <Link to="add" className="btn btn-sm btn-primary">
        Add Page
      </Link>
    </CardHeader>
    <CardBody>
      <Table hover striped responsive>
        <thead>
          <tr>
            <th>id</th>
            <th>Page Name</th>
            <th>Description</th>
            <th>Fields</th>
            <th>Last Edited</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">home</th>
            <td>Home Page</td>
            <td>Define home page details</td>
            <td>3</td>
            <td>Oct 4, 2019</td>
            <td>Edit</td>
          </tr>
        </tbody>
      </Table>
    </CardBody>
  </Card>
);

export default PagesList;
