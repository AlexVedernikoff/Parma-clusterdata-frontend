import { Component, NgModule } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AngularReactBrowserModule } from '@angular-react/core';
import ChartsModule from '../parma_modules/@parma-data-ui/chartkit/lib/modules/charts/charts';
import Widget from '@parma-data-ui/chartkit/lib/components/Widget/Widget';

import React from 'react';
import ReactDOM from 'react-dom';

@Component({
  selector: 'hellow-app',
  template: '<div id="root"></div>',
})
export class HelloComponent {
  constructor() {
    this.data = {};
    this.onLoad = () => {};
    this.onChange = () => {};
    this.onError = () => {};
  }

  async load() {
    this.data = await ChartsModule.getData({
      id: 'a41e5303-a4d2-42e8-a719-4652f80c1131',
      params: {},
      source: '/',
    });
  }

  async getProps() {
    await this.load();

    const { data, onLoad, onChange, onError } = this;

    return {
      data,
      onLoad,
      onChange,
      onError,
    };
  }

  async render() {
    let props = await this.getProps();
    ReactDOM.render(React.createElement(Widget, props), document.getElementById('root'));
  }

  ngAfterViewInit() {
    this.render();
  }
}

@NgModule({
  imports: [AngularReactBrowserModule], // import Angular's BrowserModule
  bootstrap: [HelloComponent], // indicate the bootstrap component
  declarations: [HelloComponent], // register our component with the module
})
export class AppModule {}

platformBrowserDynamic().bootstrapModule(AppModule); // bootstrap with our module
