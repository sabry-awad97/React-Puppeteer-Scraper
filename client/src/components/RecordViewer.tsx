import { Modal } from 'antd';
import React from 'react';
import { TCurrentViewRecord } from '../types';
import ReactJson from 'react-json-view';

interface Props {
  record: TCurrentViewRecord | null;
  visible: boolean;
  onCancel: () => void;
}

const RecordViewer: React.FC<Props> = ({ record, visible, onCancel }) => {
  return (
    <Modal
      title={`Details`}
      open={visible}
      onCancel={onCancel}
      width={700}
      footer={null}
    >
      {record !== null && <ReactJson src={record} />}
    </Modal>
  );
};

export default RecordViewer;
