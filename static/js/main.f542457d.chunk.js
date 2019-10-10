(window["webpackJsonpsubstrate-front-end-template"]=window["webpackJsonpsubstrate-front-end-template"]||[]).push([[0],{1102:function(e){e.exports=JSON.parse('{"PROVIDER_SOCKET":"wss://dev-node.substrate.dev:9944"}')},1260:function(e,t,n){"use strict";n.r(t);var a=n(0),r=n.n(a),c=n(140),l=n.n(c),o=n(28),u=n(1282),i=n(1271),s=n(1272),p=n(1269),f=n(1283),m=(n(610),n(53)),b=n(43),O=n.n(b),d=n(96),E=n(354),y=n(203),v=n(355),j=n.n(v);function g(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}var h=function(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?g(n,!0).forEach((function(t){Object(m.a)(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):g(n).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}({},n(569),{},n(1102),{},["REACT_APP_PROVIDER_SOCKET","REACT_APP_DEVELOPMENT_KEYRING"].reduce((function(e,t){return void 0!==Object({NODE_ENV:"production",PUBLIC_URL:"/substrate-front-end-template"})[t]&&(e[t.slice(10)]=Object({NODE_ENV:"production",PUBLIC_URL:"/substrate-front-end-template"})[t]),e}),{}));function w(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function S(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?w(n,!0).forEach((function(t){Object(m.a)(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):w(n).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}var P={socket:h.PROVIDER_SOCKET,types:h.CUSTOM_TYPES,keyring:null,keyringState:null,api:null,apiState:null},C=function(e,t){switch(t.type){case"RESET_SOCKET":return S({},e,{socket:t.payload||e.socket,api:null,apiState:null});case"CONNECT":return S({},e,{api:t.payload,apiState:"CONNECTING"});case"CONNECT_SUCCESS":return S({},e,{apiState:"READY"});case"CONNECT_ERROR":return S({},e,{apiState:"ERROR"});case"SET_KEYRING":return S({},e,{keyring:t.payload,keyringState:"READY"});case"KEYRING_ERROR":return S({},e,{keyring:null,keyringState:"ERROR"});default:throw new Error("Unknown type: ".concat(t.type))}},R=r.a.createContext(),x=function(e){var t=S({},P);["socket","types"].forEach((function(n){t[n]="undefined"===typeof e[n]?t[n]:e[n]}));var n=Object(a.useReducer)(C,t),c=Object(o.a)(n,2),l=c[0],u=c[1];return r.a.createElement(R.Provider,{value:[l,u]},e.children)};function k(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function N(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?k(n,!0).forEach((function(t){Object(m.a)(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):k(n).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}var D=function(){var e=Object(a.useContext)(R),t=Object(o.a)(e,2),n=t[0],r=t[1],c=n.api,l=n.socket,u=n.types,i=Object(a.useCallback)(Object(d.a)(O.a.mark((function e(){var t,n;return O.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(!c){e.next=2;break}return e.abrupt("return");case 2:return t=new E.WsProvider(l),e.prev=3,e.next=6,E.ApiPromise.create({provider:t,types:u});case 6:return n=e.sent,r({type:"CONNECT",payload:n}),e.next=10,n.isReady;case 10:r({type:"CONNECT_SUCCESS"}),e.next=17;break;case 13:e.prev=13,e.t0=e.catch(3),console.error(e.t0),r({type:"CONNECT_ERROR"});case 17:case"end":return e.stop()}}),e,null,[[3,13]])}))),[c,l,u,r]),s=n.keyringState,p=Object(a.useCallback)(Object(d.a)(O.a.mark((function e(){var t;return O.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(!s){e.next=2;break}return e.abrupt("return");case 2:return e.prev=2,e.next=5,Object(y.web3Enable)(h.APP_NAME);case 5:return e.next=7,Object(y.web3Accounts)();case 7:t=(t=e.sent).map((function(e){var t=e.address,n=e.meta;return{address:t,meta:N({},n,{name:"".concat(n.name," (").concat(n.source,")")})}})),j.a.loadAll({isDevelopment:h.DEVELOPMENT_KEYRING},t),r({type:"SET_KEYRING",payload:j.a}),e.next=17;break;case 13:e.prev=13,e.t0=e.catch(2),console.error(e.t0),r({type:"KEYRING_ERROR"});case 17:case"end":return e.stop()}}),e,null,[[2,13]])}))),[s,r]);return Object(a.useEffect)((function(){i()}),[i]),Object(a.useEffect)((function(){p()}),[p]),N({},n,{dispatch:r})},A=n(570),T=n.n(A),_=n(571);function F(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function I(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?F(n,!0).forEach((function(t){Object(m.a)(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):F(n).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}var M=n.n(_)()(T.a),q={prettyBalance:function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};if("number"!==typeof e&&"string"!==typeof e)throw new Error("".concat(e," is not a number"));t=I({power:8,decimal:2,unit:"Units"},t);var n=M(e),a=M(10).pow(t.power),r=n.div(a).toFormat(t.decimal);return"".concat(r.toString()," ").concat(t.unit)}};function B(e){var t=D().api;return window.api=t,window.util=n(8),window.util_crypto=n(42),window.keyring=n(212),null}var U=n(177),Y=n(1261);function K(e){var t=e.accountPair,n=void 0===t?null:t,a=e.label,c=e.setStatus,l=e.style,o=void 0===l?null:l,u=e.type,i=void 0===u?null:u,s=e.attrs,p=void 0===s?null:s,f=e.disabled,m=void 0!==f&&f,b=D().api,E=p.params,v=void 0===E?null:E,j=p.sudo,g=void 0!==j&&j,h=p.tx,w=void 0===h?null:h,S=function(){return"QUERY"===i},P=function(){var e=Object(d.a)(O.a.mark((function e(){var t,a,r,l,o,u;return O.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(t=n.address,a=n.meta,r=a.source,!a.isInjected){e.next=9;break}return e.next=4,Object(y.web3FromSource)(r);case 4:o=e.sent,l=t,b.setSigner(o.signer),e.next=10;break;case 9:l=n;case 10:c("Sending...");try{u=v?g?w.sudo.apply(w,Object(U.a)(v)):w.apply(void 0,Object(U.a)(v)):g?w.sudo():w()}catch(i){console.error("ERROR forming transaction:",i),c(i.toString())}u&&u.signAndSend(l,(function(e){var t=e.status;t.isFinalized?c("Completed at block hash #".concat(t.asFinalized.toString())):c("Current transaction status: ".concat(t.type))})).catch((function(e){c(":( transaction failed"),console.error("ERROR transaction:",e)}));case 13:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}(),C=function(){var e=Object(d.a)(O.a.mark((function e(){var t;return O.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,w.apply(void 0,Object(U.a)(v));case 3:t=e.sent,c(t.toString()),e.next=11;break;case 7:e.prev=7,e.t0=e.catch(0),console.error("ERROR query:",e.t0),c(e.t0.toString());case 11:case"end":return e.stop()}}),e,null,[[0,7]])})));return function(){return e.apply(this,arguments)}}();return r.a.createElement(Y.a,{primary:!0,style:o,type:"submit",onClick:S()?C:P,disabled:m||!w||!S()&&!n},a)}var V=n(1280),z=n(593),L=n(144),G=n(1277),W=n(206);function J(e){var t=D(),n=t.api,c=t.keyring,l=e.setAccountAddress,u=Object(a.useState)(""),i=Object(o.a)(u,2),s=i[0],f=i[1],m=c.getPairs().map((function(e){return{key:e.address,value:e.address,text:e.meta.name.toUpperCase(),icon:"user"}})),b=m.length>0?m[0].value:"";Object(a.useEffect)((function(){f(b),l(b)}),[l,b]);return r.a.createElement(V.a,{attached:"top",tabular:!0,style:{backgroundColor:"#fff",borderColor:"#fff",paddingTop:"1em",paddingBottom:"1em"}},r.a.createElement(p.a,null,r.a.createElement(V.a.Menu,null,r.a.createElement(z.a,{src:"Substrate-Logo.png",size:"mini"})),r.a.createElement(V.a.Menu,{position:"right"},r.a.createElement(L.a,{name:"users",size:"large",circular:!0,color:s?"green":"red"}),r.a.createElement(G.a,{search:!0,selection:!0,clearable:!0,placeholder:"Select an account",options:m,onChange:function(e,t){var n;n=t.value,l(n),f(n)},value:s}),n.query.balances&&n.query.balances.freeBalance?r.a.createElement(H,{accountSelected:s}):null)))}function H(e){var t=e.accountSelected,n=D().api,c=Object(a.useState)(0),l=Object(o.a)(c,2),u=l[0],i=l[1];return Object(a.useEffect)((function(){var e;return t&&n.query.balances.freeBalance(t,(function(e){i(e.toString())})).then((function(t){e=t})).catch(console.error),function(){return e&&e()}}),[t,n.query.balances]),t?r.a.createElement(W.a,{pointing:"left"},r.a.createElement(L.a,{name:"money bill alternate",color:u>0?"green":"red"}),q.prettyBalance(u,{power:11,unit:"KUnits"})):null}var Q=n(1278);function X(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function Z(e){var t=D(),n=t.api,c=t.keyring,l=c.getPairs(),u=Object(a.useState)({}),i=Object(o.a)(u,2),s=i[0],p=i[1];return Object(a.useEffect)((function(){var e=c.getPairs().map((function(e){return e.address})),t=null;return n.query.balances.freeBalance.multi(e,(function(t){var n=e.reduce((function(e,n,a){return function(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?X(n,!0).forEach((function(t){Object(m.a)(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):X(n).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}({},e,Object(m.a)({},n,t[a].toString()))}),{});p(n)})).then((function(e){t=e})).catch(console.error),function(){return t&&t()}}),[n.query.balances.freeBalance,p,c]),r.a.createElement(f.a.Column,null,r.a.createElement("h1",null,"Balances"),r.a.createElement(Q.a,{celled:!0,striped:!0,size:"small"},r.a.createElement(Q.a.Body,null,l.map((function(e){return r.a.createElement(Q.a.Row,{key:e.address},r.a.createElement(Q.a.Cell,{textAlign:"right"},e.meta.name),r.a.createElement(Q.a.Cell,null,e.address),r.a.createElement(Q.a.Cell,null,s&&s[e.address]&&q.prettyBalance(s[e.address],{power:11,unit:"KUnits"})))})))))}function $(e){var t=D().api;return t.query.balances&&t.query.balances.freeBalance?r.a.createElement(Z,e):null}var ee=n(1279),te=n(1281);function ne(e){var t=D().api,n=e.finalized,c=Object(a.useState)(0),l=Object(o.a)(c,2),u=l[0],i=l[1],s=Object(a.useState)(0),p=Object(o.a)(s,2),m=p[0],b=p[1],O=n?t.derive.chain.bestNumberFinalized:t.derive.chain.bestNumber;Object(a.useEffect)((function(){var e=null;return O((function(e){i(e.toNumber()),b(0)})).then((function(t){e=t})).catch(console.error),function(){return e&&e()}}),[O]);var d=function(){b((function(e){return e+1}))};return Object(a.useEffect)((function(){var e=setInterval(d,1e3);return function(){return clearInterval(e)}}),[]),r.a.createElement(f.a.Column,null,r.a.createElement(ee.a,null,r.a.createElement(ee.a.Content,{textAlign:"center"},r.a.createElement(te.a,{label:(n?"Finalized":"Current")+" Block Number",value:u})),r.a.createElement(ee.a.Content,{extra:!0},r.a.createElement(L.a,{name:"time"})," ",m)))}var ae=n(1273),re=n(1270);function ce(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function le(e){var t=D().api,n=Object(a.useState)([]),c=Object(o.a)(n,2),l=c[0],u=c[1],i=Object(a.useState)(null),s=Object(o.a)(i,2),p=s[0],b=s[1],O=Object(a.useState)([]),d=Object(o.a)(O,2),E=d[0],y=d[1],v=Object(a.useState)({module:"",storageItem:"",input:""}),j=Object(o.a)(v,2),g=j[0],h=j[1],w=g.module,S=g.storageItem,P=g.input;Object(a.useEffect)((function(){var e=Object.keys(t.query).sort().map((function(e){return{key:e,value:e,text:e}}));u(e)}),[t]),Object(a.useEffect)((function(){if(""!==w){var e=Object.keys(t.query[w]).sort().map((function(e){return{key:e,value:e,text:e}}));y(e)}}),[t,w]);var C=function(e,t){h((function(e){return function(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?ce(n,!0).forEach((function(t){Object(m.a)(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):ce(n).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}({},e,Object(m.a)({},t.state,t.value))}))};return r.a.createElement(f.a.Column,null,r.a.createElement("h1",null,"Chain State"),r.a.createElement(ae.a,null,r.a.createElement(ae.a.Field,null,r.a.createElement(G.a,{placeholder:"Select a module to query",fluid:!0,label:"Module",onChange:C,search:!0,selection:!0,state:"module",options:l,value:w})),r.a.createElement(ae.a.Field,null,r.a.createElement(G.a,{placeholder:"Select a storage item to query",fluid:!0,label:"Storage Item",onChange:C,search:!0,selection:!0,state:"storageItem",options:E,value:S})),r.a.createElement(ae.a.Field,null,r.a.createElement(re.a,{onChange:C,label:"Input",fluid:!0,placeholder:"May not be needed",state:"input",type:"text",value:P})),r.a.createElement(ae.a.Field,null,r.a.createElement(K,{label:"Query",setStatus:b,type:"QUERY",attrs:{params:[P],tx:t.query[w]&&t.query[w][S]}})),r.a.createElement("div",{style:{overflowWrap:"break-word"}},p)))}var oe=n(1276);function ue(e){var t=D().api,n=Object(a.useState)([]),c=Object(o.a)(n,2),l=c[0],u=c[1];return Object(a.useEffect)((function(){var e=['system:ExtrinsicSuccess:: (phase={"ApplyExtrinsic":0})','system:ExtrinsicSuccess:: (phase={"ApplyExtrinsic":1})'];t.query.system.events((function(t){t.forEach((function(t){var n=t.event,a=t.phase,r=n.typeDef,c="".concat(n.section,":").concat(n.method,":: (phase=").concat(a.toString(),")");if(!e.includes(c)){var l=n.data.map((function(e,t){return"".concat(r[t].type,": ").concat(e.toString())}));u((function(e){return[{icon:"bell",date:"X Blocks Ago",summary:"".concat(c,"-").concat(e.length),extraText:n.meta.documentation.join(", ").toString(),content:l.join(", ")}].concat(Object(U.a)(e))}))}}))}))}),[t.query.system]),r.a.createElement(f.a.Column,null,r.a.createElement("h1",null,"Events"),r.a.createElement(oe.a,{style:{overflow:"auto",maxHeight:250},events:l}))}function ie(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function se(e){var t=D().api,n=Object(a.useState)([]),c=Object(o.a)(n,2),l=c[0],u=c[1],i=Object(a.useState)(null),s=Object(o.a)(i,2),p=s[0],b=s[1],O=Object(a.useState)([]),d=Object(o.a)(O,2),E=d[0],y=d[1],v=e.accountPair,j=Object(a.useState)({module:"",callableFunction:"",input:""}),g=Object(o.a)(j,2),h=g[0],w=g[1],S=h.module,P=h.callableFunction,C=h.input;Object(a.useEffect)((function(){var e=Object.keys(t.tx).sort().map((function(e){return{key:e,value:e,text:e}}));u(e)}),[t]),Object(a.useEffect)((function(){if(""!==S){var e=Object.keys(t.tx[S]).sort().map((function(e){return{key:e,value:e,text:e}}));y(e)}}),[t,S]);var R=function(e,t){return w((function(e){return function(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?ie(n,!0).forEach((function(t){Object(m.a)(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):ie(n).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}({},e,Object(m.a)({},t.state,t.value))}))};return r.a.createElement(f.a.Column,null,r.a.createElement("h1",null,"Extrinsics"),r.a.createElement(ae.a,null,r.a.createElement(ae.a.Field,null,r.a.createElement(G.a,{placeholder:"Select a module to call",fluid:!0,label:"Module",onChange:R,search:!0,selection:!0,state:"module",options:l})),r.a.createElement(ae.a.Field,null,r.a.createElement(G.a,{placeholder:"Select a function to call",fluid:!0,label:"Callable Function",onChange:R,search:!0,selection:!0,state:"callableFunction",options:E})),r.a.createElement(ae.a.Field,null,r.a.createElement(re.a,{onChange:R,label:"Input",fluid:!0,placeholder:"May not be needed",state:"input",type:"text"})),r.a.createElement(ae.a.Field,null,r.a.createElement(K,{accountPair:v,label:"Call",setStatus:b,type:"TRANSACTION",attrs:{params:C?[C]:null,tx:t.tx[S]&&t.tx[S][P]}})),r.a.createElement("div",{style:{overflowWrap:"break-word"}},p)))}var pe=n(1274);function fe(e){var t=D().api,n=Object(a.useState)({data:null,version:null}),c=Object(o.a)(n,2),l=c[0],u=c[1];return Object(a.useEffect)((function(){(function(){var e=Object(d.a)(O.a.mark((function e(){var n;return O.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,t.rpc.state.getMetadata();case 3:n=e.sent,u({data:n,version:n.version}),e.next=10;break;case 7:e.prev=7,e.t0=e.catch(0),console.error(e.t0);case 10:case"end":return e.stop()}}),e,null,[[0,7]])})));return function(){return e.apply(this,arguments)}})()()}),[t.rpc.state]),r.a.createElement(f.a.Column,null,r.a.createElement(ee.a,null,r.a.createElement(ee.a.Content,null,r.a.createElement(ee.a.Header,null,"Metadata"),r.a.createElement(ee.a.Meta,null,r.a.createElement("span",null,"v",l.version))),r.a.createElement(ee.a.Content,{extra:!0},r.a.createElement(pe.a,{trigger:r.a.createElement(Y.a,null,"Show Metadata")},r.a.createElement(pe.a.Header,null,"Runtime Metadata"),r.a.createElement(pe.a.Content,{scrolling:!0},r.a.createElement(pe.a.Description,null,r.a.createElement("pre",null,r.a.createElement("code",null,JSON.stringify(l.data,null,2)))))))))}function me(e){var t=D().api,n=Object(a.useState)({}),c=Object(o.a)(n,2),l=c[0],u=c[1];return Object(a.useEffect)((function(){(function(){var e=Object(d.a)(O.a.mark((function e(){var n,a,r,c,l;return O.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,Promise.all([t.rpc.system.chain(),t.rpc.system.name(),t.rpc.system.version()]);case 3:n=e.sent,a=Object(o.a)(n,3),r=a[0],c=a[1],l=a[2],u({chain:r,nodeName:c,nodeVersion:l}),e.next=14;break;case 11:e.prev=11,e.t0=e.catch(0),console.error(e.t0);case 14:case"end":return e.stop()}}),e,null,[[0,11]])})));return function(){return e.apply(this,arguments)}})()()}),[t.rpc.system]),r.a.createElement(f.a.Column,null,r.a.createElement(ee.a,null,r.a.createElement(ee.a.Content,null,r.a.createElement(ee.a.Header,null,l.nodeName),r.a.createElement(ee.a.Meta,null,r.a.createElement("span",null,l.chain)),r.a.createElement(ee.a.Description,null,"Built using the"," ",r.a.createElement("a",{href:"https://github.com/substrate-developer-hub/substrate-front-end-template"},"Substrate Front End Template"))),r.a.createElement(ee.a.Content,{extra:!0},r.a.createElement(L.a,{name:"setting"}),"v",l.nodeVersion)))}function be(e){var t=D().api,n=e.accountPair,c=Object(a.useState)(""),l=Object(o.a)(c,2),u=l[0],i=l[1],s=Object(a.useState)(0),p=Object(o.a)(s,2),m=p[0],b=p[1],O=Object(a.useState)(0),d=Object(o.a)(O,2),E=d[0],y=d[1];return Object(a.useEffect)((function(){var e;return t.query.templateModule.something((function(e){e.isNone?b("<None>"):b(e.unwrap().toNumber())})).then((function(t){e=t})).catch(console.error),function(){return e&&e()}}),[t.query.templateModule]),r.a.createElement(f.a.Column,null,r.a.createElement("h1",null,"Template Module"),r.a.createElement(ee.a,null,r.a.createElement(ee.a.Content,{textAlign:"center"},r.a.createElement(te.a,{label:"Current Value",value:m}))),r.a.createElement(ae.a,null,r.a.createElement(ae.a.Field,null,r.a.createElement(re.a,{type:"number",id:"new_value",state:"newValue",label:"New Value",onChange:function(e,t){var n=t.value;return y(n)}})),r.a.createElement(ae.a.Field,null,r.a.createElement(K,{accountPair:n,label:"Store Something",setStatus:i,type:"TRANSACTION",attrs:{params:[E],tx:t.tx.templateModule.doSomething}})),r.a.createElement("div",{style:{overflowWrap:"break-word"}},u)))}function Oe(e){var t=D().api;return t.query.templateModule&&t.query.templateModule.something?r.a.createElement(be,e):null}function de(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function Ee(e){var t=D().api,n=Object(a.useState)(null),c=Object(o.a)(n,2),l=c[0],u=c[1],i=Object(a.useState)({addressTo:null,amount:0}),s=Object(o.a)(i,2),p=s[0],b=s[1],O=e.accountPair,d=function(e,t){return b((function(e){return function(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?de(n,!0).forEach((function(t){Object(m.a)(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):de(n).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}({},p,Object(m.a)({},t.state,t.value))}))},E=p.addressTo,y=p.amount;return r.a.createElement(f.a.Column,null,r.a.createElement("h1",null,"Transfer"),r.a.createElement(ae.a,null,r.a.createElement(ae.a.Field,null,r.a.createElement(re.a,{fluid:!0,label:"To",type:"text",placeholder:"address",state:"addressTo",onChange:d})),r.a.createElement(ae.a.Field,null,r.a.createElement(re.a,{fluid:!0,label:"Amount",type:"number",state:"amount",onChange:d})),r.a.createElement(ae.a.Field,null,r.a.createElement(K,{accountPair:O,label:"Send",setStatus:u,type:"TRANSACTION",attrs:{params:[E,y],tx:t.tx.balances.transfer}})),r.a.createElement("div",{style:{overflowWrap:"break-word"}},l)))}function ye(e){var t=D().api;return t.query.balances&&t.tx.balances.transfer?r.a.createElement(Ee,e):null}function ve(e){var t,n=D().api,c=Object(a.useState)(""),l=Object(o.a)(c,2),u=l[0],i=l[1],s=Object(a.useState)({}),p=Object(o.a)(s,2),m=p[0],b=p[1],O=e.accountPair,d=function(e){var a,r=(a=t.result,Array.from(new Uint8Array(a)).map((function(e){return e.toString(16).padStart(2,"0")})).join("")),c=n.tx.system.setCode("0x".concat(r));b(c)};return r.a.createElement(f.a.Column,null,r.a.createElement("h1",null,"Upgrade Runtime"),r.a.createElement(ae.a,null,r.a.createElement(ae.a.Field,null,r.a.createElement(re.a,{type:"file",id:"file",label:"Wasm File",accept:".wasm",onChange:function(e){return n=e.target.files[0],(t=new FileReader).onloadend=d,void t.readAsArrayBuffer(n);var n}})),r.a.createElement(ae.a.Field,null,r.a.createElement(K,{accountPair:O,label:"Upgrade",setStatus:i,type:"TRANSACTION",attrs:{params:[m],sudo:!0,tx:n.tx.sudo}})),r.a.createElement("div",{style:{overflowWrap:"break-word"}},u)))}function je(e){return D().api.tx.sudo?r.a.createElement(ve,e):null}function ge(){var e=Object(a.useState)(null),t=Object(o.a)(e,2),n=t[0],c=t[1],l=D(),m=l.apiState,b=l.keyring,O=l.keyringState,d=n&&"READY"===O&&b.getPair(n),E=function(e){return r.a.createElement(u.a,{active:!0},r.a.createElement(i.a,{size:"small"},e))};if("ERROR"===m)return E("Error connecting to the blockchain");if("READY"!==m)return E("Connecting to the blockchain");if("READY"!==O)return E("Loading accounts (please review any extension's authorization)");var y=Object(a.createRef)();return r.a.createElement("div",{ref:y},r.a.createElement(s.a,{context:y},r.a.createElement(J,{setAccountAddress:c})),r.a.createElement(p.a,null,r.a.createElement(f.a,{stackable:!0,columns:"equal"},r.a.createElement(f.a.Row,{stretched:!0},r.a.createElement(me,null),r.a.createElement(fe,null),r.a.createElement(ne,null),r.a.createElement(ne,{finalized:!0})),r.a.createElement(f.a.Row,{stretched:!0},r.a.createElement($,null)),r.a.createElement(f.a.Row,null,r.a.createElement(ye,{accountPair:d}),r.a.createElement(je,{accountPair:d})),r.a.createElement(f.a.Row,null,r.a.createElement(se,{accountPair:d}),r.a.createElement(le,null),r.a.createElement(ue,null)),r.a.createElement(f.a.Row,null,r.a.createElement(Oe,{accountPair:d}))),r.a.createElement(B,null)))}l.a.render(r.a.createElement((function(){return r.a.createElement(x,null,r.a.createElement(ge,null))}),null),document.getElementById("root"))},569:function(e){e.exports=JSON.parse('{"APP_NAME":"substrate-front-end-tutorial","DEVELOPMENT_KEYRING":true,"CUSTOM_TYPES":{}}')},605:function(e,t,n){e.exports=n(1260)},633:function(e,t){},676:function(e,t){},678:function(e,t){},711:function(e,t){},777:function(e,t){}},[[605,1,2]]]);
//# sourceMappingURL=main.f542457d.chunk.js.map