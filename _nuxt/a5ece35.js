(window.webpackJsonp=window.webpackJsonp||[]).push([[28],{282:function(e,t,n){"use strict";n.r(t);var o={name:"Dropdown",data:function(){return{open:!1}},methods:{toggle:function(){this.open=!this.open},close:function(){this.open=!1}}},r=n(23),component=Object(r.a)(o,(function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"relative inline-block text-left",on:{mouseenter:function(t){e.open=!0},mouseleave:function(t){e.open=!1},keydown:function(t){if(!t.type.indexOf("key")&&e._k(t.keyCode,"escape",void 0,t.key,void 0))return null;e.open=!1}}},[e._t("trigger",null,{toggle:e.toggle,open:e.open}),e._v(" "),n("transition",{attrs:{"enter-class":"transform scale-95 opacity-0","enter-active-class":"transition duration-100 ease-out","enter-to-class":"transform scale-100 opacity-100","leave-class":"transform scale-100 opacity-100","leave-active-class":"transition duration-75 ease-in","leave-to-class":"transform scale-95 opacity-0"}},[n("div",{directives:[{name:"show",rawName:"v-show",value:e.open,expression:"open"}],staticClass:"absolute top-0 right-0 z-50 w-auto origin-top-right rounded-md shadow-lg ring-1 ring-gray-200 dark:ring-gray-800"},[n("div",{staticClass:"bg-white rounded-md dark:bg-gray-800"},[e._t("default")],2)])])],2)}),[],!1,null,null,null);t.default=component.exports}}]);