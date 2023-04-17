import * as React from 'react';
import './KamatechButton.css';
import { KamatechButtonInterface } from './KamatechButton.interface';
import { ClassHelper } from '../../helpers';

export class KamatechButton extends React.Component<KamatechButtonInterface, any> {
  private baseClass = 'kamatech-button';

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
