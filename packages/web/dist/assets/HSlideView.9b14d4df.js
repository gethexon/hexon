var X=Object.defineProperty,Y=Object.defineProperties;var k=Object.getOwnPropertyDescriptors;var h=Object.getOwnPropertySymbols;var C=Object.prototype.hasOwnProperty,I=Object.prototype.propertyIsEnumerable;var _=(n,e,t)=>e in n?X(n,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):n[e]=t,d=(n,e)=>{for(var t in e||(e={}))C.call(e,t)&&_(n,t,e[t]);if(h)for(var t of h(e))I.call(e,t)&&_(n,t,e[t]);return n},b=(n,e)=>Y(n,k(e));import{d as w,o as i,g as E,w as g,e as x,T as S,h as p,a as v,r as y,P as $,b as m,v as z,F,p as L,f as O,I as P}from"./vendor.a0f19e68.js";const T=w({props:{direction:null,duration:{default:100}},setup(n){const e=n,t={up:{beforeEnter:{translateY:30},leave:{translateY:-30}},down:{beforeEnter:{translateY:-30},leave:{translateY:30}},left:{beforeEnter:{translateX:30},leave:{translateX:-30}},right:{beforeEnter:{translateX:-30},leave:{translateX:30}}};function f(a,l){p({targets:a,opacity:1,translateY:0,translateX:0,duration:e.duration,easing:"easeInOutSine",complete:l})}function s(a){p.set(a,d({opacity:0},t[e.direction].beforeEnter))}function c(a,l){p(d({targets:a,opacity:0,duration:e.duration,easing:"easeInOutSine",complete:l},t[e.direction].leave))}return(a,l)=>(i(),E(S,{onEnter:f,onBeforeEnter:s,onLeave:c},{default:g(()=>[x(a.$slots,"default")]),_:3}))}}),j={class:"relative w-full h-full overflow-hidden"},N=w({props:{current:null,model:null,horizontal:{type:Boolean,default:!1},reverted:{type:Boolean,default:!1}},emits:["update:current"],setup(n,{emit:e}){const t=n,f=v(()=>t.model.map((r,u)=>b(d({},r),{idx:u}))),s=y(!1),c=y([]);$(()=>t.current,(r,u)=>{const o=f.value[r];!o||(c.value=[o],u!==void 0&&(s.value=r>u))},{immediate:!0});const a=r=>{e("update:current",r)},l=v(()=>t.reverted?!s.value:s.value),B=v(()=>t.horizontal?l.value?"left":"right":l.value?"up":"down");return(r,u)=>(i(),m("div",j,[z(T,{direction:O(B),duration:200},{default:g(()=>[(i(!0),m(F,null,L(c.value,o=>(i(),m("div",{class:"absolute w-full h-full overflow-hidden",key:o.idx},[x(r.$slots,"default",{component:o.component,idx:o.idx,setCurrent:a},()=>[(i(),E(P(o.component),{idx:o.idx,setCurrent:a},null,8,["idx"]))])]))),128))]),_:3},8,["direction"])]))}});export{N as _};