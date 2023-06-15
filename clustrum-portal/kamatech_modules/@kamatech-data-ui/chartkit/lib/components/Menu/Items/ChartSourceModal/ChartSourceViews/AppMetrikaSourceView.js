import React from 'react';
import PropTypes from 'prop-types';
import block from 'bem-cn-lite';

import { Link } from 'lego-on-react';

// import '../ChartSourceModal.scss';

const b = block('chart-source-modal');

const generateKey = value => `${value}${Date.now()}`;

export default function AppMetrikaSourceView({ index, source }) {
  const {
    data: { application: { id, name, bundle_id: bundleId } = {} } = {},
    name: sourceName,
  } = source;

  const title = `ID: ${id}`;
  const subTitle = `${name} ${(bundleId && `(${bundleId})`) || ''}`;

  return (
    <div className={b('row', { border_bottom: true })} key={`${index}_${source.url}`}>
      <div className={b('column')}>{index + 1}.</div>
      <div className={b('column', { left: true })}>{sourceName}</div>
      <div className={b('column', { middle: true })}>
        <div className={b('cell')}>
          <Link
            theme="normal"
            mix={{ block: b('link', { source: true }) }}
            target="_blank"
            url={`https://appmetrica.yandex.ru/statistic?appId=${id}`}
          >
            {title}
          </Link>
        </div>
        <div className={b('subTitle', { indent_top: true })}>{subTitle}</div>
      </div>
      <div className={b('column', { right: true })}></div>
    </div>
  );
}

AppMetrikaSourceView.propTypes = {
  index: PropTypes.number.isRequired,
  source: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    data: PropTypes.shape({
      application: PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
      }),
    }),
  }),
};
