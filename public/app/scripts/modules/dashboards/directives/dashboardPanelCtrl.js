(function(){
  'use strict';
  angular.module('boardsApp')
  .controller('dashboardPanelCtrl',['Widgets', function(Widgets) {
    var controller = this;

    controller.gridsterOpts = {
      columns: 8, // the width of the grid, in columns
      pushing: true, // whether to push other items out of the way on move or resize
      floating: true, // whether to automatically float items up so they stack (you can temporarily disable if you are adding unsorted items with ng-repeat)
      swapping: true, // whether or not to have items switch places instead of push down if they are the same size
      width: 'auto', // width of the grid. "auto" will expand the grid to its parent container
      colWidth: 350, // can be an integer or 'auto'.  'auto' uses the pixel width of the element divided by 'columns'
      rowHeight: 225, // can be an integer or 'match'.  Match uses the colWidth, giving you square widgets.
      margins: [15, 15], // the pixel distance between each widget
      outerMargin: true,
      mobileModeEnabled: true, // whether or not to toggle mobile mode when screen width is less than mobileBreakPoint
      isMobile: true, // stacks the grid items if true
      mobileBreakPoint: 500, // if the screen is not wider that this, remove the grid layout and stack the items

      minColumns: 1, // the minimum columns the grid must have
      minRows: 1, // the minimum height of the grid, in rows
      maxRows: 100,
      defaultSizeX: 2, // the default width of a gridster item, if not specifed
      defaultSizeY: 1, // the default height of a gridster item, if not specified
      resizable: {
        enabled: false,
        handles: ['n', 'e', 's', 'w', 'ne', 'se', 'sw', 'nw'],
        start: function(event, $element, widget) {}, // optional callback fired when resize is started,
        resize: function(event, $element, widget) {}, // optional callback fired when item is resized,
        stop: function(event, $element, widget) {} // optional callback fired when item is finished resizing
      },
      draggable: {
        enabled: true, // whether dragging items is supported
        //handle: '.my-class', // optional selector for resize handle
        start: function (event, $element, widget) { }, // optional callback fired when drag is started,
        drag: function (event, $element, widget) { }, // optional callback fired when item is moved,
        stop: function (event, $element, widget) {
          Widgets.updatePositions();
          // en esta parte solo me muestra el actual cambiado, posiciones, pero tengo que cambiar otra cosa
        } // optional callback fired when item is finished dragging
      }
    };
  }]);
}());
