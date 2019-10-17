import React, { useState, useEffect, useContext, createContext } from 'react';
import PropTypes from 'prop-types';
import find from 'lodash.find';
import api from '../utils/api';

const ContentTypeListContext = createContext();

export const useContentTypeList = () => useContext(ContentTypeListContext);

export const ContentTypeListProvider = ({ children }) => {
  const [typeList, setTypeList] = useState([]);

  const getType = (id) => find(typeList, { id });

  const fetchList = () => {
    api('define/contents').then((data) => {
      setTypeList(data);
    });
  };

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <ContentTypeListContext.Provider value={{ typeList, setTypeList, fetchList, getType }}>
      {children}
    </ContentTypeListContext.Provider>
  );
};

ContentTypeListProvider.propTypes = {
  children: PropTypes.object.isRequired,
};
