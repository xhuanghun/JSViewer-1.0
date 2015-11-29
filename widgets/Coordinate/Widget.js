
define([
    'dojo/_base/declare',
    'dojo/_base/array',
    'dojo/_base/html',
    'dojo/sniff',
    'dijit/_WidgetsInTemplateMixin',
    "esri/geometry/Point",
    'esri/SpatialReference',
    'jimu/BaseWidget',
    'jimu/utils',
    'dojo/_base/lang',
    'dojo/on',
      "esri/geometry/webMercatorUtils"
  ],
  function(
    declare,
    array,
    html,
    has,
    _WidgetsInTemplateMixin,
    Point,
    SpatialReference,
    BaseWidget,
    utils,
    lang,
    on,
    webMercatorUtils
  ) {

    var clazz = declare([BaseWidget, _WidgetsInTemplateMixin], {

      baseClass: 'jimu-widget-coordinate',
      name: 'Coordinate',
      LAT:"lat",
      LON:"lon",

      startup: function() {
        this.inherited(arguments);

        //if (!(this.config.spatialReferences && this.config.spatialReferences.length)) {
        //  html.setStyle(this.foldableNode, 'display', 'none');
        //} else {
        //  html.setStyle(this.foldableNode, 'display', 'inline-block');
        //}
        this.onOpen();
      },

      onOpen: function() {
        this.own(on(this.map, "mouse-move", lang.hitch(this, this.onMouseMove)));
      },

      onMouseMove: function(evt) {
        var mapPoint = evt.mapPoint;
        if (this.map.spatialReference.wkid == 102113||this.map.spatialReference.wkid==102100)
        {
          mapPoint = webMercatorUtils.webMercatorToGeographic(mapPoint);
        }
        else if (this.map.spatialReference.wkid == 4326)
        {
        }

        this.coordinateLabel.innerHTML=this.geographicToDMS(mapPoint);

      },
      geographicToDMS:function (mapPoint){
        var x=this.format(mapPoint.x, this.LON);
        var y=this.format(mapPoint.y, this.LAT);
        return x + y;
      },
      format:function(decDeg, decDir){
        var d=Math.abs(decDeg);
        var deg=Math.floor(d);
        d=d - deg;
        var min=Math.floor(d * 60);
        var av=d - min / 60;
        var sec=Math.floor(av * 60 * 60);
        if (sec == 60)
        {
          min++;
          sec=0;
        }
        if (min == 60)
        {
          deg++;
          min=0;
        }
        var smin=min < 10 ? "0" + min + "'" : min + "'";
        var ssec=sec < 10 ? "0" + sec + "\"" : sec + "\"";
        var sdir=(decDir == this.LAT) ? (decDeg < 0 ? "南纬" : "北纬") : (decDeg < 0 ? "西经" : "东经");
        return sdir + ":" + deg + "°" + smin + ssec;
      }

    });

    return clazz;
  });