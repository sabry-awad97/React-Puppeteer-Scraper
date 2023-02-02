import './viewport.css';

import { useAppSelector } from '../../state/hooks';
import { selectScreenshot } from '../../state/selectors';
import { Button, Modal } from 'antd';
import Terminal from '../terminal/Terminal';
import { useState } from 'react';

const Viewport = () => {
  const screenshot = useAppSelector(selectScreenshot);
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <>
      <Button type="primary" onClick={() => setModalVisible(true)}>
        Show Results
      </Button>

      <Modal
        title="Results"
        open={modalVisible}
        width={700}
        onOk={() => setModalVisible(false)}
        onCancel={() => setModalVisible(false)}
      >
        <Terminal />
      </Modal>
      <div className="viewport">
        {screenshot ? (
          <img className="screenshot" src={screenshot} alt="Screenshot" />
        ) : (
          <div>Loading...</div>
        )}
      </div>
    </>
  );
};

export default Viewport;
