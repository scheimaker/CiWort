import{u as Y}from"./use-quasar.010e6a3c.js";import{g as $,a as j,u as C}from"./words.0a137120.js";import{K as z,r as n,a as D,o as M,k as v,m,n as T,w as r,x as p,q as s,u as y,t as g,s as A,a0 as E,a2 as G,v as K,D as L}from"./index.e645b11c.js";import{_ as Q}from"./plugin-vue_export-helper.21dcd24c.js";import"./utils.dbee5435.js";import"./index-68602d24.94131bdb.js";const X={class:"column q-col-gutter-md",style:{width:"100%","max-width":"600px"}},H={class:"text-h5"},J={class:"text-h1 q-mb-md"},O={key:1},U={class:"star-container row no-wrap"};var Z={__name:"FlashPage",setup(tt){const B=z(),S=Y(),w=n(0),q=n(0);let f=n([]);const _=n(0),x=n(0),h=n(!1),k=n(null),e=D(()=>f.value[_.value]);var b=n(null);console.log(e.value);const N=async()=>{try{const t=await j();console.log(t),f.value=t}catch{S.notify({color:"negative",message:"Failed to load words",position:"top"})}},F=async()=>{if(e.value){w.value++,e.value.rightTimes++;var t=[];t.push({id:e.value.id,rightTimes:e.value.rightTimes}),W(),await C(t),await I()}},R=async()=>{q.value++;var t=[];e.value&&(t.push({id:e.value.id,wrongTimes:e.value.wrongTimes}),await C(t),W())},V=()=>{B.push("main")},I=async()=>{h.value=!0,await L();const t=k.value,c=document.querySelector(".star-container");if(t&&c){const o=c.getBoundingClientRect(),a=t.getBoundingClientRect(),l=c.children;let i=0,d=0;if(l.length>0){const u=l[l.length-1].getBoundingClientRect();u.right-o.left+a.width+10>window.innerWidth?(i=0,d=u.bottom-a.top+10):(i=u.right-a.left+10,d=u.top-a.top)}else i=o.left-a.left,d=o.top-a.top;t.style.transition="transform 1s ease-in-out",t.style.transform=`translate(${i}px, ${d}px)`,setTimeout(()=>{x.value++,h.value=!1,t.style.transition="",t.style.transform=""},400)}},W=()=>{_.value<f.value.length-1?_.value++:_.value=0};return M(async()=>{b.value=(await $()).currentWordbank.value,console.log("Current Wordbank:",b.value),N()}),(t,c)=>{const o=v("q-card-section"),a=v("q-card"),l=v("q-btn"),i=v("q-banner"),d=v("q-page");return m(),T(d,{class:"q-pa-md row justify-center items-center"},{default:r(()=>[p("div",X,[s(a,{class:"q-pa-md"},{default:r(()=>[s(o,{class:"text-center"},{default:r(()=>[p("div",H," Score: "+y(w.value)+" Wrong: "+y(q.value),1)]),_:1})]),_:1}),e.value?(m(),T(a,{key:0,class:"q-pa-md",style:{"max-width":"600px",width:"100%"}},{default:r(()=>[s(o,{class:"text-center"},{default:r(()=>[p("div",J,y(e.value.text),1)]),_:1}),s(o,{class:"text-center q-mt-md"},{default:r(()=>[s(l,{label:"Yes I know",color:"positive",class:"q-mr-md q-px-lg q-py-md",style:{"font-size":"1.2rem"},onClick:F}),s(l,{label:"No",color:"negative",class:"q-px-lg q-py-md",style:{"font-size":"1.2rem"},onClick:R})]),_:1}),s(o,{class:"text-center"},{default:r(()=>[s(l,{label:"Back",color:"blue",onClick:V})]),_:1})]),_:1})):(m(),g("div",O,[s(i,{class:"q-mt-md",type:"positive",icon:"check_circle"},{default:r(()=>c[0]||(c[0]=[A(" All words reviewed. Great job! ")])),_:1})]))]),p("div",U,[(m(!0),g(G,null,E(x.value,(P,u)=>(m(),g("div",{key:u,class:"star-static"}," \u2B50 "))),128))]),h.value?(m(),g("div",{key:0,class:"star-moving",ref_key:"movingStar",ref:k},"\u2B50",512)):K("",!0)]),_:1})}}};var ct=Q(Z,[["__scopeId","data-v-8c965f6c"]]);export{ct as default};
