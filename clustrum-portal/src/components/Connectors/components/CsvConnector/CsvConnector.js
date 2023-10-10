import React from 'react';
import PropTypes from 'prop-types';
import block from 'bem-cn-lite';
import moment from 'moment';
import Dropzone from 'react-dropzone';
import { Button, RadioButton } from 'lego-on-react';
import { Icon, YCSelect } from '@kamatech-data-ui/common/src';
import { PathSelect } from '@kamatech-data-ui/clustrum';
import DataTable from '@kamatech-data-ui/dt100/lib';
import ContainerLoader from '../../../../components/ContainerLoader/ContainerLoader';
import ArrowBack from '../../subcomponents/ArrowBack/ArrowBack';
import {
  CSV_TOAST_NAME,
  FIELD_TYPES,
  NOTIFICATION_TIMEOUT_DEFAULT,
} from '../../../../constants';
import Utils from '../../../../helpers/utils';
import iconCsv from '@kamatech-data-ui/clustrum/src/icons/csv.svg';
import { getErrorMessage } from '../../utils';
import { getSearchParam } from '../../../../helpers/QueryParams';
import { NotificationContext } from '@clustrum-lib';
import { NotificationType } from '@clustrum-lib/shared/lib/notification/types';

const b = block('csv-connector2');

export const VIEW_STEPS = {
  CSV_LOADING: 'csv-loading',
  CSV_SETTING: 'csv-setting',
  CSV_SETTING_AFTER_SAVE: 'csv-setting-after-save',
};
const MAX_FILE_SIZE_BYTE = 100 * 1000 * 1000;
const ALLOWED_EXTENSIONS = '.csv, .txt';
const DISABLE_CHANGE_PARAMETERS_FOR_STATUSES = ['saved', 'materializing', 'materialized'];
const ALLOW_UPDATE_ON_CHANGE_FIELD_LIST = ['delimiter', 'encoding', 'hasHeader'];

function FileDescription(props) {
  const { acceptedFile } = props;

  if (acceptedFile === null) {
    return null;
  }

  const { name, size } = acceptedFile;

  return (
    <div className={b('selected-file')}>
      <span>Выбранный файл:</span>
      &nbsp;
      <span className={b('name')}>{`"${name}",`}</span>
      &nbsp;
      <span>размер:</span>
      &nbsp;
      <span className={b('size')}>{`${size}`}</span>
      &nbsp;
      <span>байт</span>
    </div>
  );
}

function CsvDropZone(props) {
  const {
    getRootProps,
    getInputProps,
    isDragActive,
    acceptedFile = [],
    rejectReasons: { isOverMaxSize, isNotAllowedType } = {},
  } = props;

  return (
    <div className={b('dropzone')} {...getRootProps()}>
      <input {...getInputProps()} />
      {isDragActive && (
        <div className={b('dragzone')}>
          <span>Отпустите файл и начнется загрузка</span>
        </div>
      )}
      {!isDragActive && (
        <React.Fragment>
          <div className={b('file-selection')}>
            <div>
              <Button
                theme="pseudo"
                size="s"
                view="default"
                tone="default"
                text="Выбрать CSV-файл"
              />
              <span className={b('drop-here-hint')}>
                Вы можете загрузить файл размером до 100 Мб, перетащив его на экран
              </span>
            </div>
            <FileDescription acceptedFile={acceptedFile} />
          </div>
        </React.Fragment>
      )}
      {!isDragActive && isOverMaxSize && (
        <div className={b('text-error')}>
          Увы, этот файл превышает допустимый лимит размера CSV-файла в 100 Мб. Попробуйте
          загрузить другой файл
        </div>
      )}
      {!isDragActive && isNotAllowedType && (
        <div className={b('text-error')}>
          Данный тип данных не поддерживается для загрузки
        </div>
      )}
    </div>
  );
}

function CsvDropZoneWrapper(props) {
  const {
    acceptedFile,
    rejectReasons,
    onDropAccepted,
    onDropRejected,
    onClickDropZone,
    isFileUploading,
  } = props;

  if (isFileUploading) {
    return (
      <div className={b('csv-setting')}>
        <div className={b('loader')}>
          <ContainerLoader text="Загрузка файла" size="m" />
        </div>
      </div>
    );
  }

  return (
    <div className={b('csv-loading')}>
      <Dropzone
        multiple={false}
        accept={ALLOWED_EXTENSIONS}
        onDropAccepted={onDropAccepted}
        onDropRejected={onDropRejected}
        onClick={onClickDropZone}
        maxSize={MAX_FILE_SIZE_BYTE}
      >
        {({ getRootProps, getInputProps, isDragActive }) => {
          return (
            <CsvDropZone
              acceptedFile={acceptedFile}
              rejectReasons={rejectReasons}
              getRootProps={getRootProps}
              getInputProps={getInputProps}
              isDragActive={isDragActive}
            />
          );
        }}
      </Dropzone>
    </div>
  );
}

function CsvPreview(props) {
  const { isPreviewLoading, getTableData, preview } = props;

  if (preview === null) {
    return null;
  }

  if (isPreviewLoading) {
    return (
      <div className={b('preview-loader')}>
        <ContainerLoader text="Загрузка данных для предпросмотра" size="m" />
      </div>
    );
  }

  const { columns, rows, startIndex } = getTableData();

  return (
    <DataTable
      columns={columns}
      data={rows}
      settings={{
        stickyHead: 'fixed',
        syncHeadOnResize: true,
        highlightRows: true,
        stripedRows: true,
        displayIndices: false,
        emptyDataMessage: 'Данные для предпросмотра отсутствуют',
      }}
      rowClassName={() => b('table-row')}
      startIndex={startIndex}
      theme={'csv-preview'}
    />
  );
}

function CsvSettings(props) {
  const {
    sdk,
    isConnectionLoading,
    name,
    nameFixed,
    createdAt,
    delimiter,
    dirPath,
    encoding,
    emptyFields,
    hasHeader,
    preview,
    allowedEncodings = [],
    allowedDelimiters,
    isPreviewLoading,
    disabled,
    getTableData,
    changeValue,
  } = props;

  if (isConnectionLoading) {
    return (
      <div className={b('csv-setting')}>
        <div className={b('loader')}>
          <ContainerLoader text="Загрузка" size="m" />
        </div>
      </div>
    );
  }

  const search = window.location.search;
  const error = getErrorMessage(emptyFields, FIELD_TYPES.NAME);

  return (
    <div className={b('csv-setting')}>
      <div className={b('panel')}>
        {!disabled && <ArrowBack url={`/connections/new/csv${search}`} />}
        <Icon className={b('connector-ic')} data={iconCsv} width="32" />
        <span className={b('name')}>{nameFixed}</span>
        <span className={b('created-at')}>
          {moment(createdAt)
            .utc()
            .format('HH:mm DD.MM.YYYY')}
        </span>
      </div>
      <div className={b('setting-panel')}>
        {!disabled && (
          <div className={b('field')}>
            <PathSelect
              size={'s'}
              inputError={error}
              sdk={sdk}
              defaultPath={dirPath}
              withInput={true}
              onChoosePath={dirPath => changeValue({ dirPath })}
              inputValue={name}
              onChangeInput={name => changeValue({ name })}
              placeholder="Название подключения"
            />
          </div>
        )}
        <div className={b('field')}>
          <div className={b('caption')}>
            <span>Кодировка</span>
          </div>
          <YCSelect
            cls={b('csv-select')}
            value={encoding}
            items={allowedEncodings}
            onChange={encoding => changeValue({ encoding })}
            disabled={disabled}
            showSearch={false}
          />
        </div>
        <div className={b('field')}>
          <div className={b('caption')}>
            <span>Разделитель</span>
          </div>
          <YCSelect
            cls={b('csv-select')}
            value={delimiter}
            items={allowedDelimiters}
            onChange={delimiter => changeValue({ delimiter })}
            disabled={disabled}
            showSearch={false}
          />
        </div>
        <div className={b('field')}>
          <div className={b('caption')}>
            <span>Заголовок таблицы</span>
          </div>
          <RadioButton
            cls={b('csv-header-rb')}
            disabled={disabled}
            theme="normal"
            size="s"
            view="default"
            tone="default"
            value={hasHeader ? 1 : 2}
            onChange={e =>
              changeValue({
                hasHeader: Number(e.target.value) === 1,
              })
            }
          >
            <RadioButton.Radio value={1}>Есть</RadioButton.Radio>
            <RadioButton.Radio value={2}>Нет</RadioButton.Radio>
          </RadioButton>
        </div>
      </div>
      <div className={b('preview')}>
        <CsvPreview
          isPreviewLoading={isPreviewLoading}
          preview={preview}
          getTableData={getTableData}
        />
      </div>
    </div>
  );
}

class CsvConnector extends React.Component {
  static propTypes = {
    uploadCsv: PropTypes.func.isRequired,
    sdk: PropTypes.object.isRequired,
    viewStepId: PropTypes.string,
    connectionId: PropTypes.string,
    isFileUploading: PropTypes.bool,
    onChangeCallback: PropTypes.func,
    emptyFields: PropTypes.array,
  };

  static contextType = NotificationContext;

  static defaultProps = {
    viewStepId: VIEW_STEPS.CSV_LOADING,
  };

  static VIEW_STEPS = VIEW_STEPS;

  static getDerivedStateFromProps(props, state) {
    const { connectionId, viewStepId } = state;
    const { connectionId: connectionIdProps, viewStepId: viewStepIdProps } = props;

    if (connectionId && viewStepId === viewStepIdProps) {
      return null;
    } else {
      return {
        connectionId: connectionIdProps,
        viewStepId: viewStepIdProps,
      };
    }
  }

  initialRejectReasons = {
    isOverMaxSize: false,
    isNotAllowedType: false,
  };

  state = {
    connectionId: '',
    isConnectionLoading: false,
    isPreviewLoading: false,
    dbType: 'csv',
    name: '',
    dirPath: getSearchParam('currentPath') || Utils.getPersonalFolderPath(),
    nameFixed: '',
    createdAt: '',
    delimiter: '',
    encoding: '',
    hasHeader: false,
    preview: null,
    meta: null,
    columns: null,
    isAccessedOnAll: '',
    viewStepId: null,
    acceptedFile: null,
    disabled: false,
    error: null,
    rejectReasons: this.initialRejectReasons,
  };

  async componentDidMount() {
    await this.fetchConnection();
  }

  async componentDidUpdate(prevProps) {
    const { viewStepId: viewStepIdPrev } = prevProps;
    const { viewStepId } = this.props;

    if (viewStepId !== viewStepIdPrev) {
      await this.fetchConnection();
    }
  }

  getSelectItem = ({ items = [] }) => {
    return items.map(item => ({
      value: item,
      title: item,
      key: item,
    }));
  };

  fetchConnection = async () => {
    const { sdk } = this.props;
    const { connectionId, viewStepId } = this.state;

    if (
      connectionId &&
      [VIEW_STEPS.CSV_SETTING, VIEW_STEPS.CSV_SETTING_AFTER_SAVE].includes(viewStepId)
    ) {
      this.setState({
        isConnectionLoading: true,
        isPreviewLoading: true,
        error: null,
      });

      try {
        const [
          {
            data: {
              filename,
              dialect: { delimiter } = {},
              column_types: columns,
              encoding,
              has_header: hasHeader,
            } = {},
            meta: { title, sample_state: sampleState } = {},
            createdAt,
            isFavorite,
            scope,
            key,
          },
          {
            csv_params: {
              allowed_encodings: allowedEncodings,
              allowed_delimiters: allowedDelimiters,
            } = {},
          },
        ] = await Promise.all([
          sdk.getEntry({ entryId: connectionId }),
          sdk.bi.getOptions(),
        ]);

        const name = (title || filename).split('.')[0];

        const { preview, meta } = await sdk.bi.getPreview({
          connectionId,
          previewLines: '100',
          delimiter,
          encoding,
          hasHeader: hasHeader ? 1 : 0,
        });

        const disabled = DISABLE_CHANGE_PARAMETERS_FOR_STATUSES.includes(sampleState);

        this.setState(
          {
            isConnectionLoading: false,
            isPreviewLoading: false,
            name,
            nameFixed: name,
            createdAt,
            delimiter,
            encoding,
            hasHeader,
            meta,
            preview,
            columns,
            allowedEncodings: this.getSelectItem({ items: allowedEncodings }),
            allowedDelimiters: this.getSelectItem({ items: allowedDelimiters }),
            disabled,
            entry: {
              isFavorite,
              scope,
              key,
              entryId: connectionId,
            },
          },
          this.onChangeCallback,
        );
      } catch (error) {
        const openNotification = this.context;
        openNotification({
          key: CSV_TOAST_NAME,
          title: 'Ошибка: не удалось загрузить подлючение',
          type: NotificationType.Error,
          duration: NOTIFICATION_TIMEOUT_DEFAULT,
        });

        this.setState(
          {
            isConnectionLoading: false,
            isPreviewLoading: false,
            error,
          },
          this.onChangeCallback,
        );
      }
    } else {
      this.onChangeCallback();
    }
  };

  changeValue = data => {
    this.setState(
      {
        ...data,
      },
      () => {
        this.updatePreview(data);
        this.onChangeCallback();
      },
    );
  };

  attachFile = ({ acceptedFile }) => {
    const { uploadCsv } = this.props;

    this.setState(
      {
        acceptedFile,
      },
      () => {
        this.onChangeCallback(uploadCsv);
      },
    );
  };

  updatePreview = async data => {
    const needUpdatePreivew = Object.keys(data).some(field =>
      ALLOW_UPDATE_ON_CHANGE_FIELD_LIST.includes(field),
    );

    if (needUpdatePreivew) {
      this.setState({
        isPreviewLoading: true,
        error: null,
      });

      try {
        const { sdk } = this.props;
        const { connectionId, delimiter, encoding, hasHeader } = this.state;
        const { preview, meta } = await sdk.bi.getPreview({
          connectionId,
          previewLines: '100',
          delimiter,
          encoding,
          hasHeader: hasHeader ? 1 : 0,
        });

        this.setState(
          {
            isPreviewLoading: false,
            delimiter,
            encoding,
            hasHeader,
            meta,
            preview,
          },
          this.onChangeCallback,
        );
      } catch (error) {
        const openNotification = this.context;
        openNotification({
          key: CSV_TOAST_NAME,
          title: 'Ошибка: не удалось получить превью',
          type: NotificationType.Error,
          duration: NOTIFICATION_TIMEOUT_DEFAULT,
        });

        this.setState({
          isPreviewLoading: false,
          error,
        });
      }
    }
  };

  onChangeCallback = cb => {
    const { onChangeCallback } = this.props;

    if (onChangeCallback) {
      onChangeCallback(this.state, cb);
    }
  };

  onDropAccepted = acceptedFiles => {
    this.clearRejectReasons();

    this.attachFile({
      acceptedFile: acceptedFiles[0],
    });
  };

  setRejectReasons = (rejectReasons = {}) => {
    this.setState({
      acceptedFile: null,
      rejectReasons: {
        ...this.state.rejectReasons,
        ...rejectReasons,
      },
    });
  };

  clearRejectReasons = () => {
    this.setState({
      acceptedFile: null,
      rejectReasons: {
        ...this.initialRejectReasons,
      },
    });
  };

  onDropRejected = rejectedFiles => {
    this.clearRejectReasons();

    const [rejectedFile = {}] = rejectedFiles;
    const { size, name } = rejectedFile;
    const [extension] = /\.[^.]*$/.exec(name);

    if (size > MAX_FILE_SIZE_BYTE) {
      this.setRejectReasons({ isOverMaxSize: true });
    }
    if (!ALLOWED_EXTENSIONS.includes(extension)) {
      this.setRejectReasons({ isNotAllowedType: true });
    }
  };

  onClickDropZone = e => {
    e.preventDefault();
  };

  getColumns = ({ columnsRaw }) => {
    return columnsRaw.map(column => {
      return {
        ...column,
        customStyle: () => {
          return {
            padding: '0 10px',
          };
        },
      };
    });
  };

  getTableData = () => {
    try {
      const { preview: { Type = [], Data = [] } = {} } = this.state;

      const rows = Data.map((row, index) =>
        Object.assign(
          {
            positionIndex: index + 1,
          },
          row,
        ),
      );
      const columnsRaw = Type[1][1].reduce((columnsTable, column, index) => {
        const [name, type] = column;

        columnsTable.push({
          name: index,
          header: name,
          type,
        });

        return columnsTable;
      }, []);

      columnsRaw.unshift({
        name: 'positionIndex',
        header: '#',
      });

      const columns = this.getColumns({ columnsRaw });

      return {
        columns,
        rows,
        startIndex: 0,
      };
    } catch (error) {
      return {
        columns: [],
        rows: [],
        startIndex: 0,
      };
    }
  };

  render() {
    const { sdk, viewStepId, connectionId, emptyFields } = this.props;
    let renderStep;

    switch (viewStepId) {
      case VIEW_STEPS.CSV_SETTING_AFTER_SAVE:
      case VIEW_STEPS.CSV_SETTING: {
        const {
          isConnectionLoading,
          name,
          nameFixed,
          createdAt,
          delimiter,
          dirPath,
          encoding,
          hasHeader,
          preview,
          allowedEncodings,
          allowedDelimiters,
          isPreviewLoading,
          disabled,
        } = this.state;

        renderStep = (
          <CsvSettings
            sdk={sdk}
            isConnectionLoading={isConnectionLoading}
            connectionId={connectionId}
            name={name}
            nameFixed={nameFixed}
            createdAt={createdAt}
            delimiter={delimiter}
            dirPath={dirPath}
            encoding={encoding}
            emptyFields={emptyFields}
            hasHeader={hasHeader}
            allowedEncodings={allowedEncodings}
            allowedDelimiters={allowedDelimiters}
            isPreviewLoading={isPreviewLoading}
            disabled={disabled}
            preview={preview}
            getTableData={this.getTableData}
            changeValue={this.changeValue}
          />
        );
        break;
      }
      case VIEW_STEPS.CSV_LOADING:
      default: {
        const { isFileUploading } = this.props;
        const { acceptedFile, rejectReasons } = this.state;

        renderStep = (
          <CsvDropZoneWrapper
            acceptedFile={acceptedFile}
            onDropAccepted={this.onDropAccepted}
            onDropRejected={this.onDropRejected}
            onClickDropZone={this.onClickDropZone}
            rejectReasons={rejectReasons}
            isFileUploading={isFileUploading}
          />
        );
        break;
      }
    }

    return <div className={b()}>{renderStep}</div>;
  }
}

export default CsvConnector;
