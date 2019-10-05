/* eslint-disable no-undef */
/* eslint-disable no-alert */
/* eslint-disable no-restricted-globals */
import React, { useState, useEffect } from 'react';
import { Link } from '@reach/router';
import { Card, CardBody, CardHeader, Table } from 'reactstrap';
import moment from 'moment';
import api from '../../../utils/api';

const formatDate = (page) => {
  let ts = 0;
  if (page.updatedAt) ts = page.updatedAt;
  else if (page.createdAt) ts = page.createdAt;

  if (ts === 0) return '';

  return moment(ts).format('MMM D, YYYY h:mma');
};

const PagesList = () => {
  const [list, setList] = useState([]);

  useEffect(() => {
    const fetchList = () => {
      api('pages').then((data) => {
        setList(data);
      });
    };

    fetchList();
  }, []);

  return (
    <Card>
      <CardHeader className="d-flex justify-content-between">
        <h3 className="m-0">List</h3>
        <Link to="/define/pages/add" className="btn btn-sm btn-primary">
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
              <th>Last Modified</th>
              <th className="text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {list.map((page) => (
              <tr key={page.id}>
                <th scope="row">{page.id}</th>
                <td>{page.name}</td>
                <td>{page.description}</td>
                <td>{formatDate(page)}</td>
                <td className="text-center">
                  <Link to={`edit/${page.id}`} className="btn btn-sm btn-secondary mr-2">
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </CardBody>
    </Card>
  );
};

export default PagesList;
