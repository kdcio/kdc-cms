import React, { useState, useEffect } from 'react';
import { Row, Col, Card, CardBody, CardHeader } from 'reactstrap';
import Layout from '../../components/layout';
import { useContentTypeList } from '../../context/contentTypeList';

const Dashboard = () => {
  const { getTypes } = useContentTypeList();
  const [types, setTypes] = useState([]);

  useEffect(() => {
    setTypes(getTypes());
  });

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
          <Card>
            <CardHeader>
              <h3 className="m-0">CMS Stats</h3>
            </CardHeader>
            <CardBody>
              {/* TODO: Add more site statistics. ie Pages and users */}
              <ul>
                {types.map((t) => (
                  <li key={t.id}>
                    <strong>
                      {t.name} - {t.docCount}
                    </strong>
                  </li>
                ))}
              </ul>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Layout>
  );
};

export default Dashboard;
