import React from 'react';
import PropTypes from 'prop-types';
import block from 'bem-cn-lite';

import i18nFactory from '../../../../../modules/i18n/i18n';
import settings from '../../../../../modules/settings/settings';
import {Link} from 'lego-on-react';

// import '../ChartSourceModal.scss';

const i18n = i18nFactory('ChartSourceModal');
const b = block('chart-source-modal');
const generateKey = (value) => `${value}${Date.now()}`;

function _breadcrumbs(items, linkMod) {
    return (
        <div className={b('cell')}>
            {items.map((item, index) => (
                <div
                    className={b('breadcrumb')}
                    key={generateKey(item.name)}
                >
                    {index !== 0 && <span className={b('delimiter')}>/</span>}

                    <Link
                        theme="normal"
                        mix={{block: b('link', {[linkMod]: true})}}
                        target="_blank"
                        url={`${settings.statfaceEndpoint}/${item.name}`}
                    >
                        {item.title}
                    </Link>
                </div>
            ))}
        </div>);
}

export default function StatSourceView({index, source}) {
    let _projects;
    let _reports;
    let _source;
    let _trafReport;
    let _dimensions;

    if (source.data) {
        if (source.data.is_dictionary) {
            _source = {name: source.name, title: source.data.name, url: source.data.uri.replace('/vcfs/', '/')};

            const params = source.data.params;

            if (params.language) {
                _dimensions = (
                    <div className={b('cell', {dimension: true})}>
                        <span className={b('grey')}>
                            {`${i18n('language')}: `}
                        </span>
                        {params.language}
                    </div>
                );
            }
        }

        if (source.data.is_report) {
            const projects = source.data.breadcrumbs.projects;

            if (projects && projects.length > 0) {
                _projects = _breadcrumbs(projects, 'project');
            }

            const reports = source.data.breadcrumbs.reports;

            if (reports && reports.length > 0) {
                _reports = _breadcrumbs(reports, 'report');
            }

            _source = {name: source.name, title: source.data.title, url: `${settings.statfaceEndpoint}${source.data.uri}`};

            const reportInfo = source.data.extras.reportInfo;

            if (reportInfo) {
                let dimensions = reportInfo.dimensions || [];

                if (reportInfo.region) {
                    dimensions = [{title: i18n('region'), valueTitle: reportInfo.region.title}].concat(dimensions);
                }

                if (reportInfo.scale) {
                    dimensions = [{title: i18n('detalization'), valueTitle: i18n(reportInfo.scale.title)}].concat(dimensions);
                }

                if (dimensions && dimensions.length > 0) {
                    _dimensions = dimensions.map((dimension) => (
                        <div
                            className={b('cell', {dimension: true})}
                            key={generateKey(dimension.title)}
                        >
                            <span className={b('grey')}>
                                {`${dimension.title}: `}
                            </span>
                            {dimension.valueTitle}
                        </div>
                    ));
                }
            }

            const trafReport = source.data.traf_report;

            if (trafReport) {
                _trafReport = (
                    <div className={b('cell', {traf: true})}>
                        <div>{i18n('go-to-traf')}:</div>
                        <Link
                            theme="normal"
                            mix={{block: b('link', {'source': true})}}
                            target="_blank"
                            url={`${settings.statfaceEndpoint}${trafReport.uri}`}
                        >
                            {trafReport.title}
                        </Link>
                    </div>
                );
            }
        }
    } else {
        _source = {
            name: source.name,
            title: source.config ? source.config.description.title : source.name,
            url: source.url
        };
    }

    return (
        <div
            className={b('row', {border_bottom: true})}
            key={`${index}_${source.url}`}
        >
            <div className={b('column')}>
                {index + 1}.
            </div>
            <div className={b('column', {left: true})}>
                {_source.name}
            </div>
            <div className={b('column', {middle: true})}>
                {_projects}
                {_reports}
                <div className={b('cell')}>
                    <Link
                        theme="normal"
                        mix={{block: b('link', {'source': true})}}
                        target="_blank"
                        url={_source.url}
                    >
                        {_source.title}
                    </Link>
                </div>
                {_trafReport}
            </div>
            <div className={b('column', {right: true})}>
                {_dimensions}
            </div>
        </div>
    );
}

StatSourceView.propTypes = {
    index: PropTypes.number.isRequired,
    source: PropTypes.shape({
        name: PropTypes.string.isRequired,
        type: PropTypes.string.isRequired,
        url: PropTypes.string.isRequired,
        data: PropTypes.shape({
            is_dictionary: PropTypes.bool,
            is_report: PropTypes.bool,
            is_archive: PropTypes.bool
        })
    })
};
