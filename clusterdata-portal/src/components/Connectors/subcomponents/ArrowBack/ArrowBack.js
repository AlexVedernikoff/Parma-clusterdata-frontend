import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import block from 'bem-cn-lite';
import { Button } from 'lego-on-react';
import { Icon } from '@parma-data-ui/common/src';

import iconArrow from '@parma-data-ui/clusterdata/src/icons/arrow-left.svg';
// import './ArrowBack.scss';

const b = block('connector-title-arrow');

const getDefaultUrl = () => {
  const search = window.location.search;
  return `/connections/new${search}`;
};

class ArrowBack extends React.Component {
  static propTypes = {
    url: PropTypes.string,
  };

  render() {
    const { url } = this.props;

    return (
      <div className={b()}>
        <Link to={url || getDefaultUrl()}>
          <Button cls={b()} theme="flat" size="m" view="default" tone="default">
            <Icon data={iconArrow} width={20} />
          </Button>
        </Link>
      </div>
    );
  }
}

export default ArrowBack;
