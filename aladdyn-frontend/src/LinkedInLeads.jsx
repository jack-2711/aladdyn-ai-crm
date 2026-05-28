import { useState, useEffect, useCallback } from "react";
const API_BASE = "http://localhost:8000";
const SEED_LEADS = [
  {id:"li_001",name:"Priya Sharma",title:"Head of Growth @ TechCorp",engagement_action:"liked",keywords_matched:["AI","CRM"],ai_score:90,lead_tier:"HOT",extracted_at:"2026-05-27T07:10:00",status:"new"},
  {id:"li_002",name:"Arjun Mehta",title:"Founder @ GrowthStack",engagement_action:"commented",keywords_matched:["lead gen","SaaS"],ai_score:85,lead_tier:"HOT",extracted_at:"2026-05-27T07:12:00",status:"contacted"},
  {id:"li_003",name:"Sarah Chen",title:"VP Sales @ NovaSoft",engagement_action:"liked",keywords_matched:["AI","automation"],ai_score:80,lead_tier:"HOT",extracted_at:"2026-05-27T07:15:00",status:"new"},
  {id:"li_004",name:"Ravi Kumar",title:"Product Manager @ Startify",engagement_action:"shared",keywords_matched:["CRM","pipeline"],ai_score:75,lead_tier:"WARM",extracted_at:"2026-05-27T07:18:00",status:"new"},
  {id:"li_005",name:"Aisha Patel",title:"Growth Hacker @ LeadLabs",engagement_action:"commented",keywords_matched:["outbound","AI"],ai_score:78,lead_tier:"WARM",extracted_at:"2026-05-27T07:20:00",status:"qualified"},
  {id:"li_006",name:"James Okonkwo",title:"CEO @ RevBoost",engagement_action:"liked",keywords_matched:["revenue","SaaS"],ai_score:88,lead_tier:"HOT",extracted_at:"2026-05-27T07:22:00",status:"new"},
  {id:"li_007",name:"Lin Wei",title:"Marketing Director @ ScaleUp",engagement_action:"liked",keywords_matched:["B2B","automation"],ai_score:65,lead_tier:"WARM",extracted_at:"2026-05-27T07:25:00",status:"new"},
  {id:"li_008",name:"Fatima Al-Rashid",title:"Business Dev @ PitchPerfect",engagement_action:"commented",keywords_matched:["outreach","leads"],ai_score:72,lead_tier:"WARM",extracted_at:"2026-05-27T07:28:00",status:"new"},
];
const TIER={HOT:{bg:"#fff0ee",text:"#d85a30",border:"#f0997b"},WARM:{bg:"#fef9ec",text:"#ba7517",border:"#fac775"},COLD:{bg:"#f1efe8",text:"#5f5e5a",border:"#d3d1c7"}};
const ACTION_ICON={liked:"👍",commented:"💬",shared:"🔁"};
const STATUS_COL={new:"#378add",contacted:"#1d9e75",qualified:"#639922",disqualified:"#888780"};
function ScoreBar({score}){const c=score>=85?"#d85a30":score>=65?"#ba7517":"#888780";return(<div style={{display:"flex",alignItems:"center",gap:8}}><div style={{flex:1,height:6,background:"#f1efe8",borderRadius:3,overflow:"hidden"}}><div style={{width:`${score}%`,height:"100%",background:c,borderRadius:3}}/></div><span style={{fontSize:13,fontWeight:500,color:c,minWidth:28}}>{score}</span></div>);}
function LeadCard({lead,onStatusChange}){const t=TIER[lead.lead_tier]||TIER.COLD;const ini=lead.name.split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase();return(<div style={{background:"#fff",border:"1px solid #e8e6df",borderRadius:12,padding:"14px 16px",display:"flex",flexDirection:"column",gap:10}}><div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:8}}><div style={{display:"flex",gap:10,alignItems:"flex-start"}}><div style={{width:38,height:38,borderRadius:"50%",background:t.bg,border:`1px solid ${t.border}`,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:600,fontSize:12,color:t.text,flexShrink:0}}>{ini}</div><div><p style={{margin:0,fontWeight:600,fontSize:14,color:"#1a1a1a"}}>{lead.name}</p><p style={{margin:"2px 0 0",fontSize:12,color:"#666"}}>{lead.title}</p></div></div><span style={{fontSize:11,fontWeight:600,padding:"3px 9px",borderRadius:20,background:t.bg,color:t.text,border:`1px solid ${t.border}`,whiteSpace:"nowrap"}}>{lead.lead_tier}</span></div><ScoreBar score={lead.ai_score}/><div style={{display:"flex",gap:6,flexWrap:"wrap"}}><span style={{fontSize:11,padding:"2px 8px",borderRadius:12,background:"#f1efe8",color:"#5f5e5a"}}>{ACTION_ICON[lead.engagement_action]} {lead.engagement_action}</span>{lead.keywords_matched.map(k=>(<span key={k} style={{fontSize:11,padding:"2px 8px",borderRadius:12,background:"#e6f1fb",color:"#185fa5"}}>{k}</span>))}</div><div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}><select value={lead.status} onChange={e=>onStatusChange(lead.id,e.target.value)} style={{fontSize:12,padding:"3px 8px",borderRadius:6,border:"1px solid #d3d1c7",color:STATUS_COL[lead.status]||"#888",background:"#fafaf8",cursor:"pointer"}}><option value="new">New</option><option value="contacted">Contacted</option><option value="qualified">Qualified</option><option value="disqualified">Disqualified</option></select><span style={{fontSize:11,color:"#999"}}>{new Date(lead.extracted_at).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}</span></div></div>);}
export default function LinkedInLeads(){
  const [leads,setLeads]=useState(SEED_LEADS);
  const [filter,setFilter]=useState("ALL");
  const [scanning,setScanning]=useState(false);
  const [lastScan,setLastScan]=useState("07:28 AM");
  const [apiLive,setApiLive]=useState(false);
  const [tab,setTab]=useState("leads");
  const fetchLeads=useCallback(async()=>{try{const res=await fetch(`${API_BASE}/linkedin/extracted-leads`,{signal:AbortSignal.timeout(2000)});if(res.ok){const data=await res.json();setLeads(data.leads);if(data.last_scan)setLastScan(new Date(data.last_scan).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}));setApiLive(true);}}catch{}},[]);
  useEffect(()=>{fetchLeads();},[fetchLeads]);
  const triggerScan=async()=>{if(scanning)return;setScanning(true);if(apiLive){try{await fetch(`${API_BASE}/linkedin/scan`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({keywords:["AI CRM","SaaS"],headless:true})});setTimeout(async()=>{await fetchLeads();setScanning(false);},4000);return;}catch{}}await new Promise(r=>setTimeout(r,2500));const names=["Dev Anand","Meera Nair","Tom Bradley","Zara Hussain"];const titles=["CTO @ Launchpad","Sales Lead @ Orbit","Founder @ Nexus","Head of BD @ PivotCo"];const score=60+Math.floor(Math.random()*35);const idx=Math.floor(Math.random()*names.length);setLeads(prev=>[{id:`li_sim_${Date.now()}`,name:names[idx],title:titles[idx],engagement_action:["liked","commented","shared"][Math.floor(Math.random()*3)],keywords_matched:["AI","SaaS"],ai_score:score,lead_tier:score>=85?"HOT":"WARM",extracted_at:new Date().toISOString(),status:"new"},...prev]);setLastScan(new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}));setScanning(false);};
  const updateStatus=async(id,status)=>{setLeads(prev=>prev.map(l=>l.id===id?{...l,status}:l));if(apiLive){try{await fetch(`${API_BASE}/linkedin/leads/${id}/status`,{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify({status})});}catch{}}};
  const filtered=filter==="ALL"?leads:leads.filter(l=>l.lead_tier===filter);
  const hot=leads.filter(l=>l.lead_tier==="HOT").length;
  const warm=leads.filter(l=>l.lead_tier==="WARM").length;
  const avg=leads.length?Math.round(leads.reduce((s,l)=>s+l.ai_score,0)/leads.length):0;
  return(
    <div style={{fontFamily:"system-ui,sans-serif",maxWidth:960,margin:"0 auto",padding:"24px 16px",background:"#f9f8f6",minHeight:"100vh"}}>
      <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:24,flexWrap:"wrap",gap:12}}>
        <div>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
            <div style={{width:8,height:8,borderRadius:"50%",background:scanning?"#ef9f27":"#1d9e75"}}/>
            <span style={{fontSize:12,color:"#666"}}>{scanning?"Playwright scanning LinkedIn...":`Last scan ${lastScan}`}</span>
            {apiLive&&<span style={{fontSize:11,padding:"1px 8px",borderRadius:10,background:"#eaf3de",color:"#3b6d11",border:"1px solid #97c459"}}>API connected</span>}
          </div>
          <h2 style={{margin:0,fontSize:22,fontWeight:700,color:"#1a1a1a"}}>LinkedIn Lead Intelligence</h2>
          <p style={{margin:"4px 0 0",fontSize:13,color:"#666"}}>Engagement-based extraction · Aladdyn prototype</p>
        </div>
        <button onClick={triggerScan} disabled={scanning} style={{padding:"8px 18px",borderRadius:8,border:"1px solid #d3d1c7",background:scanning?"#f1efe8":"#fff",cursor:scanning?"not-allowed":"pointer",fontSize:13,fontWeight:500,color:"#1a1a1a"}}>
          {scanning?"⟳ Scanning...":"⟳ Run Scan"}
        </button>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:12,marginBottom:24}}>
        {[["Total leads",leads.length,"#185fa5"],["Hot leads",hot,"#d85a30"],["Warm leads",warm,"#ba7517"],["Avg AI score",avg,"#1d9e75"]].map(([label,val,color])=>(
          <div key={label} style={{background:"#fff",border:"1px solid #e8e6df",borderRadius:10,padding:"14px 16px"}}>
            <p style={{margin:0,fontSize:12,color:"#888"}}>{label}</p>
            <p style={{margin:"4px 0 0",fontSize:26,fontWeight:700,color}}>{val}</p>
          </div>
        ))}
      </div>
      <div style={{display:"flex",gap:2,borderBottom:"1px solid #e8e6df",marginBottom:20}}>
        {[["leads","Leads"],["antiBotReport","Anti-Bot"],["apiComparison","API Guide"]].map(([key,label])=>(
          <button key={key} onClick={()=>setTab(key)} style={{padding:"7px 16px",fontSize:13,border:"none",borderBottom:tab===key?"2px solid #378add":"2px solid transparent",background:"transparent",cursor:"pointer",color:tab===key?"#185fa5":"#888",fontWeight:tab===key?600:400}}>{label}</button>
        ))}
      </div>
      {tab==="leads"&&<>
        <div style={{display:"flex",gap:8,marginBottom:16,flexWrap:"wrap"}}>
          {["ALL","HOT","WARM","COLD"].map(t=>{const tc=TIER[t]||{bg:"#fff",text:"#888",border:"#ccc"};return(<button key={t} onClick={()=>setFilter(t)} style={{padding:"4px 14px",borderRadius:20,fontSize:12,border:`1px solid ${filter===t?tc.border:"#d3d1c7"}`,cursor:"pointer",background:filter===t?tc.bg:"#fff",color:filter===t?tc.text:"#666",fontWeight:filter===t?600:400}}>{t} ({t==="ALL"?leads.length:leads.filter(l=>l.lead_tier===t).length})</button>);})}
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))",gap:12}}>
          {filtered.map(lead=><LeadCard key={lead.id} lead={lead} onStatusChange={updateStatus}/>)}
        </div>
        <p style={{marginTop:16,fontSize:11,color:"#aaa",textAlign:"center"}}>API: <code>GET /linkedin/extracted-leads</code> · Monitor: <code>linkedin_monitor.py</code></p>
      </>}
      {tab==="antiBotReport"&&<div style={{display:"flex",flexDirection:"column",gap:10}}>
        {[{t:"Auth wall",d:"Login wall triggered for unauthenticated requests",r:"HIGH"},{t:"CAPTCHA",d:"Verification on repeated automated navigation",r:"HIGH"},{t:"Fingerprint detection",d:"Headless Chromium detected via automation APIs",r:"MEDIUM"},{t:"Rate limiting",d:"IP throttling after 5+ requests/min",r:"MEDIUM"},{t:"Session monitor",d:"Session invalidated on suspicious scroll patterns",r:"MEDIUM"},{t:"Account lock",d:"Temporary restriction for bulk profile visits",r:"HIGH"}].map(({t,d,r})=>(
          <div key={t} style={{background:"#fff",border:"1px solid #e8e6df",borderRadius:10,padding:"12px 16px",display:"flex",gap:14,alignItems:"flex-start"}}>
            <span style={{padding:"3px 10px",borderRadius:20,fontSize:11,fontWeight:600,flexShrink:0,background:r==="HIGH"?"#fcebeb":"#faeeda",color:r==="HIGH"?"#a32d2d":"#854f0b",border:`1px solid ${r==="HIGH"?"#f09595":"#ef9f27"}`}}>{r}</span>
            <div><p style={{margin:0,fontWeight:600,fontSize:13,color:"#1a1a1a"}}>{t}</p><p style={{margin:"2px 0 0",fontSize:12,color:"#666"}}>{d}</p></div>
          </div>
        ))}
        <div style={{background:"#e1f5ee",border:"1px solid #5dcaa5",borderRadius:10,padding:"12px 16px",marginTop:4}}>
          <p style={{margin:0,fontWeight:600,fontSize:13,color:"#085041"}}>Recommendation</p>
          <p style={{margin:"4px 0 0",fontSize:12,color:"#0f6e56"}}>Use LinkedIn OAuth + Organization API for production. Playwright only for controlled prototype demos.</p>
        </div>
      </div>}
      {tab==="apiComparison"&&<div style={{display:"flex",flexDirection:"column",gap:8}}>
        {[{n:"LinkedIn OAuth API",t:"Official",c:"Free (app approval)",r:"LOW",s:"HIGH"},{n:"LinkedIn Organization API",t:"Official",c:"Enterprise",r:"LOW",s:"HIGH"},{n:"Apollo.io API",t:"3rd-party",c:"$49+/mo",r:"LOW",s:"VERY HIGH"},{n:"Clearbit API",t:"3rd-party",c:"$99+/mo",r:"LOW",s:"VERY HIGH"},{n:"Crunchbase API",t:"3rd-party",c:"$29+/mo",r:"LOW",s:"HIGH"},{n:"Playwright automation",t:"Browser",c:"Free",r:"HIGH",s:"LOW"},{n:"Selenium scraping",t:"Browser",c:"Free",r:"VERY HIGH",s:"VERY LOW"}].map(({n,t,c,r,s})=>{const rc={LOW:"#1d9e75",HIGH:"#d85a30","VERY HIGH":"#a32d2d",MEDIUM:"#ba7517"}[r]||"#888";return(<div key={n} style={{background:"#fff",border:"1px solid #e8e6df",borderRadius:10,padding:"10px 16px",display:"grid",gridTemplateColumns:"1fr auto auto",gap:16,alignItems:"center"}}><div><p style={{margin:0,fontSize:13,fontWeight:600,color:"#1a1a1a"}}>{n}</p><p style={{margin:0,fontSize:11,color:"#888"}}>{t} · {c}</p></div><span style={{fontSize:12,fontWeight:600,color:rc}}>Risk: {r}</span><span style={{fontSize:12,color:"#185fa5"}}>Scale: {s}</span></div>);})}
      </div>}
    </div>
  );
}
