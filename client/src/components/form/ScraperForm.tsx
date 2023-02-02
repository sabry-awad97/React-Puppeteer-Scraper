import './form.scss';

import { Button, Col, Form, Input, Modal, Row, Select, Spin } from 'antd';
import React, { ChangeEvent, useCallback, useMemo, useState } from 'react';

import { useSocket } from '../../hooks/useSocket';
import { useAppSelector } from '../../state/hooks';
import { selectLoading } from '../../state/selectors';
import Terminal from '../terminal/Terminal';
import { IField } from '../../types';

const ScraperForm: React.FC = () => {
  const loading = useAppSelector(selectLoading);
  const [urls, setUrls] = useState<string[]>([]);
  const [urlsValidateStatus, setUrlsValidateStatus] = useState<'' | 'error'>(
    ''
  );
  const [urlsHelp, setUrlsHelp] = useState('');
  const [nextButton, setNextButton] = useState('');
  const [showMoreButton, setShowMoreButton] = useState('');
  const [reviewElement, setReviewElement] = useState('');
  const [fields, setFields] = useState<IField[]>([]);

  const fieldData = useMemo(
    () =>
      fields.map(field => ({
        fieldName: field.fieldName,
        className: field.className,
        type: field.type,
      })),
    [fields]
  );

  const handleUrlsChange = (event: ChangeEvent<HTMLInputElement>) => {
    setUrls(event.target.value.split(',').map(u => u.trim()));
    if (!event.target.value) {
      setUrlsValidateStatus('error');
      setUrlsHelp('Please enter at least one URL');
    } else {
      setUrlsValidateStatus('');
      setUrlsHelp('');
    }
  };

  const handleNextButtonChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNextButton(e.target.value);
  };

  const handleShowMoreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShowMoreButton(e.target.value);
  };

  const handleReviewElementChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setReviewElement(e.target.value);
  };

  const handleAddField = () => {
    setFields([...fields, { fieldName: '', className: '', type: '' }]);
  };

  const handleFieldChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
      const newFields = [...fields];
      const { name, value } = e.target;
      newFields[index] = { ...newFields[index], [name]: value };
      setFields(newFields);
    },
    [fields, setFields]
  );

  const handleTypeChange = useCallback(
    (value: string, index: number) => {
      const newFields = [...fields];
      newFields[index] = { ...newFields[index], type: value };
      setFields(newFields);
    },
    [fields, setFields]
  );

  const handleRemoveField = (index: number) => {
    setFields(fields.filter((field, i) => i !== index));
  };

  const handleSaveConfig = () => {
    localStorage.setItem(
      'scraperConfig',
      JSON.stringify({
        urls,
        nextButton,
        showMoreButton,
        reviewElement,
        fieldData,
      })
    );
  };

  const handleLoadConfig = () => {
    const savedConfig = JSON.parse(localStorage.getItem('scraperConfig')!);
    if (savedConfig) {
      const { urls, nextButton, showMoreButton, reviewElement, fieldData } =
        savedConfig;

      setUrls(urls);
      setNextButton(nextButton);
      setShowMoreButton(showMoreButton);
      setReviewElement(reviewElement);
      setFields(fieldData);
    }
  };

  const { startScraping } = useSocket();
  const isScraping = useAppSelector(selectLoading);

  

  const handleSubmit = () => {
    startScraping({
      urls,
      nextButton,
      showMoreButton,
      reviewElement,
      fieldData,
    });
  };

  return (
    <div>
      <Form onFinish={handleSubmit}>
        <div>
          <Spin spinning={isScraping} tip="Scraping data..."></Spin>
        </div>
        <div>Scraper Form</div>
        <Form.Item
          label="URLs"
          validateStatus={urlsValidateStatus}
          help={urlsHelp}
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 12 }}
        >
          <Input
            placeholder="Enter URLs separated by commas"
            value={urls.join(',')}
            onChange={e => {
              console.log(e.target.value);
              handleUrlsChange(e);
            }}
            size="large"
            autoComplete="off"
          />
        </Form.Item>
        <Form.Item
          label="Next Button"
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 12 }}
        >
          <Input
            placeholder="Enter the class of the next button"
            value={nextButton}
            onChange={handleNextButtonChange}
            size="large"
            autoComplete="off"
          />
        </Form.Item>
        <Form.Item
          label="Show More"
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 12 }}
        >
          <Input
            placeholder="Enter the class of the show more button"
            value={showMoreButton}
            onChange={handleShowMoreChange}
            size="middle"
            autoComplete="off"
          />
        </Form.Item>
        <Form.Item
          label="Review Element"
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 12 }}
        >
          <Input
            placeholder="Enter the class of the review element"
            value={reviewElement}
            onChange={handleReviewElementChange}
            size="middle"
            autoComplete="off"
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" onClick={() => handleAddField()} size="small">
            Add Field
          </Button>
        </Form.Item>
        {fields.map((field, index) => (
          <Form.Item
            key={index}
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 12 }}
          >
            <Row
              style={{
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              <Col span={5}>
                <Input
                  placeholder="Enter field name"
                  name="fieldName"
                  value={field.fieldName}
                  onChange={e => handleFieldChange(e, index)}
                  autoComplete="off"
                />
              </Col>
              <Col span={5}>
                <Input
                  placeholder="Enter field class name"
                  name="className"
                  value={field.className}
                  onChange={e => handleFieldChange(e, index)}
                  autoComplete="off"
                />
              </Col>
              <Col span={5}>
                <Select
                  placeholder="Select field type"
                  value={field.type}
                  onChange={value => handleTypeChange(value, index)}
                >
                  <Select.Option value="text">Text</Select.Option>
                  <Select.Option value="array">List</Select.Option>
                </Select>
              </Col>
              <Col span={2}>
                <Button
                  type="default"
                  onClick={() => handleRemoveField(index)}
                  size="middle"
                >
                  X
                </Button>
              </Col>
            </Row>
          </Form.Item>
        ))}
        <Form.Item>
          <Row
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              maxWidth: '50%',
            }}
          >
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
            <Button type="primary" onClick={handleSaveConfig}>
              Save Config
            </Button>
            <Button type="primary" onClick={handleLoadConfig}>
              Load Config
            </Button>
          </Row>
        </Form.Item>
        <div>Copyright © {new Date().getFullYear()}</div>
      </Form>
    </div>
  );
};

export default ScraperForm;
