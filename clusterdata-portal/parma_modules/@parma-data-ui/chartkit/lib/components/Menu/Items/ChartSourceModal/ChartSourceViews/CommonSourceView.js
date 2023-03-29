import React from 'react';
import PropTypes from 'prop-types';
import block from 'bem-cn-lite';

import { Link } from 'lego-on-react';

import settings from '../../../../../modules/settings/settings';

// import '../ChartSourceModal.scss';

const b = block('chart-source-modal');

export default function CommonSourceView({ index, source }) {
  const config = settings.config[source.type];
  // у источников из ноды начало на https://..., у yql - //:..., у других - /_...
  const url = /\/\/:?/.test(source.url) ? source.url : settings.chartsEndpoint + source.url;
  return (
    <div className={b('row', { border_bottom: true })} key={`${index}_${source.url}`}>
      <div className={b('column')}>{index + 1}.</div>
      <div className={b('column', { left: true })}>{config ? config.description.title : source.type}</div>
      <div className={b('column', { middle: true })}>
        <div className={b('cell')}>
          {source.method === 'get' ? (
            <Link theme="normal" mix={{ block: b('link', { source: true }) }} target="_blank" url={url}>
              {source.name}
            </Link>
          ) : (
            <span className={b('link', { source: true })}>{source.name}</span>
          )}
        </div>
      </div>
      <div className={b('column', { right: true })}></div>
    </div>
  );
}

CommonSourceView.propTypes = {
  index: PropTypes.number.isRequired,
  source: PropTypes.shape({
    name: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    // method
  }),
};
