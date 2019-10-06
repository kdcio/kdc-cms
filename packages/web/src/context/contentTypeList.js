import React, { useState, useEffect, useContext, createContext } from 'react';
import PropTypes from 'prop-types';
import api from '../utils/api';

const ContentTypeListContext = createContext();

export const useContentTypeList = () => useContext(ContentTypeListContext);

export const ContentTypeListProvider = ({ children }) => {
  const [typeList, setTypeList] = useState([]);

  const fetchList = () => {
    api('content-definition').then((data) => {
      setTypeList(data);
    });
  };

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <ContentTypeListContext.Provider value={{ typeList, setTypeList, fetchList }}>
      {children}
    </ContentTypeListContext.Provider>
  );
};

ContentTypeListProvider.propTypes = {
  children: PropTypes.object.isRequired,
};
