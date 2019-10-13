/* eslint-disable no-undef */
/* eslint-disable no-alert */
/* eslint-disable no-restricted-globals */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link } from '@reach/router';
import { Card, CardBody, CardHeader, Table, Button } from 'reactstrap';
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

  const fetchList = () => {
    api(`contents/${id}`).then((data) => {
      setList(data);
    });
  };

  const deleteContent = (slug) => {
    const r = confirm('Are you sure you want to delete this content?\n\nTHIS CANNOT BE UNDONE!');
    if (r === true) {
      api(`contents/${id}/${slug}`, { method: 'DELETE' }).then(fetchList);
    }
  };

  useEffect(() => {
    fetchList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
                {columns.map((f) => (
                  <th key={f}>{content[f]}</th>
                ))}
                <td>{formatDate(content)}</td>
                <td className="text-center">
                  <Link to={`edit/${content.Slug}`} className="btn btn-sm btn-secondary mr-2">
                    Edit
                  </Link>
                  <Button
                    type="button"
                    size="sm"
                    color="danger"
                    onClick={() => deleteContent(content.Slug)}
                  >
                    Delete
                  </Button>
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
