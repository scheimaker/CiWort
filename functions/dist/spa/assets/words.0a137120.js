import{g as e,a,B as s}from"./utils.dbee5435.js";const u=async(r,t)=>{try{const o=await e();return(await a.post(`${s}/wordbanks/add-words`,{wordbankId:r,words:t},{headers:{Authorization:`Bearer ${o}`}})).data}catch(o){throw console.error("Error submitting words to wordbank:",o),o}},h=async()=>{try{const r=await e();return(await a.get(`${s}/wordbanks`,{headers:{Authorization:`Bearer ${r}`}})).data.wordbanks}catch(r){throw console.error("Error fetching wordbanks:",r),r}},k=async r=>{try{const t=await e();return(await a.post(`${s}/wordbanks`,{name:r},{headers:{Authorization:`Bearer ${t}`}})).data}catch(t){throw console.error("Error creating wordbank:",t),t}},p=async()=>{try{const r=await e();return(await a.get(`${s}/getwords_currentwordbanks`,{headers:{Authorization:`Bearer ${r}`}})).data.words}catch(r){throw console.error("Error fetching words from wordbank:",r),r}},b=async(r,t)=>{const o=await e();return await a.put(`${s}/wordbanks/${r}`,t,{headers:i(o)})},i=r=>({Authorization:`Bearer ${r}`}),g=(r,t,o)=>[...r.filter(n=>n.text!==t.text&&n.text.length===t.text.length).sort(()=>.5-Math.random()).slice(0,o),t].sort(()=>.5-Math.random()),$=async r=>{const t=await e();return console.log(r),await a.post(`${s}/setcurrentwordbank`,{wordbankId:r},{headers:{Authorization:`Bearer ${t}`}})},l=async()=>{const r=await e();return(await a.get(`${s}/getcurrentwordbank`,{headers:{Authorization:`Bearer ${r}`}})).data},y=async r=>{const t=await e();return(await a.post(`${s}/lookupword`,{word:r},{headers:{Authorization:`Bearer ${t}`}})).data},T=async()=>{try{const r=await e();return await a.post(`${s}/test`,{},{headers:{Authorization:`Bearer ${r}`}}),{message:"test function successfully"}}catch(r){throw console.error("Error updating word times:",r),r}};export{p as a,g as b,k as c,$ as d,h as f,l as g,y as l,u as s,T as t,b as u};
