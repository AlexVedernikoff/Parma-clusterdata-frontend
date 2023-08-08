import React, { createContext } from 'react';
import PropTypes from 'prop-types';
import block from 'bem-cn-lite';

import Dataset from '../../containers/Dataset/Dataset';

// import './DatasetPage.scss';

const DatasetPageContext = createContext({});
export const DatasetPageProvider = DatasetPageContext.Provider;
export const DatasetPageConsumer = DatasetPageContext.Consumer;

const b = block('dataset-page');

class DatasetPage extends React.Component {
  static propTypes = {
    sdk: PropTypes.object.isRequired,
    isBuild: PropTypes.bool,
  };

  constructor(props) {
    super(props);

    const { match: { params: { datasetId } = {} } = {} } = props;

    this.state = {
      datasetId,
    };
  }

  render() {
    const { sdk, isBuild } = this.props;
    const { datasetId } = this.state;
    const datasetName = this.props.location.state?.datasetName;

    return (
      <div className={b()}>
        <DatasetPageProvider value={{ sdk }}>
          <Dataset
            sdk={sdk}
            datasetId={datasetId}
            initialDatasetName={datasetName}
            isBuild={isBuild}
          />
        </DatasetPageProvider>
      </div>
    );
  }
}

export default DatasetPage;
