import React, {createContext} from 'react';
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
        sdk: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);

        const {
            match: {
                params: {
                    datasetId
                } = {}
            } = {}
        } = props;

        this.state = {
            datasetId
        };
    }

    render() {
        const {sdk} = this.props;
        const {datasetId} = this.state;

        return (
            <div className={b()}>
                <DatasetPageProvider value={{sdk}}>
                    <Dataset
                        sdk={sdk}
                        datasetId={datasetId}
                    />
                </DatasetPageProvider>
            </div>
        );
    }
}


export default DatasetPage;
