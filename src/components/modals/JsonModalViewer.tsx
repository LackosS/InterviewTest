import JsonView from '@uiw/react-json-view';
import Modal from 'react-modal';
import { CompanyFormProps } from '../../models/CompanyFormProps';

Modal.setAppElement('#root');

interface JsonModalViewerProps {
  jsonData: CompanyFormProps;
  modalIsOpen: boolean;
  setModalIsOpen: (isOpen: boolean) => void;
}

function JsonModalViewer ({ jsonData, modalIsOpen, setModalIsOpen}: JsonModalViewerProps) {
  function closeModal() {
    setModalIsOpen(false);
  }

  return (
      <div>
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          shouldCloseOnOverlayClick={true}
          contentLabel="JSON Data"
          style={{
            content: {
              top: '50%',
              left: '50%',
              right: 'auto',
              bottom: 'auto',
              marginRight: '-50%',
              transform: 'translate(-50%, -50%)',
              width: '80%',
              border: '1px solid #ccc',
              background: '#fff',
              overflow: 'auto',
              WebkitOverflowScrolling: 'touch',
              borderRadius: '4px',
              outline: 'none',
              padding: '20px'
            }
          }}
        >
          <h2 className="text-lg font-bold mb-4">
            Data sent to the backend..
          </h2>
          <JsonView value={jsonData} />
          <button 
            onClick={closeModal} 
            className="mt-4 p-2 bg-red-500 text-white rounded"
          >
              Close
          </button>
        </Modal>
      </div>
    );
  };

export default JsonModalViewer;
  