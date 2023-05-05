import React, { createRef } from 'react';
import PropTypes from 'prop-types';
import ReactAceEditor from 'react-ace';
import block from 'bem-cn-lite';

import 'brace';
import 'brace/ext/language_tools';
// import '../../libs/ace/mode/clickhouse';
import '../../libs/ace/theme/clustrum';
import FormulaAutocompleter from './utils/FormulaAutocompleter';

// import './AceEditor.scss';

const b = block('clustrum-ace-editor');

class AceEditor extends React.Component {
  static propTypes = {
    formula: PropTypes.string.isRequired,
    modePath: PropTypes.string.isRequired,
    aceModeUrl: PropTypes.string.isRequired,
    annotations: PropTypes.array.isRequired,
    onChange: PropTypes.func.isRequired,
    forwardedRef: PropTypes.object,
    isAutocompleteEnabled: PropTypes.bool,
  };

  static defaultProps = {
    modePath: 'static/ace/',
  };

  _forwardedRef = createRef();

  constructor(props) {
    super(props);

    const { forwardedRef } = props;

    if (forwardedRef) {
      this._forwardedRef = forwardedRef;
    }
  }

  componentDidMount = () => {
    this._disableAutocomplete();
  };

  render() {
    const { onChange, formula, aceModeUrl, annotations, modePath } = this.props;

    const mode = (aceModeUrl.match(/.*\/mode-(.*).js/) || [])[1];

    return (
      <div className={b()}>
        <ReactAceEditor
          name="clustrum"
          ref={this._forwardedRef}
          mode={mode}
          theme="clustrum"
          fontSize={14}
          width="100%"
          height="100%"
          showPrintMargin={false}
          showGutter={true}
          highlightActiveLine={true}
          value={formula}
          annotations={annotations}
          onChange={onChange}
          onBeforeLoad={ace => {
            ace.config.set('modePath', modePath);
          }}
          setOptions={{
            enableLiveAutocompletion: true,
            enableSnippets: false,
            showLineNumbers: true,
            tabSize: 2,
          }}
          commands={[
            {
              name: 'startAutocomplete',
              exec: function(editor) {
                if (editor && editor.completer) {
                  editor.completer.autoInsert = false;
                  editor.completer.autoSelect = true;
                  editor.completer.showPopup(editor);
                  editor.completer.cancelContextMenu();
                }
              },
              bindKey: 'Ctrl-Space|Ctrl-Shift-Space|Alt-Space',
            },
          ]}
        />
      </div>
    );
  }

  _disableAutocomplete() {
    if (this._forwardedRef && this._forwardedRef.current && !this.props.isAutocompleteEnabled) {
      const { editor } = this._forwardedRef.current;

      const autocompleter = new FormulaAutocompleter({
        getAutocomplete: () => null,
      });

      autocompleter.setupEditor(editor, true);
    }
  }
}

function ForwardedAceEditor(props, ref) {
  return <AceEditor {...props} forwardedRef={ref} />;
}

ForwardedAceEditor.displayName = 'AceEditor';

export default React.forwardRef(ForwardedAceEditor);
