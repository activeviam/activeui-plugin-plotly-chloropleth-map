(this["webpackJsonpactiveui-plugin-plotly-chloropleth-map"]=this["webpackJsonpactiveui-plugin-plotly-chloropleth-map"]||[]).push([[16],{1511:function(e,t,a){"use strict";a.r(t);var r=a(0),o=a.n(r),i=a(20),n=a(3),s=a.n(n),l=a(902),c=a.n(l),u=a(913),p=a.n(u),d=a(8),m=a(208),b=a(73);c.a.register(p.a);var h=Object(i.D)(Object(i.C)(Object(r.memo)((function(e){var t=e.cube,a=e.data,n=e.metaData,l=e.widgetState,c=e.onLoaded,u=Object(r.useMemo)((function(){return Object(d.v)(null===l||void 0===l?void 0:l.mapping)}),[null===l||void 0===l?void 0:l.mapping]);Object(i.A)({isEmpty:u,onLoaded:c});var p=Object(r.useMemo)((function(){return function(e){var t=e.cube,a=e.data,r=e.metaData,o=e.widgetState;return t&&a&&r?Object(m.a)({cube:t,data:a,metaData:r,widgetState:o}):[]}({cube:t,data:a,metaData:n,widgetState:l})}),[t,a,n,l]),h=Object(r.useMemo)((function(){return function(e){return e?Object(b.b)({xaxis:{gridcolor:"transparent"}},Object(i.l)(e.subplots),Object(i.k)(e.subplots)):{}}(n)}),[n]);return t&&a&&n&&!u?o.a.createElement(i.d,s()({},e,{traces:p,layout:h,cube:t,data:a,metaData:n})):o.a.createElement(i.a,null)}))));t.default=h},882:function(e,t,a){"use strict";e.exports={barmode:{valType:"enumerated",values:["stack","group","overlay","relative"],dflt:"group",role:"info",editType:"calc",description:["Determines how bars at the same location coordinate","are displayed on the graph.","With *stack*, the bars are stacked on top of one another","With *relative*, the bars are stacked on top of one another,","with negative values below the axis, positive values above","With *group*, the bars are plotted next to one another","centered around the shared location.","With *overlay*, the bars are plotted over one another,","you might need to an *opacity* to see multiple bars."].join(" ")},barnorm:{valType:"enumerated",values:["","fraction","percent"],dflt:"",role:"info",editType:"calc",description:["Sets the normalization for bar traces on the graph.","With *fraction*, the value of each bar is divided by the sum of all","values at that location coordinate.","*percent* is the same but multiplied by 100 to show percentages."].join(" ")},bargap:{valType:"number",min:0,max:1,role:"style",editType:"calc",description:["Sets the gap (in plot fraction) between bars of","adjacent location coordinates."].join(" ")},bargroupgap:{valType:"number",min:0,max:1,dflt:0,role:"style",editType:"calc",description:["Sets the gap (in plot fraction) between bars of","the same location coordinate."].join(" ")}}},883:function(e,t,a){"use strict";var r=a(846);e.exports=function(e,t){for(var a=0;a<e.length;a++)e[a].i=a;r.mergeArray(t.text,e,"tx"),r.mergeArray(t.hovertext,e,"htx");var o=t.marker;if(o){r.mergeArray(o.opacity,e,"mo",!0),r.mergeArray(o.color,e,"mc");var i=o.line;i&&(r.mergeArray(i.color,e,"mlc"),r.mergeArrayCastPositive(i.width,e,"mlw"))}}},913:function(e,t,a){"use strict";e.exports=a(914)},914:function(e,t,a){"use strict";e.exports={attributes:a(903),layoutAttributes:a(882),supplyDefaults:a(881).supplyDefaults,crossTraceDefaults:a(881).crossTraceDefaults,supplyLayoutDefaults:a(915),calc:a(916),crossTraceCalc:a(958).crossTraceCalc,colorbar:a(941),arraysToCalcdata:a(883),plot:a(949).plot,style:a(891).style,styleOnSelect:a(891).styleOnSelect,hoverPoints:a(959).hoverPoints,eventData:a(918),selectPoints:a(960),moduleType:"trace",name:"bar",basePlotModule:a(931),categories:["bar-like","cartesian","svg","bar","oriented","errorBarsOK","showLegend","zoomScale"],animatable:!0,meta:{description:["The data visualized by the span of the bars is set in `y`","if `orientation` is set th *v* (the default)","and the labels are set in `x`.","By setting `orientation` to *h*, the roles are interchanged."].join(" ")}}},915:function(e,t,a){"use strict";var r=a(851),o=a(864),i=a(846),n=a(882);e.exports=function(e,t,a){function s(a,r){return i.coerce(e,t,n,a,r)}for(var l=!1,c=!1,u=!1,p={},d=s("barmode"),m=0;m<a.length;m++){var b=a[m];if(r.traceIs(b,"bar")&&b.visible){if(l=!0,"group"===d){var h=b.xaxis+b.yaxis;p[h]&&(u=!0),p[h]=!0}if(b.visible&&"histogram"===b.type)"category"!==o.getFromId({_fullLayout:t},b["v"===b.orientation?"xaxis":"yaxis"]).type&&(c=!0)}}l?("overlay"!==d&&s("barnorm"),s("bargap",c&&!u?0:.2),s("bargroupgap")):delete t.barmode}},916:function(e,t,a){"use strict";var r=a(864),o=a(947),i=a(884).hasColorscale,n=a(945),s=a(883),l=a(940);e.exports=function(e,t){var a,c,u,p,d=r.getFromId(e,t.xaxis||"x"),m=r.getFromId(e,t.yaxis||"y"),b={msUTC:!(!t.base&&0!==t.base)};"h"===t.orientation?(a=d.makeCalcdata(t,"x",b),u=m.makeCalcdata(t,"y"),c=o(t,m,"y",u),p=!!t.yperiodalignment):(a=m.makeCalcdata(t,"y",b),u=d.makeCalcdata(t,"x"),c=o(t,d,"x",u),p=!!t.xperiodalignment);for(var h=Math.min(c.length,a.length),y=new Array(h),v=0;v<h;v++)y[v]={p:c[v],s:a[v]},p&&(y[v].orig_p=u[v]),t.ids&&(y[v].id=String(t.ids[v]));return i(t,"marker")&&n(e,t,{vals:t.marker.color,containerStr:"marker",cLetter:"c"}),i(t,"marker.line")&&n(e,t,{vals:t.marker.line.color,containerStr:"marker.line",cLetter:"c"}),s(y,t),l(y,t),y}},918:function(e,t,a){"use strict";e.exports=function(e,t,a){return e.x="xVal"in t?t.xVal:t.x,e.y="yVal"in t?t.yVal:t.y,t.xa&&(e.xaxis=t.xa),t.ya&&(e.yaxis=t.ya),"h"===a.orientation?(e.label=e.y,e.value=e.x):(e.label=e.x,e.value=e.y),e}}}]);