import * as React from 'react';
import '../ParmaTableView.css';

import { ParmaRowInterface } from './ParmaRow.interface';
import { ModeType } from '../../../../enums';
import { ClassHelper } from '../../../../helpers';

import { ParmaIcon } from '../../..';
import { ParmaRowModel } from './ParmaRow.model';

import moment from 'moment';

moment.locale('ru');

const blockName = 'parma-table-view';

export class ParmaRow extends React.Component<ParmaRowInterface> {
  constructor(props: ParmaRowInterface) {
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
    const model = new ParmaRowModel(this.props);
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
            <ParmaIcon className={`${blockName}__icon-star-fill`} data={this.props.iconFavoriteFilled} />
            <ParmaIcon className={`${blockName}__icon-star-stroke`} data={this.props.iconFavoriteEmpty} />
          </div>

          <div className={`${blockName}__row-btn`} onClick={this.onEntryContextClick} ref={this.setButtonRef}>
            <ParmaIcon className={'parma-button-edit-entry__icon'} data={this.props.iconDots} width="24" height="24" />
          </div>
        </div>
      </React.Fragment>
    );
  }

  renderParentFolder(model: ParmaRowModel) {
    const parentEntry = model.getParentFolderEntry(this.props.entry);
    return (
      <div className={`${blockName}__parent-folder`} onClick={this.onEntryParentClick}>
        <ParmaIcon
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
    const model = new ParmaRowModel(this.props);
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
        <ParmaIcon data={iconEntry} className={`${blockName}__icon`} width="24" height="24" />
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