/* eslint-disable no-undef */
/* eslint-disable no-alert */
/* eslint-disable no-restricted-globals */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link, navigate } from '@reach/router';
import { Card, CardBody, CardHeader, Button } from 'reactstrap';
import moment from 'moment';
import { useContentTypeList } from '../../../context/contentTypeList';
import RowSpinner from '../../../components/rowSpinner';
import Table from '../../../components/table';
import api from '../../../utils/api';

const ITEMS_PER_PAGE = 5;

const formatDate = (page) => {
  let ts = 0;
  if (page.updatedAt) ts = page.updatedAt;
  else if (page.createdAt) ts = page.createdAt;

  if (ts === 0) return '';

  return moment(ts).format('MMM D, YYYY h:mma');
};

const ContentsList = ({ typeId }) => {
  const { getType, fetchList: fetchTypeList } = useContentTypeList();
  const [list, setList] = useState([]);
  const [next, setNext] = useState(null);
  const [prev, setPrev] = useState(null);
  const [, setStack] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [curPage, setCurPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const type = getType(typeId);

  const pushStack = (item) => {
    if (curPage === 1) {
      setStack([item]);
    } else {
      setStack((oldStack) => {
        oldStack.push(item);
        setPrev(oldStack[oldStack.length - 2]);
        return [...oldStack];
      });
    }
  };

  const popStack = (ctr) => {
    setStack((oldStack) => {
      if (ctr === 2) oldStack.pop();
      oldStack.pop();
      setPrev(oldStack[oldStack.length - 2]);
      return [...oldStack];
    });
  };

  const fetchList = (start) => {
    setIsLoading(true);
    let url = `contents/${typeId}?limit=${ITEMS_PER_PAGE}`;
    if (start) {
      url += `&start=${start}`;
    }
    return api(url)
      .then((data) => {
        setList(data.list);
        if (data.next) {
          setNext(data.next);
        } else {
          setNext(null);
        }
        setIsLoading(false);
        return start || null;
      })
      .catch(() => navigate('/404'));
  };

  const nextPage = () => {
    pushStack(next);
    fetchList(next).then(() => {
      setCurPage((oldPage) => oldPage + 1);
    });
  };

  const prevPage = () => {
    popStack(1);
    if (curPage === 2) {
      fetchList().then(() => setCurPage((oldPage) => oldPage - 1));
    } else {
      fetchList(prev).then(() => setCurPage((oldPage) => oldPage - 1));
    }
  };

  const deleteContent = (contentId) => {
    const r = confirm('Are you sure you want to delete this content?\n\nTHIS CANNOT BE UNDONE!');
    if (r === true) {
      setIsLoading(true);
      api(`contents/${typeId}/${contentId}`, { method: 'DELETE' })
        .then(async () => {
          await fetchTypeList();
          await fetchList();
        })
        .then(() => setIsLoading(false));
    }
  };

  useEffect(() => {
    setCurPage(1);
    setNext(null);
    setList([]);
    setTotalPages(1);
    fetchList();
    if (!type) return;
    const { docCount } = type;

    setTotalPages(Math.ceil(docCount / ITEMS_PER_PAGE) || 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [typeId, type]);

  if (!type) return null;
  const { sortKey, nameKey } = type;

  return (
    <Card>
      <CardHeader className="d-flex justify-content-between">
        <h3 className="m-0">List {type.name}</h3>
        <Link to={`/contents/${typeId}/add`} className="btn btn-sm btn-primary">
          Add {type.name}
        </Link>
      </CardHeader>
      <CardBody>
        <p>
          <strong>API Endpoint:</strong> {process.env.REACT_APP_API_URL}/contents/{typeId}
        </p>
        <Table hover striped responsive>
          <thead>
            <tr>
              <th className="text-capitalize">Name</th>
              {nameKey !== sortKey ? <th className="text-capitalize">{sortKey}</th> : null}
              <th>Last Modified</th>
              <th className="text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <RowSpinner colSpan={4} />
            ) : (
              list.map((content) => (
                <tr key={content.id}>
                  <th>{content[nameKey]}</th>
                  {nameKey !== sortKey ? <td>{content[sortKey]}</td> : null}
                  <td>{formatDate(content)}</td>
                  <td className="text-center">
                    <Link to={`edit/${content.id}`} className="btn btn-sm btn-secondary mr-2">
                      Edit
                    </Link>
                    <Button
                      type="button"
                      size="sm"
                      color="danger"
                      onClick={() => deleteContent(content.id)}
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
          <Button size="sm" outline disabled={curPage === 1} onClick={prevPage}>
            <FontAwesomeIcon icon="chevron-left" /> Prev
          </Button>
          <div className="muted">
            {curPage} of {totalPages}
          </div>
          <Button
            size="sm"
            outline
            disabled={next === null || curPage === totalPages}
            onClick={nextPage}
          >
            Next <FontAwesomeIcon icon="chevron-right" />
          </Button>
        </div>
      </CardBody>
    </Card>
  );
};

ContentsList.propTypes = {
  typeId: PropTypes.string,
};

export default ContentsList;
