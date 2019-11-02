import React, { useState, useEffect } from 'react';
import { Row, Col, Card, CardBody, CardHeader, Button } from 'reactstrap';
import Layout from '../../components/layout';
import { useContentTypeList } from '../../context/contentTypeList';
import LoadingOverlay from '../../components/loadingOverlay';
import api from '../../utils/api';

const Dashboard = () => {
  const { getTypes, fetchList: fetchTypeList } = useContentTypeList();
  const [types, setTypes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const seedPages = () => api('seed/pages');
  const seedBlog = () => api('seed/blogs');
  const seedCMS = () => {
    setIsLoading(true);
    return seedPages()
      .then(seedBlog)
      .then(fetchTypeList)
      .then(() => {
        setTypes(getTypes());
        setIsLoading(false);
      });
  };

  useEffect(() => {
    setTypes(getTypes());
  }, [getTypes]);

  return (
    <Layout title="Dashboard">
      <Row>
        <Col lg={6}>
          <Card className="mb-2">
            <CardHeader>
              <h3 className="m-0">Welcome</h3>
            </CardHeader>
            <CardBody>
              <p>
                Do you like <a href="https://github.com/ianpogi5/kdc-cms">KDC CMS</a>? Please
                consider giving a star on our{' '}
                <a href="https://github.com/ianpogi5/kdc-cms">GitHub repository</a>.
              </p>
              {/* TODO: List new releases here */}
              {/* TODO: Add documentation and tutorials */}
            </CardBody>
          </Card>
        </Col>
        <Col lg={6}>
          <LoadingOverlay isLoading={isLoading}>
            <Card>
              <CardHeader>
                <h3 className="m-0">CMS Stats</h3>
              </CardHeader>
              <CardBody>
                {/* TODO: Add more site statistics. ie Pages and users */}
                {types.length > 0 ? (
                  <ul>
                    {types.map((t) => (
                      <li key={t.id}>
                        <strong>
                          {t.name} - {t.docCount}
                        </strong>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <>
                    <p>
                      You currently have no content. For a quick start, click the button below to
                      create initial data.
                    </p>
                    <Button color="success" onClick={seedCMS}>
                      Seed CMS
                    </Button>
                  </>
                )}
              </CardBody>
            </Card>
          </LoadingOverlay>
        </Col>
      </Row>
    </Layout>
  );
};

export default Dashboard;
