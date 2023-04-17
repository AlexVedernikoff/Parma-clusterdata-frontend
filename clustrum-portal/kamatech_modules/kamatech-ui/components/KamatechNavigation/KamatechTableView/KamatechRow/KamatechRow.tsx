import * as React from 'react';
import '../KamatechTableView.css';

import { KamatechRowInterface } from './KamatechRow.interface';
import { ModeType } from '../../../../enums';
import { ClassHelper } from '../../../../helpers';

import { KamatechIcon } from '../../..';
import { KamatechRowModel } from './KamatechRow.model';

import moment from 'moment';

moment.locale('ru');

const blockName = 'kamatech-table-view';

export class KamatechRow extends React.Component<KamatechRowInterface> {
  constructor(props: KamatechRowInterface) {
    super(props);
    this.onClick = this.onClick.bind(this);
    this.onChangeFavorite = this.onChangeFavorite.bind(this);
    this.onEntryContextClick = this.onEntryContextClick.bind(this);
    this.onEntryParentClick = this.onEntryParentClick.bind(this);
  }

  onClick = (event: React.SyntheticEvent) => {
    this.props.onEntryClick(this.props.entry, event);
  };

  onChangeFavorite = (event: React.SyntheticEvent) => {
    event.preventDefault();
    event.stopPropagation();
    this.props.onChangeFavorite(this.props.entry);
  };

  private buttonRef: any;

  setButtonRef = (elem: any) => {
    this.buttonRef = elem;
  };

  onEntryContextClick = (event: React.SyntheticEvent) => {
    event.preventDefault();
    event.stopPropagation();
    this.props.onEntryContextClick({ entry: this.props.entry, buttonRef: this.buttonRef });
  };

  onEntryParentClick = (event: React.SyntheticEvent) => {
    event.stopPropagation();
    event.preventDefault();
    const model = new KamatechRowModel(this.props);
    const parentEntry = model.getParentFolderEntry(this.props.entry);
    this.props.onEntryParentClick ? this.props.onEntryParentClick(parentEntry, event) : '';
  };

  renderDetails() {
    const { entry, mode } = this.props;

    switch (mode as ModeType) {
      case ModeType.MINIMAL:
        return this.renderMinimalDetails(entry);
      case ModeType.FULL:
        return this.renderFullDetails(entry);
      default:
        return this.renderFullDetails(entry);
    }
  }

  renderMinimalDetails(entry: any) {
    return (
      <div className={`${blockName}__updatedAt`}>
        <span>{moment(entry.updatedAt).format('DD.MM.YY')}</span>
      </div>
    );
  }

  renderFullDetails(entry: any) {
    const { createdBy, updatedAt, isFavorite } = entry;

    const starClassName = ClassHelper.merge(
      `${blockName}__row-btn`,
      `${blockName}__btn-change-favorite`,
      isFavorite ? `${blockName}__btn-change-favorite_isFavorite` : '',
    );

    return (
      <React.Fragment>
        <div className={`${blockName}__createdBy`}>
          <span>{createdBy}</span>
        </div>
        <div className={`${blockName}__updatedAt`}>
          <span>{moment(updatedAt).format('DD MMMM YYYY')}</span>
        </div>
        <div className={`${blockName}__row-btns`}>
          <div className={starClassName} onClick={this.onChangeFavorite}>
            <KamatechIcon className={`${blockName}__icon-star-fill`} data={this.props.iconFavoriteFilled} />
            <KamatechIcon className={`${blockName}__icon-star-stroke`} data={this.props.iconFavoriteEmpty} />
          </div>

          <div className={`${blockName}__row-btn`} onClick={this.onEntryContextClick} ref={this.setButtonRef}>
            <KamatechIcon
              className={'kamatech-button-edit-entry__icon'}
              data={this.props.iconDots}
              width="24"
              height="24"
            />
          </div>
        </div>
      </React.Fragment>
    );
  }

  renderParentFolder(model: KamatechRowModel) {
    const parentEntry = model.getParentFolderEntry(this.props.entry);
    return (
      <div className={`${blockName}__parent-folder`} onClick={this.onEntryParentClick}>
        <KamatechIcon
          className={`${blockName}__folder-inline`}
          data={this.props.iconFolderInline}
          width="16"
          height="16"
        />
        <span className={`${blockName}__parent-folder-name`}>{parentEntry.name}</span>
      </div>
    );
  }

  render() {
    const model = new KamatechRowModel(this.props);
    const { entry, iconEntry, linkWrapper } = this.props;

    const node = (
      <div
        className={ClassHelper.merge(
          `${blockName}__row`,
          `${blockName}__row_mode_${this.props.mode}`,
          `${blockName}__row_${this.props.isActive ? 'active' : 'inactive'}`,
        )}
        onClick={this.onClick}
      >
        <KamatechIcon data={iconEntry} className={`${blockName}__icon`} width="24" height="24" />
        <div className={`${blockName}__info`}>
          <div className={`${blockName}__name`}>
            <div className={`${blockName}__name-line`}>
              <span>{entry.name}</span>
            </div>
            {this.props.displayParentFolder && this.renderParentFolder(model)}
          </div>
          {this.renderDetails()}
        </div>
      </div>
    );

    return linkWrapper
      ? linkWrapper({
          entry,
          className: `${blockName}__link`,
          children: node,
          onClick: this.onClick,
        })
      : node;
  }
}
