import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import block from 'bem-cn-lite';
import { TextInput } from 'lego-on-react';
import { Loader } from '@kamatech-data-ui/common/src';

// import './FunctionManual.scss';

const b = block('function-manual');

function AvailableFunctions(props) {
  const {
    functionsByTypes,
    onClickFunctionItem,
    selectedFunctionItem,
    displayTypeSections,
  } = props;
  const functionTypesToggle = functionsByTypes.reduce(
    (functionsTypesToggleReducer, { name }) => {
      functionsTypesToggleReducer[name] = !displayTypeSections;

      return functionsTypesToggleReducer;
    },
    {},
  );

  const [state, setState] = useState(functionTypesToggle);

  useEffect(() => setState(functionTypesToggle), [displayTypeSections]);

  return (
    <div className={b('available-functions')}>
      {functionsByTypes.map(({ id, name, items: functions }) => {
        const isVisibleFunctionsByType = state[name];

        return (
          <div key={id} className={b('functions-by-type')}>
            {displayTypeSections && (
              <div
                className={b('functions-type')}
                onClick={() => setState({ ...state, [name]: !isVisibleFunctionsByType })}
              >
                <span>{name}</span>
              </div>
            )}
            {functions.map(({ href, name, id }) => {
              let selected = false;

              if (!isVisibleFunctionsByType) {
                return null;
              }

              if (selectedFunctionItem) {
                const { id: selectedFunctionItemId } = selectedFunctionItem;

                if (id === selectedFunctionItemId) {
                  selected = true;
                }
              }

              return (
                <div
                  key={id}
                  className={b('function-name', {
                    selected,
                    indent: displayTypeSections,
                  })}
                  onClick={() => onClickFunctionItem({ id, href, name })}
                >
                  <span>{name}</span>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

function FunctionDoc(props) {
  const { isLoading, functionDoc } = props;

  if (isLoading) {
    return (
      <div className={b('function-doc-loader')}>
        <Loader size="m" />
      </div>
    );
  }

  if (!functionDoc) {
    return null;
  }

  const { html } = functionDoc;

  return <div className={b('function-doc')} dangerouslySetInnerHTML={{ __html: html }} />;
}

class FunctionManual extends React.Component {
  static propTypes = {
    sdk: PropTypes.object.isRequired,
  };

  state = {
    searchFunctionText: '',
    selectedFunctionItem: null,
    isLoadingSyntaxDocs: false,
    isLoadingFunctionDoc: false,
    functionDoc: null,
    functions: [],
    initialFunctionsByTypes: [],
    functionsByTypes: [],
  };

  async componentDidMount() {
    await this.fetchSyntaxDocs();
  }

  fetchSyntaxDocs = async () => {
    const { sdk } = this.props;

    this.displaySyntaxDocsLoader();

    const functionsByTypes = await sdk.getAllEditorFunctionsDoc();

    this.setState({
      initialFunctionsByTypes: functionsByTypes,
      functionsByTypes,
    });

    this.hideSyntaxDocsLoader();
  };

  selectFunctionItem = selectedFunctionItem => {
    this.setState({ selectedFunctionItem }, this.fetchFunctionsDocs);
  };

  fetchFunctionsDocs = async () => {
    const { sdk } = this.props;
    const { selectedFunctionItem } = this.state;

    this.displayFunctionDocLoader();

    if (selectedFunctionItem) {
      const { href } = selectedFunctionItem;
      const path = href.replace(/^\/docs\//, '');

      const functionDoc = await sdk.getEditorFunctionDoc({ path });

      this.setState({ functionDoc });
    }

    this.hideFunctionDocLoader();
  };

  displaySyntaxDocsLoader = () => {
    this.setState({ isLoadingSyntaxDocs: true });
  };

  hideSyntaxDocsLoader = () => {
    this.setState({ isLoadingSyntaxDocs: false });
  };

  displayFunctionDocLoader = () => {
    this.setState({ isLoadingFunctionDoc: true });
  };

  hideFunctionDocLoader = () => {
    this.setState({ isLoadingFunctionDoc: false });
  };

  filterFunctionByTypes = () => {
    const { searchFunctionText, initialFunctionsByTypes } = this.state;

    const functionsByTypes = initialFunctionsByTypes.map(functionsByType => {
      const { items } = functionsByType;

      const filteredItems = items.filter(({ name }) => {
        return name.toLowerCase().includes(searchFunctionText.toLowerCase());
      });

      return {
        ...functionsByType,
        items: filteredItems,
      };
    });

    this.setState({
      functionsByTypes,
    });
  };

  onChangeSearchFunction = searchFunctionText => {
    this.setState(
      {
        searchFunctionText,
      },
      this.filterFunctionByTypes,
    );
  };

  render() {
    const {
      searchFunctionText,
      functionDoc,
      functionsByTypes,
      isLoadingSyntaxDocs,
      isLoadingFunctionDoc,
      selectedFunctionItem,
    } = this.state;

    if (isLoadingSyntaxDocs) {
      return (
        <div className={b()}>
          <div className={b('columns')}>
            <div className={b('function-manual-loader')}>
              <Loader size="m" />
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className={b()}>
        <div className={b('columns')}>
          <div className={b('column-left')}>
            <div className={b('search-field')}>
              <TextInput
                cls={b('inp-function-finder')}
                theme="normal"
                size="s"
                view="default"
                tone="default"
                placeholder="Функция"
                text={searchFunctionText}
                onChange={this.onChangeSearchFunction}
                hasClear
              />
            </div>
            <AvailableFunctions
              displayTypeSections={!searchFunctionText}
              functionsByTypes={functionsByTypes}
              selectedFunctionItem={selectedFunctionItem}
              onClickFunctionItem={this.selectFunctionItem}
            />
          </div>
          <div className={b('column-right')}>
            <FunctionDoc isLoading={isLoadingFunctionDoc} functionDoc={functionDoc} />
          </div>
        </div>
      </div>
    );
  }
}

AvailableFunctions.propTypes = {
  displayTypeSections: PropTypes.bool.isRequired,
  functionsByTypes: PropTypes.array.isRequired,
  onClickFunctionItem: PropTypes.func.isRequired,
  selectedFunctionItem: PropTypes.object,
};
AvailableFunctions.defaultProps = {
  displayTypeSections: true,
  functionsByTypes: [],
};
FunctionDoc.propTypes = {
  isLoading: PropTypes.bool,
  functionDoc: PropTypes.object,
};

export default FunctionManual;
