import React from 'react';
import PropTypes from 'prop-types';
import block from 'bem-cn-lite';

import { Link } from 'lego-on-react';

// import '../ChartSourceModal.scss';

const b = block('chart-source-modal');

export default function MetrikaSourceView({ index, source }) {
  const { data: { counter: { id, name, site } = {} } = {}, name: sourceName } = source;

  const title = `ID: ${id}`;
  const subTitle = `${name} (${site})`;

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
            url={`https://metrika.yandex.ru/${id}`}
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

MetrikaSourceView.propTypes = {
  index: PropTypes.number.isRequired,
  source: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    data: PropTypes.shape({
      counter: PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        site: PropTypes.string.isRequired,
      }),
    }),
  }),
};
