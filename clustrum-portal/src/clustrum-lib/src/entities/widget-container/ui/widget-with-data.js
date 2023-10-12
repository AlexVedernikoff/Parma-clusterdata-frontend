import React from 'react';
import PropTypes from 'prop-types';
import { WidgetType } from '@lib-shared/ui/widgets-factory/types';
import { WidgetFactory } from '@lib-shared/ui/widgets-factory';
import { $dashboardWidgets } from '../model/dashboard-widget';
// eslint-disable-next-line no-restricted-imports
import { $appSettingsStore } from '@shared/app-settings';
import ChartsModule from '@kamatech-data-ui/chartkit/lib/modules/charts/charts';
import ErrorDispatcher from '@kamatech-data-ui/chartkit/lib/modules/error-dispatcher/error-dispatcher';
import { getParamsValue } from '@lib-shared/lib/utils';
import { isPropsTheSame } from '../lib/is-props-the-same';
// TODO: Перечисление WIZARD_NODE_TYPE фактически дублирует перечисление WidgetType
// Нужно рассмотреть возможность использования только второго
import { WIZARD_NODE_TYPE } from '../../../../../constants/constants';

export class WidgetWithData extends React.PureComponent {
  static propTypes = {
    id: PropTypes.string,
    source: PropTypes.string,
    params: PropTypes.object,
    editMode: PropTypes.object,
    forceUpdate: PropTypes.bool,
    requestId: PropTypes.string,
    requestCancelToken: PropTypes.object,
    onError: PropTypes.func.isRequired,
    onLoad: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    onPageControlClick: PropTypes.func,
    onStateAndParamsChange: PropTypes.func,
    paginateInfo: PropTypes.object,
    orderBy: PropTypes.object,
    onOrderByClickInWizard: PropTypes.func,
    widgetType: PropTypes.string,
    ownWidgetParams: PropTypes.instanceOf(Map),
    refWidget: PropTypes.object,
  };

  _isMounted = null;

  state = {
    loadedData: null,
  };

  /* eslint-disable @typescript-eslint/explicit-function-return-type */
  componentDidMount() {
    this._isMounted = true;
    this.setLoadedData();
  }

  /* eslint-disable @typescript-eslint/explicit-function-return-type */
  componentDidUpdate(prevProps) {
    /**
     * todo в родительском компоненте уже происходит проверка на обновление
     * это сделано потому что размазали логику по нескольким компонентам (Charts и Charkit) - хорошо бы структурировать
     */
    // === из-за того, что componentDidUpdate происходит на this.setState
    if (isPropsTheSame(prevProps, this.props)) {
      return;
    }

    this.setLoadedData();
  }

  /* eslint-disable @typescript-eslint/explicit-function-return-type */
  componentDidCatch(error) {
    this.onError({ error });
  }

  /* eslint-disable @typescript-eslint/explicit-function-return-type */
  componentWillUnmount() {
    this._isMounted = false;
  }

  /**
   * todo: onLoad вызывается дочерними виджетами (графики, таблицы, карты) после того как они монтируются/обновляются
   * нужно вызывать onLoad после того как закончится выполняться запрос (метод run)
   * + подумать как убрать из Charkit логику с loading (по идее зона ответственности загрузки это Charts). Учесть чтобы не сломались контролы
   */
  /* eslint-disable react/destructuring-assignment */
  /* eslint-disable @typescript-eslint/explicit-function-return-type */
  onLoad = () => this.props.onLoad({ loadedData: this.state.loadedData });

  onError = data => {
    if (ErrorDispatcher.isCustomError(data.error)) {
      // || для случая, когда, например, NO_DATA
      // || undefined для случая UNSUPPORTED_EXTENSION, чтобы не падали isVisible в Items Menu
      this.props.onError({
        ...data,
        loadedData: data.error.extra || this.state.loadedData || undefined,
      });
    } else {
      this.props.onError({ ...data });
    }
  };

  async setLoadedData() {
    try {
      const {
        id,
        source,
        params,
        editMode,
        requestId,
        requestCancelToken,
        paginateInfo,
        widgetType,
        orderBy,
      } = this.props;
      if (editMode?.type === WIZARD_NODE_TYPE.MAP || widgetType === 'map') {
        // ? Вынести в функцию?
        const mapLoadedData = {
          widgetType: 'map',
          params: params,
          data: {
            shared: editMode?.config?.shared ?? {},
            geoJson: {
              coordType: editMode?.config.shared.coordType,
              titleLayerSource: editMode?.config.shared.titleLayerSource,
              widgetType: editMode?.config.shared.visualization.id,
            },
          },
        };
        this.setState({ loadedData: mapLoadedData });
        return;
      }

      if (this.props.editMode?.type === WIZARD_NODE_TYPE.TABLE) {
        editMode.config.shared.paginateInfo = paginateInfo;
      }

      const loadedData = await ChartsModule.getData({
        id,
        source,
        params: getParamsValue(params),
        editMode,
        paginateInfo,
        headers: { 'X-Request-ID': requestId },
        cancelToken: requestCancelToken,
        orderBy,
      }).then(loaded => {
        const dashboardWidget = {
          id,
          path: source,
          params: getParamsValue(params),
          config: null,
          responseOptions: {
            includeConfig: true,
          },
          pageSize: paginateInfo?.pageSize ?? null,
          page: paginateInfo?.page ?? null,
          enableCaching: $appSettingsStore.getState().enableCaching
            ? $appSettingsStore.getState().enableCaching
            : false,
          cacheMode: $appSettingsStore.getState().cacheMode
            ? $appSettingsStore.getState().cacheMode
            : null,
          orderBy: orderBy?.direction
            ? [
                {
                  direction: orderBy.direction,
                  field: orderBy.field,
                },
              ]
            : null,
        };

        if (
          loaded.widgetType === WidgetType.Table ||
          loaded.widgetType === WidgetType.PivotTable
        ) {
          const dashboardWidgets = $dashboardWidgets.getState();
          dashboardWidgets.push(dashboardWidget);

          $dashboardWidgets.setState(dashboardWidgets);
        }
      });

      const dashboardWidget = {
        id,
        path: source,
        params: getParamsValue(params),
        config: null,
        responseOptions: {
          includeConfig: true,
        },
        pageSize: paginateInfo?.pageSize ?? null,
        page: paginateInfo?.page ?? null,
        enableCaching: $appSettingsStore.getState().enableCaching
          ? $appSettingsStore.getState().enableCaching
          : false,
        cacheMode: $appSettingsStore.getState().cacheMode
          ? $appSettingsStore.getState().cacheMode
          : null,
        orderBy: orderBy?.direction
          ? [
              {
                direction: orderBy.direction,
                field: orderBy.field,
              },
            ]
          : null,
      };

      if (
        loadedData?.widgetType === WidgetType.Table ||
        loadedData?.widgetType === WidgetType.PivotTable
      ) {
        const dashboardWidgets = $dashboardWidgets.getState();
        dashboardWidgets.push(dashboardWidget);

        $dashboardWidgets.setState(dashboardWidgets);
      }

      if (this._isMounted) {
        this.setState({ loadedData });
      }
    } catch (error) {
      this.onError({ error });
    }
  }

  render() {
    const { loadedData } = this.state;
    if (!loadedData) {
      return null;
    }

    const {
      editMode,
      onStateAndParamsChange,
      onPageControlClick,
      paginateInfo,
      id,
      onChange,
      requestCancelToken,
      ownWidgetParams,
      orderBy,
      onOrderByClickInWizard,
      refWidget,
    } = this.props;

    return editMode?.type === WIZARD_NODE_TYPE.MAP ? (
      <WidgetFactory
        data={loadedData}
        onStateAndParamsChange={onStateAndParamsChange}
        chartEditMode={editMode}
        requestCancelToken={requestCancelToken}
        entryId={id}
        onLoad={this.onLoad}
        onError={this.onError}
        onChange={onChange}
        ownWidgetParams={ownWidgetParams}
        orderBy={orderBy}
        onOrderByClickInWizard={onOrderByClickInWizard}
        refWidget={refWidget}
      />
    ) : (
      <WidgetFactory
        data={loadedData}
        onStateAndParamsChange={onStateAndParamsChange}
        onLoad={this.onLoad}
        onError={this.onError}
        onChange={onChange}
        onPageControlClick={onPageControlClick}
        paginateInfo={paginateInfo}
        ownWidgetParams={ownWidgetParams}
        orderBy={orderBy}
        onOrderByClickInWizard={onOrderByClickInWizard}
        refWidget={refWidget}
      />
    );
  }
}
