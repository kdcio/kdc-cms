/* eslint-disable no-undef */
/* eslint-disable no-alert */
/* eslint-disable no-restricted-globals */
import React, { useState, useEffect } from 'react';
import { Link } from '@reach/router';
import { Card, CardBody, CardHeader, Button } from 'reactstrap';
import moment from 'moment';
import RowSpinner from '../../../components/rowSpinner';
import Table from '../../../components/table';
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
  const [isLoading, setIsLoading] = useState(false);

  const fetchList = () => {
    setIsLoading(true);
    api('define/pages').then((data) => {
      setList(data);
      setIsLoading(false);
    });
  };

  const deletePage = (id) => {
    const r = confirm(
      'Are you sure you want to delete this page?\nAll data associated with this page will also be deleted.\n\nTHIS CANNOT BE UNDONE!'
    );
    if (r === true) {
      setIsLoading(true);
      api(`define/pages/${id}`, { method: 'DELETE' })
        .then(() => api(`pages/${id}`, { method: 'DELETE' }))
        .then(fetchList)
        .then(() => setIsLoading(false));
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <Card>
      <CardHeader className="d-flex justify-content-between">
        <h3 className="m-0">List</h3>
        <Link id="addBtn" to="add" className="btn btn-sm btn-primary">
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
              <th className="text-center">Fields</th>
              <th>Last Modified</th>
              <th className="text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <RowSpinner colSpan={6} />
            ) : (
              list.map((page) => (
                <tr key={page.id}>
                  <th scope="row">{page.id}</th>
                  <td>{page.name}</td>
                  <td>{page.description}</td>
                  <td className="text-center">{page.fieldCount}</td>
                  <td>{formatDate(page)}</td>
                  <td className="text-center">
                    <Link to={`edit/${page.id}`} className="btn btn-sm btn-secondary mr-2">
                      Edit
                    </Link>
                    <Button
                      type="button"
                      size="sm"
                      color="danger"
                      onClick={() => deletePage(page.id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </CardBody>
    </Card>
  );
};

export default PagesList;
