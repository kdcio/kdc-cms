import React, { useState, useEffect } from 'react';
import { Link } from '@reach/router';
import { Card, CardBody, CardHeader, Table } from 'reactstrap';
import api from '../../../utils/api';

const PagesList = () => {
  const [list, setList] = useState([]);

  useEffect(() => {
    const fetchList = async () => api('page-definition').then((data) => setList(data));
    fetchList();
  }, []);

  return (
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
            {list.map((page) => (
              <tr key={page.id}>
                <th scope="row">{page.id}</th>
                <td>{page.name}</td>
                <td>{page.description}</td>
                <td>{page.fieldCount}</td>
                <td>{page.createdAt}</td>
                <td>Edit</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </CardBody>
    </Card>
  );
};

export default PagesList;
