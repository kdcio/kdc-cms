/* eslint-disable no-undef */
/* eslint-disable no-alert */
/* eslint-disable no-restricted-globals */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from '@reach/router';
import { Card, CardBody, CardHeader, Button } from 'reactstrap';
import moment from 'moment';
import { useContentTypeList } from '../../../context/contentTypeList';
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

const ContentsList = ({ id }) => {
  const { getType } = useContentTypeList();
  const [list, setList] = useState([]);
  const [next, setNext] = useState(null);
  const [nextStack, setNextStack] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const type = getType(id);

  const fetchList = (start) => {
    setIsLoading(true);
    let url = `contents/${id}?limit=5`;
    if (start) {
      url += `&start=${start}`;
    }
    return api(url).then((data) => {
      setList(data.list);
      setIsLoading(false);
      setNext(data.next);
      setNextStack((oldStack) => [...oldStack, data.next]);
      return data.next;
    });
  };

  const nextPage = () => {
    fetchList(next);
  };

  const prevPage = () => {
    if (nextStack.length === 2) {
      setNextStack([]);
      fetchList();
    } else if (nextStack.length > 2) {
      nextStack.pop();
      nextStack.pop();
      const prev = nextStack[nextStack.length - 1];
      setNextStack([...nextStack]);
      fetchList(prev);
    }
  };

  const deleteContent = (slug) => {
    const r = confirm('Are you sure you want to delete this content?\n\nTHIS CANNOT BE UNDONE!');
    if (r === true) {
      setIsLoading(true);
      api(`contents/${id}/${slug}`, { method: 'DELETE' })
        .then(fetchList)
        .then(() => setIsLoading(false));
    }
  };

  useEffect(() => {
    fetchList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (!type) return null;
  const { sortKey } = type;

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
              <th className="text-capitalize">Name</th>
              <th className="text-capitalize">{sortKey}</th>
              <th>Last Modified</th>
              <th className="text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <RowSpinner colSpan={4} />
            ) : (
              list.map((content) => (
                <tr key={content.Slug}>
                  <th>{content.Name}</th>
                  <td>{content[sortKey]}</td>
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
              ))
            )}
          </tbody>
        </Table>
        <div className="d-flex justify-content-between">
          <Button size="sm" outline disabled={nextStack.length <= 1} onClick={prevPage}>
            <FontAwesomeIcon icon="chevron-left" /> Prev
          </Button>
          <Button size="sm" outline disabled={!next} onClick={nextPage}>
            Next <FontAwesomeIcon icon="chevron-right" />
          </Button>
        </div>
      </CardBody>
    </Card>
  );
};

ContentsList.propTypes = {
  id: PropTypes.string,
};

export default ContentsList;
