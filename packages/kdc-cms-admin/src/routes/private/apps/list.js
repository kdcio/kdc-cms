/* eslint-disable no-undef */
/* eslint-disable no-alert */
/* eslint-disable no-restricted-globals */
import React, { useState, useEffect } from 'react';
import { Link } from '@reach/router';
import { Card, CardBody, CardHeader, Button } from 'reactstrap';
import { ROLE_APP } from 'kdc-cms-roles';
import RowSpinner from '../../../components/rowSpinner';
import Table from '../../../components/table';
import api from '../../../utils/api';

const UsersList = () => {
  const [list, setList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchList = () => {
    setIsLoading(true);
    api(`users?role=${ROLE_APP}`).then((data) => {
      setList(data);
      setIsLoading(false);
    });
  };

  const deleteUser = (username) => {
    const r = confirm('Are you sure you want to delete this user?\n\nTHIS CANNOT BE UNDONE!');
    if (r === true) {
      setIsLoading(true);
      api(`users/${username}`, { method: 'DELETE' })
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
        <Link to="/apps/add" className="btn btn-sm btn-primary">
          Add App
        </Link>
      </CardHeader>
      <CardBody>
        <Table hover striped responsive>
          <thead>
            <tr>
              <th>Name</th>
              <th>Username</th>
              <th>Role</th>
              <th className="text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <RowSpinner colSpan={5} />
            ) : (
              list.map((user) => (
                <tr key={user.username}>
                  <th scope="row">{user.name}</th>
                  <td>{user.username}</td>
                  <td>{user.role}</td>
                  <td className="text-center">
                    <Link to={`edit/${user.username}`} className="btn btn-sm btn-secondary mr-2">
                      Edit
                    </Link>
                    <Button
                      type="button"
                      size="sm"
                      color="danger"
                      onClick={() => deleteUser(user.username)}
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

export default UsersList;
