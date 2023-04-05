import * as React from 'react';
import './ParmaButton.css';
import { ParmaButtonInterface } from './ParmaButton.interface';
import { ClassHelper } from '../../helpers';

export class ParmaButton extends React.Component<ParmaButtonInterface, any> {
  private baseClass = 'parma-button';

  onClick() {
    if (this.props.onClick) {
      this.props.onClick();
    }
  }

  render() {
    const sizeClass = this.props.size ? `${this.baseClass}_size_${this.props.size}` : '';
    const viewClass = this.props.view ? `${this.baseClass}_view_${this.props.view}` : '';
    const toneClass = this.props.tone ? `${this.baseClass}_tone_${this.props.tone}` : '';
    const themeClass = this.props.theme ? `${this.baseClass}_theme_${this.props.theme}` : '';
    const className = ClassHelper.merge(this.baseClass, sizeClass, viewClass, toneClass, themeClass);
    return (
      <button className={className} onClick={this.onClick.bind(this)}>
        <span className={`${this.baseClass}-text`}>{this.props.children}</span>
      </button>
    );
  }
}
