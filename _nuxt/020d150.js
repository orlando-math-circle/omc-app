(window.webpackJsonp=window.webpackJsonp||[]).push([[30],{234:function(t,e,r){var content=r(253);"string"==typeof content&&(content=[[t.i,content,""]]),content.locals&&(t.exports=content.locals);(0,r(64).default)("0a123c87",content,!0,{sourceMap:!1})},252:function(t,e,r){"use strict";r(234)},253:function(t,e,r){(e=r(63)(!1)).push([t.i,".app-header{-webkit-backdrop-filter:blur(12px);backdrop-filter:blur(12px);background-color:hsla(0,0%,100%,.75)}.dark .app-header{background-color:rgba(17,24,39,.75)}",""]),t.exports=e},286:function(t,e,r){"use strict";r.r(e);var o=r(12),l={computed:{settings:function(){return this.$docus.settings},lastRelease:function(){return this.$docus.lastRelease},menu:{get:function(){return this.$menu.open},set:function(t){this.$menu.open=t}},logo:function(){if(this.settings.logo)return"object"===Object(o.a)(this.settings.logo)?this.settings.logo:{light:this.settings.logo,dark:this.settings.logo}}},methods:{scrollToTop:function(){window.innerWidth>=1280||window.scrollTo(0,0)}}},n=(r(252),r(23)),component=Object(n.a)(l,(function(){var t=this,e=t.$createElement,r=t._self._c||e;return r("div",{staticClass:"sticky top-0 z-40 flex flex-none w-full mx-auto lg:z-50 max-w-8xl app-header",on:{click:t.scrollToTop}},[r("div",{staticClass:"flex items-center flex-none pl-4 border-b border-gray-200 sm:pl-6 lg:ml-6 lg:pl-0 xl:ml-8 dark:border-gray-800",class:{"lg:border-b-0 lg:w-60 xl:w-72":"docs"===t.settings.layout,"lg:pr-6 xl:pr-8":"readme"===t.settings.layout}},[r("NuxtLink",{staticClass:"w-auto overflow-hidden",attrs:{to:t.localePath("/"),"aria-label":t.settings.title}},[t.logo?r("span",{staticClass:"sr-only"},[t._v(t._s(t.settings.title))]):t._e(),t._v(" "),t.logo?t._e():r("span",{staticClass:"text-2xl font-bold text-gray-900 dark:text-gray-100"},[t._v(t._s(t.settings.title))]),t._v(" "),t.logo?r("img",{staticClass:"w-auto h-8 light-img",attrs:{src:t.logo.light,alt:t.settings.title}}):t._e(),t._v(" "),t.logo?r("img",{staticClass:"w-auto h-8 dark-img",attrs:{src:t.logo.dark,alt:t.settings.title}}):t._e()])],1),t._v(" "),r("div",{staticClass:"flex items-center justify-between flex-auto px-4 space-x-6 border-b border-gray-200 dark:border-gray-800 h-18 sm:px-6 lg:mr-6 lg:px-0 xl:mr-8"},[t.settings.algolia?r("AlgoliaSearchBox",{attrs:{options:t.settings.algolia,settings:t.settings}}):t._e(),t._v(" "),r("div",{staticClass:"flex items-center space-x-4"},[t.lastRelease?r("NuxtLink",{staticClass:"hidden font-medium text-gray-400 transition-colors duration-200 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400 lg:block",attrs:{to:t.localePath("/releases"),"exact-active-class":"text-primary-500 dark:text-primary-400"}},[t._v(t._s(t.lastRelease.name))]):t._e(),t._v(" "),r("LangSwitcher"),t._v(" "),r("ColorSwitcher"),t._v(" "),t.settings.twitter?r("a",{staticClass:"text-gray-400 transition-colors duration-200 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400",attrs:{href:"https://twitter.com/"+t.settings.twitter,target:"_blank",rel:"noopener noreferrer",title:"Twitter",name:"Twitter"}},[r("IconTwitter",{staticClass:"w-5 h-5"})],1):t._e(),t._v(" "),t.settings.github.repo?r("a",{staticClass:"text-gray-400 transition-colors duration-200 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400",attrs:{href:t.$docus.repoUrl,target:"_blank",rel:"noopener noreferrer",title:"Github",name:"Github"}},[r("IconGithub",{staticClass:"w-5 h-5"})],1):t._e()],1)],1)])}),[],!1,null,null,null);e.default=component.exports}}]);