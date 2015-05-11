# koco-date-range-picker-binding-handler

Knockout Components binding handler for Dan Grossman's bootstrap-daterangepicker.

## Installation

```bash
bower install koco-order-by-updater-binding-handler
```

## Usage with KOCO

This is a shared module that is used in many other modules. The convention is to require the handler in the `knockout-binding-handlers.js` file like so:

```javascript
define([
  ...
  'bower_components/koco-date-range-picker-binding-handler/src/date-range-picker-binding-handler'
  ...
],
```

It also includes the `moment`, `koco-disposer` libraries and a modified version of `bootstrap-daterangepicker` as bower dependencies. You will need to configure an alias in the `require.configs.js` file for the dependency if you haven't already:

```javascript
paths: {
  ...
  'moment': 'bower_components/moment/moment',  
  'disposer': 'bower_components/koco-disposer/src/disposer',
  'daterangepicker': 'bower_components/koco-date-range-picker-binding-handler/modified_bower_components/bootstrap-daterangepicker/daterangepicker'
  ...
}
```

You'll also need to include in your `styles.less`:

```
// Core variables and mixins
...
@import (inline) "../bower_components/bootstrap-daterangepicker/daterangepicker-bs3.css";
...
// Components
@import "../components/koco-date-range-picker-binding-handler/src/date-range-picker.less";
```

Finally, make sure you load the `daterangepicker` library, by convention in `jquery-plugins.js`

```
define([
...
        'daterangepicker',
...
```