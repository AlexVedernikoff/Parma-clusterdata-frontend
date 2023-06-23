export default class FeatureColor {
  constructor(feature) {
    this._feature = feature;
  }

  featureColorKey() {
    if (this.hasColorName()) {
      return this.featureColorName();
    }

    return this.featureColor();
  }

  hasColorName() {
    return (
      ![undefined, null].includes(this.featureColorName()) &&
      typeof this.featureColorName() === 'string'
    );
  }

  featureColor() {
    if (this.hasNotCustomProperties()) {
      return;
    }

    return this._feature.properties.customProperties.color;
  }

  featureColorName() {
    if (this.hasNotCustomProperties()) {
      return null;
    }

    return this._feature.properties.customProperties.color_name;
  }

  hasNotCustomProperties() {
    return (
      [undefined, null].includes(this._feature) ||
      [undefined, null].includes(this._feature.properties) ||
      [undefined, null].includes(this._feature.properties.customProperties)
    );
  }
}
