import React from 'react';
import PropTypes from 'prop-types';
import block from 'bem-cn-lite';
import { Link, TextInput } from 'lego-on-react';

import AceEditor from '../../../AceEditor/AceEditor';
import AccessibleFields from '../AccessibleFields/AccessibleFields';
import FunctionManual from '../FunctionManual/FunctionManual';
import { I18n } from 'utils/i18n';
const i18n = I18n.keyset('component.field-editor.view');

// import './FormulaEditor.scss';

const b = block('formula-editor');

class FormulaEditor extends React.Component {
  static defaultProps = {
    isVisibleFunctionManual: false,
  };

  static propTypes = {
    formula: PropTypes.string.isRequired,
    aceModeUrl: PropTypes.string.isRequired,
    datasetId: PropTypes.string.isRequired,
    annotations: PropTypes.array.isRequired,
    fields: PropTypes.array.isRequired,
    sdk: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    isVisibleFunctionManual: PropTypes.bool,
    modePath: PropTypes.string,
  };

  state = {
    searchKeyword: '',
  };

  async componentDidMount() {
    const { isNewField } = this.props;

    if (this._formulaEditorRef.current && !isNewField) {
      this._formulaEditorRef.current.editor.focus();
    }
  }

  componentWillUnmount() {
    // TODO: think of it to use ace method to hide popup
    if (this._formulaEditorRef.current) {
      const autocompleteDomRefs = document.getElementsByClassName('ace_autocomplete');

      Array.from(autocompleteDomRefs).forEach(autocompleteDomRef => {
        autocompleteDomRef.parentNode.removeChild(autocompleteDomRef);
      });
    }
  }

  get filteredFields() {
    const { fields } = this.props;
    const { searchKeyword } = this.state;

    return fields.filter(field => {
      const { title = '' } = field;

      return title.toLowerCase().includes(searchKeyword.toLowerCase());
    });
  }

  _formulaEditorRef = React.createRef();

  getAutocomplete = async ({ text, row, column }) => {
    const { sdk, datasetId, fields } = this.props;

    try {
      const fieldNames = fields.map(({ title }) => title);

      const { suggestions } = await sdk.bi.getFormulaSuggest(
        {
          dataSetId: datasetId,
          version: 'draft',
          fieldNames,
          formula: text,
          posRow: row,
          posColumn: column,
        },
        { cancelable: true },
      );

      return suggestions;
    } catch (e) {
      return [];
    }
  };

  onChangeSearchInput = searchKeyword => {
    this.setState({
      searchKeyword,
    });
  };

  onClickField = ({ title }) => {
    if (this._formulaEditorRef) {
      const { editor } = this._formulaEditorRef.current;

      editor.insert(`[${title}]`);
    }
  };

  render() {
    const { sdk, formula, annotations, aceModeUrl, modePath, isVisibleFunctionManual, onChange } = this.props;
    const { searchKeyword } = this.state;
    const { endpoints: { docsSyntax } = {} } = window.DL;

    return (
      <div className={b()}>
        <div className={b('columns')}>
          <div className={b('column-left')}>
            <div className={b('search-field')}>
              <TextInput
                cls={b('field-finder-inp')}
                theme="normal"
                size="s"
                view="default"
                tone="default"
                placeholder={i18n('label_placeholder-field')}
                text={searchKeyword}
                onChange={this.onChangeSearchInput}
              />
            </div>
            <AccessibleFields fields={this.filteredFields} onClick={this.onClickField} />
          </div>
          <div className={b('column-right')}>
            <AceEditor
              ref={this._formulaEditorRef}
              onChange={onChange}
              formula={formula}
              annotations={annotations}
              aceModeUrl={aceModeUrl}
              modePath={modePath}
            />
          </div>
        </div>
        {isVisibleFunctionManual ? (
          <FunctionManual sdk={sdk} />
        ) : (
          docsSyntax && (
            <div className={b('helper-syntax')}>
              <Link theme="ghost" target="_blank" url={docsSyntax}>
                <span>{i18n('label_information-about-syntax-on-wiki')}</span>
              </Link>
            </div>
          )
        )}
      </div>
    );
  }
}

export default FormulaEditor;
