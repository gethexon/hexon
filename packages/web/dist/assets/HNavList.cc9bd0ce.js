import{H as B}from"./HDivider.188cc5f6.js";import{d as f,u as N,f as t,$ as H,a as C,o,b as s,F as m,p as y,v as V,l as S,j,t as _,n as w,s as I,g,w as T,q as $}from"./vendor.a0f19e68.js";import{c as z,m as A,d as D}from"./index.c1b12cec.js";const F={class:"h-nav-item px-4 py-0.5 mx-0 my-0.5 h-7 rounded-md select-none cursor-pointer flex items-center"},L={class:"w-4 inline-block"},q={key:0,class:"sub text-xs ml-2"},E=f({props:{icon:null,text:null,indent:{default:0},selected:{type:Boolean,default:!1},color:null,sub:{default:""},uppercase:{type:Boolean,default:!0}},setup(a){const i=a;N(c=>({ed2a9582:t(r).bgColor,be1aa3fc:t(r).subColor,"4a9c127e":t(r).hoverBgColor,"5b985e99":t(r).activeBgColor}));const{icon:p,text:l,indent:v,selected:e,color:x,uppercase:k}=H(i),h=C(()=>v.value===0?[]:new Array(v.value).fill(0).map((c,u)=>u)),n=A("NavList"),r=C(()=>{const c=e.value?n.value.backgroundColorSelected:n.value.backgroundColorTransparent,u=n.value.textColorSecondary,d=n.value.backgroundColorHover,b=n.value.backgroundColorActive;return{bgColor:c,subColor:u,hoverBgColor:d,activeBgColor:b}});return(c,u)=>{var d;return o(),s("div",F,[(o(!0),s(m,null,y(t(h),b=>(o(),s("span",L))),256)),V(t(D),{class:"mr-3 text-lg",style:S({color:t(x)}),name:t(p)},null,8,["style","name"]),j("span",{class:w(["text text-sm",{uppercase:t(k)}])},_(t(l)),3),((d=a.sub)==null?void 0:d.toString())?(o(),s("span",q,_(a.sub),1)):I("",!0)])}}});var R=z(E,[["__scopeId","data-v-ba0775d8"]]);const M=f({props:{model:null},emits:["on-select"],setup(a,{emit:i}){const p=l=>{i("on-select",l)};return(l,v)=>(o(!0),s(m,null,y(a.model,e=>(o(),s(m,null,[e.type==="title"?(o(),g(B,{key:0},{default:T(()=>[$(_(e.label),1)]),_:2},1024)):(o(),g(R,{key:1,text:e.text,icon:e.icon,indent:e.indent,color:e.color,sub:e.sub,selected:e.selected,uppercase:e.uppercase,onClick:x=>p(e.key)},null,8,["text","icon","indent","color","sub","selected","uppercase","onClick"]))],64))),256))}});export{M as _};