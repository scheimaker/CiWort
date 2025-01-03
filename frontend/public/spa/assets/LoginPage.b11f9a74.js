import{Q as C,a as h}from"./QPage.ab8a6537.js";import{a as I,Q as q}from"./QInput.b6acc4e8.js";import{c as L,r as b,p as B,L as E,M as R,o as k,h as A,d as D,g as j,N as M,O as Q,D as N,P as O,K as U,m as K,n as $,w as p,q as f,x as T,R as z,S as G,Q as H}from"./index.6cc5e6e2.js";import{Q as J}from"./QCard.d99ae717.js";import{u as W}from"./use-quasar.4d06c9b9.js";import{l as X}from"./auth.df9c9da1.js";import{_ as Y}from"./plugin-vue_export-helper.21dcd24c.js";import"./utils.67f5346b.js";import"./index-68602d24.94131bdb.js";var Z=L({name:"QForm",props:{autofocus:Boolean,noErrorFocus:Boolean,noResetFocus:Boolean,greedy:Boolean,onSubmit:Function},emits:["reset","validationSuccess","validationError"],setup(n,{slots:a,emit:l}){const o=j(),i=b(null);let d=0;const s=[];function w(e){const c=typeof e=="boolean"?e:n.noErrorFocus!==!0,y=++d,_=(t,r)=>{l(`validation${t===!0?"Success":"Error"}`,r)},F=t=>{const r=t.validate();return typeof r.then=="function"?r.then(u=>({valid:u,comp:t}),u=>({valid:!1,comp:t,err:u})):Promise.resolve({valid:r,comp:t})};return(n.greedy===!0?Promise.all(s.map(F)).then(t=>t.filter(r=>r.valid!==!0)):s.reduce((t,r)=>t.then(()=>F(r).then(u=>{if(u.valid===!1)return Promise.reject(u)})),Promise.resolve()).catch(t=>[t])).then(t=>{if(t===void 0||t.length===0)return y===d&&_(!0),!0;if(y===d){const{comp:r,err:u}=t[0];if(u!==void 0&&console.error(u),_(!1,r),c===!0){const P=t.find(({comp:S})=>typeof S.focus=="function"&&M(S.$)===!1);P!==void 0&&P.comp.focus()}}return!1})}function m(){d++,s.forEach(e=>{typeof e.resetValidation=="function"&&e.resetValidation()})}function v(e){e!==void 0&&Q(e);const c=d+1;w().then(y=>{c===d&&y===!0&&(n.onSubmit!==void 0?l("submit",e):e!==void 0&&e.target!==void 0&&typeof e.target.submit=="function"&&e.target.submit())})}function x(e){e!==void 0&&Q(e),l("reset"),N(()=>{m(),n.autofocus===!0&&n.noResetFocus!==!0&&g()})}function g(){I(()=>{if(i.value===null)return;const e=i.value.querySelector("[autofocus][tabindex], [data-autofocus][tabindex]")||i.value.querySelector("[autofocus] [tabindex], [data-autofocus] [tabindex]")||i.value.querySelector("[autofocus], [data-autofocus]")||Array.prototype.find.call(i.value.querySelectorAll("[tabindex]"),c=>c.tabIndex!==-1);e!=null&&e.focus({preventScroll:!0})})}B(O,{bindComponent(e){s.push(e)},unbindComponent(e){const c=s.indexOf(e);c!==-1&&s.splice(c,1)}});let V=!1;return E(()=>{V=!0}),R(()=>{V===!0&&n.autofocus===!0&&g()}),k(()=>{n.autofocus===!0&&g()}),Object.assign(o.proxy,{validate:w,resetValidation:m,submit:v,reset:x,focus:g,getValidationComponents:()=>s}),()=>A("form",{class:"q-form",ref:i,onSubmit:v,onReset:x},D(a.default))}});const ee={setup(){const n=W(),a=U(),l=b(""),o=b(""),i=b(!1);return{email:l,password:o,passwordVisible:i,togglePasswordVisibility:()=>{i.value=!i.value},onLogin:async m=>{try{m.preventDefault(),await X(l.value,o.value),n.notify({color:"positive",message:"Logged in successfully!",position:"top"}),l.value="",o.value="",a.push("/main")}catch(v){n.notify({color:"negative",message:v.message||"Login failed!",position:"top"})}},onInputFocus:m=>{console.log(`Focus on: ${m}, email: ${l.value}, password: ${o.value}`)}}}};function oe(n,a,l,o,i,d){return K(),$(C,{class:"row justify-center items-center q-pa-md"},{default:p(()=>[f(J,{class:"q-pa-md",style:{"max-width":"500px",width:"100%"}},{default:p(()=>[f(h,null,{default:p(()=>a[4]||(a[4]=[T("div",{class:"text-h6"},"Login",-1)])),_:1}),f(h,null,{default:p(()=>[f(Z,{onSubmit:z(o.onLogin,["prevent"]),ref:"loginForm",class:"q-gutter-md"},{default:p(()=>[f(q,{modelValue:o.email,"onUpdate:modelValue":a[0]||(a[0]=s=>o.email=s),type:"email",label:"Email",outlined:"",class:"full-width",dense:"",required:"",autocomplete:"off",onFocus:a[1]||(a[1]=s=>o.onInputFocus("email"))},null,8,["modelValue"]),f(q,{modelValue:o.password,"onUpdate:modelValue":a[2]||(a[2]=s=>o.password=s),type:o.passwordVisible?"text":"password",label:"Password",outlined:"",class:"full-width",dense:"",required:"",autocomplete:"off",onFocus:a[3]||(a[3]=s=>o.onInputFocus("password"))},{append:p(()=>[f(G,{name:o.passwordVisible?"visibility_off":"visibility",onClick:o.togglePasswordVisibility,class:"cursor-pointer"},null,8,["name","onClick"])]),_:1},8,["modelValue","type"]),f(H,{label:"Login",type:"submit",color:"primary",class:"full-width q-mt-md",dense:""})]),_:1},8,["onSubmit"])]),_:1})]),_:1})]),_:1})}var fe=Y(ee,[["render",oe],["__scopeId","data-v-50762594"]]);export{fe as default};
