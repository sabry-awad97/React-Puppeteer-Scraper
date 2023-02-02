import { Alert, Card, Col, Row, Tabs, Spin } from 'antd';

import React from 'react';

import { useAppSelector } from '../state/hooks';
import { selectErrorMessage, selectLoading } from '../state/selectors';
import ScraperForm from './form/ScraperForm';
import ScraperData from './ScraperData';
import Viewport from './Viewport/Viewport';

const Scraper: React.FC = () => {
  const errorMessage = useAppSelector(selectErrorMessage);
  const isScraping = useAppSelector(selectLoading);

  return (
    <>
      <Row>
        <Col span={24}>
          <Card>
            <Tabs
              items={[
                {
                  key: '1',
                  label: 'Input',
                  children: <ScraperForm />,
                },
                {
                  key: '2',
                  label: 'Scraped Data',
                  children: <ScraperData />,
                },
                {
                  key: '3',
                  label: 'Viewport',
                  children: <Viewport />,
                },
              ]}
              defaultActiveKey="1"
            />
          </Card>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          {errorMessage && (
            <Alert
              message={errorMessage}
              type="error"
              showIcon
              style={{ marginBottom: '1rem' }}
            />
          )}
          {isScraping && <Spin size="large" style={{ marginBottom: '1rem' }} />}
        </Col>
      </Row>
    </>
  );
};

export default Scraper;
