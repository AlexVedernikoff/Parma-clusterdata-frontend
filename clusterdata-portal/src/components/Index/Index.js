import React from 'react';
import { withRouter } from 'react-router-dom';
import { Navigation } from '@parma-data-ui/clusterdata';
import { SDK } from '../../modules/sdk';

function Index(props) {
  return (
    <div className="index">
      <Navigation sdk={SDK} {...props} />
    </div>
  );
}

export default withRouter(Index);
