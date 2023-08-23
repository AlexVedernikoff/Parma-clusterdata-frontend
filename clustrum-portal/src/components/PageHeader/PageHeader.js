import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';

function PageHead({ title }) {
  const systemTitle = BUILD_SETTINGS.systemTitle;

  return (
    <Helmet defaultTitle={systemTitle} titleTemplate={`%s - ${systemTitle}`} key="helmet">
      <title>{title}</title>
    </Helmet>
  );
}

PageHead.propTypes = {
  title: PropTypes.string,
};

export default PageHead;
