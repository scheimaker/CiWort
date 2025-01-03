import{K as S,r as l,G as U,o as V,m as v,t as k,x as a,q as x,w as y,Q as w,u as g,a2 as A,a0 as E,v as C,n as G,s as W}from"./index.6cc5e6e2.js";import{g as F,a as Q,u as b,b as q}from"./words.fac39540.js";import{_ as D}from"./plugin-vue_export-helper.21dcd24c.js";import"./utils.67f5346b.js";import"./index-68602d24.94131bdb.js";const K={name:"WhackAMolePinyin",setup(){const _=S(),e=l(Array(9).fill(null)),p=l(0),o=l(0),u=l(""),c=l(!1),i=l(""),f=l(!1);let m=[],s=null,d=null;var h=l(null);const B=async()=>{try{m=await Q(),f.value=!0,console.log("Words loaded successfully"),console.log(m)}catch(t){console.error("Error fetching words:",t),u.value="\u65E0\u6CD5\u52A0\u8F7D\u8BCD\u6C47\uFF0C\u8BF7\u7A0D\u540E\u518D\u8BD5\u3002"}},I=()=>{p.value=0,o.value=0,u.value="",c.value=!1,d&&clearInterval(d),T(),d=setInterval(()=>{c.value=!0;var t=[];s.wrongTimes++,t.push({id:s.id,wrongTimes:s.wrongTimes}),b(h.value,t)},5e3)},T=()=>{u.value="",c.value=!1,clearInterval(d),s=m[Math.floor(Math.random()*m.length)],i.value=s.pinyin;const t=m.filter(M=>M.text.length===s.text.length),n=q(t,s,2),r=R(3);e.value=Array(9).fill(null),r.forEach((M,P)=>{e.value[M]=n[P]}),d=setInterval(()=>{c.value=!0},5e3)},R=t=>{const n=[];for(;n.length<t;){const r=Math.floor(Math.random()*e.value.length);n.includes(r)||n.push(r)}return n},L=t=>{var n=[];const r=e.value[t];r&&r.pinyin&&r.pinyin===i.value?(p.value++,r.rightTimes++,n.push({id:r.id,rightTimes:r.rightTimes}),b(h.value,n)):(u.value="\u9009\u9519\u4E86\uFF01\u7EE7\u7EED\u52A0\u6CB9\uFF01",o.value++,r.wrongTimes++,s.wrongTimes++,n.push({id:r.id,wrongTimes:r.wrongTimes}),n.push({id:s.id,wrongTimes:s.wrongTimes}),b(h.value,n)),T()},N=()=>{_.push("/main")};return U(()=>{d&&clearInterval(d)}),V(async()=>{h.value=(await F()).currentWordbank.value,console.log("Current Wordbank:",h.value),B()}),{holes:e,score:p,totalWrongTimes:o,currentPinyin:i,startGame:I,hitMole:L,goBack:N,nextRound:T,showNextRoundButton:c,errorMessage:u,isLoaded:f}}},O={class:"game-container"},j={class:"text"},z={class:"grid"},H=["onClick"],J={key:0,class:"mole"},X={key:0,class:"error-message"};function Y(_,e,p,o,u,c){return v(),k("div",O,[e[4]||(e[4]=a("h4",null,"\u6253\u5730\u9F20\u6E38\u620F - Pinyin Whack-a-Mole",-1)),e[5]||(e[5]=a("br",null,null,-1)),x(w,{color:"red",disabled:!o.isLoaded,onClick:o.startGame},{default:y(()=>[W(g(o.isLoaded?"Start":"Loading..."),1)]),_:1},8,["disabled","onClick"]),a("h4",null,"\u5F53\u524D\u62FC\u97F3: "+g(o.currentPinyin),1),a("p",j,"Score: "+g(o.score)+" Wrong: "+g(o.totalWrongTimes),1),a("div",z,[(v(!0),k(A,null,E(o.holes,(i,f)=>(v(),k("div",{key:f,class:"hole",onClick:m=>o.hitMole(f)},[i?(v(),k("div",J,g(i.text),1)):C("",!0)],8,H))),128))]),o.errorMessage?(v(),k("p",X,g(o.errorMessage),1)):C("",!0),e[6]||(e[6]=a("br",null,null,-1)),o.showNextRoundButton?(v(),G(w,{key:1,color:"primary",onClick:o.nextRound},{default:y(()=>e[1]||(e[1]=[W("Time is Up")])),_:1},8,["onClick"])):C("",!0),e[7]||(e[7]=a("br",null,null,-1)),e[8]||(e[8]=a("br",null,null,-1)),x(w,{color:"secondary",onClick:e[0]||(e[0]=i=>_.$router.push("/game"))},{default:y(()=>e[2]||(e[2]=[W("\u8FD4\u56DE")])),_:1}),x(w,{color:"secondary",onClick:o.goBack},{default:y(()=>e[3]||(e[3]=[W("\u8FD4\u56DE\u4E3B\u9875\u9762")])),_:1},8,["onClick"])])}var ne=D(K,[["render",Y],["__scopeId","data-v-47118666"]]);export{ne as default};
