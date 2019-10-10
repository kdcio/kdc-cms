/* eslint-disable no-undef */
/* eslint-disable no-alert */
/* eslint-disable no-restricted-globals */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link } from '@reach/router';
import { Card, CardBody, CardHeader, Table } from 'reactstrap';
import moment from 'moment';
import { useContentTypeList } from '../../../context/contentTypeList';
import api from '../../../utils/api';

const formatDate = (page) => {
  let ts = 0;
  if (page.updatedAt) ts = page.updatedAt;
  else if (page.createdAt) ts = page.createdAt;

  if (ts === 0) return '';

  return moment(ts).format('MMM D, YYYY h:mma');
};

const ContentsList = ({ id }) => {
  const { getType } = useContentTypeList();
  const [list, setList] = useState([]);
  const type = getType(id);

  useEffect(() => {
    const fetchList = () => {
      api(`contents/${id}`).then((data) => {
        setList(data);
      });
    };

    fetchList();
  }, [id]);

  if (!type) return null;

  const { fields } = type;
  const columns = [];
  for (let i = 0; i < 2; i += 1) {
    if (fields[i]) columns.push(fields[i].name);
  }

  return (
    <Card>
      <CardHeader className="d-flex justify-content-between">
        <h3 className="m-0">List {type.name}</h3>
        <Link to={`/contents/${type.id}/add`} className="btn btn-sm btn-primary">
          Add {type.name}
        </Link>
      </CardHeader>
      <CardBody>
        <Table hover striped responsive>
          <thead>
            <tr>
              <th>Slug</th>
              {columns.map((f) => (
                <th key={f} className="text-capitalize">
                  {f}
                </th>
              ))}
              <th>Last Modified</th>
              <th className="text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {list.map((content) => (
              <tr key={content.slug}>
                <th scope="row">{content.id}</th>
                {columns.map((f) => (
                  <th key={f}>{content[f]}</th>
                ))}
                <td>{formatDate(content)}</td>
                <td className="text-center">
                  <Link to={`edit/${content.slug}`} className="btn btn-sm btn-secondary mr-2">
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

ContentsList.propTypes = {
  id: PropTypes.string,
};

export default ContentsList;
