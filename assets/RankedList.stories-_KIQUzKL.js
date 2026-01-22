import{j as e}from"./jsx-runtime-BLCrrpWs.js";import"./iframe-BCB8JTaD.js";import"./preload-helper-PPVm8Dsz.js";const ne=({title:a,items:v,total:te,maxHeight:ie="400px",valueFormat:le="number",showProgressBars:ae=!0,showTrends:de=!1,onItemClick:se,footerSummary:oe})=>{const ce=r=>{switch(le){case"currency":return`$${r.toLocaleString()}`;case"percentage":return`${r.toFixed(1)}%`;default:return r.toLocaleString()}},ue=r=>te>0?r/te*100:0;return e.jsxs("div",{style:{backgroundColor:"white",borderRadius:"8px",border:"1px solid #e0e0e0",overflow:"hidden"},children:[e.jsx("div",{style:{padding:"16px 20px",borderBottom:"1px solid #e0e0e0",backgroundColor:"#f9f9f9"},children:e.jsx("h3",{style:{fontSize:"16px",fontWeight:"600",color:"#202124",margin:0},children:a})}),e.jsx("div",{className:"subtle-scrollbar",style:{maxHeight:ie,overflowY:"auto",padding:"12px 20px"},children:v.map((r,g)=>{const pe=ue(r.value),m=!!se;return e.jsxs("div",{onClick:()=>m&&se(r),style:{marginBottom:g<v.length-1?"16px":"0",cursor:m?"pointer":"default",transition:"all 0.2s ease"},onMouseEnter:t=>{m&&(t.currentTarget.style.backgroundColor="#f5f5f5",t.currentTarget.style.borderRadius="6px",t.currentTarget.style.padding="8px",t.currentTarget.style.margin="0 -8px 8px -8px")},onMouseLeave:t=>{m&&(t.currentTarget.style.backgroundColor="transparent",t.currentTarget.style.padding="0",t.currentTarget.style.margin=g<v.length-1?"0 0 16px 0":"0")},children:[e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:ae?"8px":"0"},children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"12px"},children:[e.jsx("span",{style:{fontSize:"14px",fontWeight:"500",color:"#9aa0a6",minWidth:"20px"},children:g+1}),e.jsxs("div",{children:[e.jsx("div",{style:{fontSize:"14px",fontWeight:"500",color:"#202124"},children:r.label}),r.subLabel&&e.jsx("div",{style:{fontSize:"12px",color:"#5f6368",marginTop:"2px"},children:r.subLabel})]})]}),e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"8px",textAlign:"right"},children:[e.jsx("span",{style:{fontSize:"14px",fontWeight:"600",color:"#202124"},children:ce(r.value)}),de&&r.change&&e.jsxs("span",{style:{fontSize:"12px",fontWeight:"500",color:r.trend==="up"?"#16a34a":"#dc2626"},children:[r.trend==="up"?"↑":"↓"," ",r.change]})]})]}),ae&&e.jsx("div",{style:{height:"6px",backgroundColor:"#e0e0e0",borderRadius:"3px",overflow:"hidden",marginLeft:"32px",width:"calc(100% - 32px)"},children:e.jsx("div",{style:{width:`${pe}%`,height:"100%",backgroundColor:"#7256F6",borderRadius:"3px",transition:"width 0.3s ease"}})})]},r.id)})}),oe&&e.jsx("div",{style:{padding:"12px 20px",borderTop:"1px solid #e0e0e0",backgroundColor:"#f9f9f9",fontSize:"13px",color:"#5f6368",textAlign:"center"},children:oe})]})};ne.__docgenInfo={description:`Ranked List Component

Displays a scrollable ranked list with optional progress bars,
trend indicators, and click handlers. Commonly used for top
performers, countries, cities, products, etc.`,methods:[],displayName:"RankedList",props:{title:{required:!0,tsType:{name:"string"},description:"Title of the list"},items:{required:!0,tsType:{name:"Array",elements:[{name:"RankedListItem"}],raw:"RankedListItem[]"},description:"Array of items to display"},total:{required:!0,tsType:{name:"number"},description:"Total value for calculating percentages"},maxHeight:{required:!1,tsType:{name:"string"},description:"Maximum height of the scrollable list (default: '400px')",defaultValue:{value:"'400px'",computed:!1}},valueFormat:{required:!1,tsType:{name:"union",raw:"'number' | 'currency' | 'percentage'",elements:[{name:"literal",value:"'number'"},{name:"literal",value:"'currency'"},{name:"literal",value:"'percentage'"}]},description:"Format for the value display",defaultValue:{value:"'number'",computed:!1}},showProgressBars:{required:!1,tsType:{name:"boolean"},description:"Show progress bars",defaultValue:{value:"true",computed:!1}},showTrends:{required:!1,tsType:{name:"boolean"},description:"Show trend indicators",defaultValue:{value:"false",computed:!1}},onItemClick:{required:!1,tsType:{name:"signature",type:"function",raw:"(item: RankedListItem) => void",signature:{arguments:[{type:{name:"RankedListItem"},name:"item"}],return:{name:"void"}}},description:"Callback when an item is clicked"},footerSummary:{required:!1,tsType:{name:"string"},description:"Footer summary text"}}};var h,b,f,y,_,x,w,C,T,S,k,L,R,P,B,F,j,I,A,M,$,H,z,D,q,V,W,E,N,U,G,O,Q,Y,J,K,X,Z,ee,re;const p=[{id:"1",label:"United States",value:1820,change:"5%",trend:"up"},{id:"2",label:"United Kingdom",value:730,change:"3%",trend:"down"},{id:"3",label:"Canada",value:485,change:"9%",trend:"up"},{id:"4",label:"Germany",value:412,change:"12%",trend:"up"},{id:"5",label:"Australia",value:356,change:"2%",trend:"up"},{id:"6",label:"France",value:298,change:"1%",trend:"down"},{id:"7",label:"Japan",value:287,change:"8%",trend:"up"}],me=[{id:"1",label:"Premium Wireless Headphones",value:12450,subLabel:"Electronics",change:"15%",trend:"up"},{id:"2",label:"Smart Fitness Watch",value:9800,subLabel:"Wearables",change:"8%",trend:"up"},{id:"3",label:"Portable Bluetooth Speaker",value:7850,subLabel:"Audio",change:"3%",trend:"down"},{id:"4",label:"Gaming Mouse",value:5420,subLabel:"Accessories",change:"22%",trend:"up"},{id:"5",label:"USB-C Cable Set",value:3290,subLabel:"Accessories",change:"5%",trend:"up"}],ve=[{id:"1",label:"New York",value:645},{id:"2",label:"Los Angeles",value:523},{id:"3",label:"London",value:412},{id:"4",label:"Toronto",value:298},{id:"5",label:"Sydney",value:287},{id:"6",label:"Berlin",value:245}],ge=[{id:"1",label:"Email Campaign",value:18.5,change:"2.3%",trend:"up"},{id:"2",label:"Social Media Ads",value:14.2,change:"0.8%",trend:"up"},{id:"3",label:"Search Ads",value:12.7,change:"1.2%",trend:"down"},{id:"4",label:"Display Ads",value:8.3,change:"0.5%",trend:"down"},{id:"5",label:"Referral",value:6.9,change:"3.1%",trend:"up"}],ye={title:"Components/Ranked List",component:ne,parameters:{layout:"centered",docs:{description:{component:"A scrollable ranked list component with progress bars, trend indicators, and click handlers. Perfect for displaying top performers, countries, products, or any ranked data."}}},tags:["autodocs"],argTypes:{title:{control:"text",description:"Title displayed at the top of the list"},items:{control:"object",description:"Array of items to display in the ranked list"},total:{control:"number",description:"Total value used for calculating progress bar percentages"},maxHeight:{control:"text",description:"Maximum height before scrolling kicks in"},valueFormat:{control:"select",options:["number","currency","percentage"],description:"Format for displaying values"},showProgressBars:{control:"boolean",description:"Show horizontal progress bars below each item"},showTrends:{control:"boolean",description:"Show trend indicators (up/down arrows with percentage)"},footerSummary:{control:"text",description:"Optional summary text displayed in the footer"}},decorators:[a=>e.jsx("div",{style:{width:"400px"},children:e.jsx(a,{})})]},s={args:{title:"Top Countries",items:p,total:5e3,valueFormat:"number",showProgressBars:!0,showTrends:!0,footerSummary:"4,388 / 5,000 (87.8%)"}},o={args:{title:"Top Products by Revenue",items:me,total:5e4,valueFormat:"currency",showProgressBars:!0,showTrends:!0,maxHeight:"450px",footerSummary:"$38,810 / $50,000 (77.6%)"}},n={args:{title:"Top Cities",items:ve,total:3e3,valueFormat:"number",showProgressBars:!0,showTrends:!1,maxHeight:"350px"}},i={args:{title:"Conversion Rates by Channel",items:ge,total:100,valueFormat:"percentage",showProgressBars:!0,showTrends:!0,footerSummary:"Average CVR: 12.1%"}},l={args:{title:"Top Performers",items:p.slice(0,5),total:5e3,valueFormat:"number",showProgressBars:!1,showTrends:!1}},d={args:{title:"Top Countries (Click to View)",items:p,total:5e3,valueFormat:"number",showProgressBars:!0,showTrends:!0,onItemClick:a=>alert(`Clicked: ${a.label} (${a.value})`),footerSummary:"Click any country to view details"}},c={args:{title:"All Countries",items:[...p,{id:"8",label:"Italy",value:245,change:"4%",trend:"up"},{id:"9",label:"Spain",value:223,change:"6%",trend:"up"},{id:"10",label:"Netherlands",value:198,change:"1%",trend:"down"},{id:"11",label:"Switzerland",value:187,change:"3%",trend:"up"},{id:"12",label:"Sweden",value:156,change:"7%",trend:"up"}],total:6e3,valueFormat:"number",showProgressBars:!0,showTrends:!0,maxHeight:"300px",footerSummary:"5,477 / 6,000 (91.3%)"}},u={args:{title:"Quick Stats",items:p.slice(0,3),total:3e3,valueFormat:"number",showProgressBars:!0,showTrends:!1,maxHeight:"200px"}};s.parameters={...s.parameters,docs:{...(h=s.parameters)===null||h===void 0?void 0:h.docs,source:{originalSource:`{
  args: {
    title: 'Top Countries',
    items: topCountries,
    total: 5000,
    valueFormat: 'number',
    showProgressBars: true,
    showTrends: true,
    footerSummary: '4,388 / 5,000 (87.8%)'
  }
}`,...(f=s.parameters)===null||f===void 0||(b=f.docs)===null||b===void 0?void 0:b.source},description:{story:`Default ranked list showing top countries with orders.
Includes progress bars and trend indicators.`,...(_=s.parameters)===null||_===void 0||(y=_.docs)===null||y===void 0?void 0:y.description}}};o.parameters={...o.parameters,docs:{...(x=o.parameters)===null||x===void 0?void 0:x.docs,source:{originalSource:`{
  args: {
    title: 'Top Products by Revenue',
    items: topProducts,
    total: 50000,
    valueFormat: 'currency',
    showProgressBars: true,
    showTrends: true,
    maxHeight: '450px',
    footerSummary: '$38,810 / $50,000 (77.6%)'
  }
}`,...(C=o.parameters)===null||C===void 0||(w=C.docs)===null||w===void 0?void 0:w.source},description:{story:"Revenue-focused list with currency formatting.",...(S=o.parameters)===null||S===void 0||(T=S.docs)===null||T===void 0?void 0:T.description}}};n.parameters={...n.parameters,docs:{...(k=n.parameters)===null||k===void 0?void 0:k.docs,source:{originalSource:`{
  args: {
    title: 'Top Cities',
    items: topCities,
    total: 3000,
    valueFormat: 'number',
    showProgressBars: true,
    showTrends: false,
    maxHeight: '350px'
  }
}`,...(R=n.parameters)===null||R===void 0||(L=R.docs)===null||L===void 0?void 0:L.source},description:{story:"Simple list without trends, just showing values.",...(B=n.parameters)===null||B===void 0||(P=B.docs)===null||P===void 0?void 0:P.description}}};i.parameters={...i.parameters,docs:{...(F=i.parameters)===null||F===void 0?void 0:F.docs,source:{originalSource:`{
  args: {
    title: 'Conversion Rates by Channel',
    items: conversionRates,
    total: 100,
    valueFormat: 'percentage',
    showProgressBars: true,
    showTrends: true,
    footerSummary: 'Average CVR: 12.1%'
  }
}`,...(I=i.parameters)===null||I===void 0||(j=I.docs)===null||j===void 0?void 0:j.source},description:{story:"Conversion rates with percentage formatting.",...(M=i.parameters)===null||M===void 0||(A=M.docs)===null||A===void 0?void 0:A.description}}};l.parameters={...l.parameters,docs:{...($=l.parameters)===null||$===void 0?void 0:$.docs,source:{originalSource:`{
  args: {
    title: 'Top Performers',
    items: topCountries.slice(0, 5),
    total: 5000,
    valueFormat: 'number',
    showProgressBars: false,
    showTrends: false
  }
}`,...(z=l.parameters)===null||z===void 0||(H=z.docs)===null||H===void 0?void 0:H.source},description:{story:"Minimal list without progress bars.",...(q=l.parameters)===null||q===void 0||(D=q.docs)===null||D===void 0?void 0:D.description}}};d.parameters={...d.parameters,docs:{...(V=d.parameters)===null||V===void 0?void 0:V.docs,source:{originalSource:`{
  args: {
    title: 'Top Countries (Click to View)',
    items: topCountries,
    total: 5000,
    valueFormat: 'number',
    showProgressBars: true,
    showTrends: true,
    onItemClick: item => alert(\`Clicked: \${item.label} (\${item.value})\`),
    footerSummary: 'Click any country to view details'
  }
}`,...(E=d.parameters)===null||E===void 0||(W=E.docs)===null||W===void 0?void 0:W.source},description:{story:"Interactive list with click handlers.",...(U=d.parameters)===null||U===void 0||(N=U.docs)===null||N===void 0?void 0:N.description}}};c.parameters={...c.parameters,docs:{...(G=c.parameters)===null||G===void 0?void 0:G.docs,source:{originalSource:`{
  args: {
    title: 'All Countries',
    items: [...topCountries, {
      id: '8',
      label: 'Italy',
      value: 245,
      change: '4%',
      trend: 'up' as const
    }, {
      id: '9',
      label: 'Spain',
      value: 223,
      change: '6%',
      trend: 'up' as const
    }, {
      id: '10',
      label: 'Netherlands',
      value: 198,
      change: '1%',
      trend: 'down' as const
    }, {
      id: '11',
      label: 'Switzerland',
      value: 187,
      change: '3%',
      trend: 'up' as const
    }, {
      id: '12',
      label: 'Sweden',
      value: 156,
      change: '7%',
      trend: 'up' as const
    }],
    total: 6000,
    valueFormat: 'number',
    showProgressBars: true,
    showTrends: true,
    maxHeight: '300px',
    footerSummary: '5,477 / 6,000 (91.3%)'
  }
}`,...(Q=c.parameters)===null||Q===void 0||(O=Q.docs)===null||O===void 0?void 0:O.source},description:{story:"Long scrollable list with many items.",...(J=c.parameters)===null||J===void 0||(Y=J.docs)===null||Y===void 0?void 0:Y.description}}};u.parameters={...u.parameters,docs:{...(K=u.parameters)===null||K===void 0?void 0:K.docs,source:{originalSource:`{
  args: {
    title: 'Quick Stats',
    items: topCountries.slice(0, 3),
    total: 3000,
    valueFormat: 'number',
    showProgressBars: true,
    showTrends: false,
    maxHeight: '200px'
  }
}`,...(Z=u.parameters)===null||Z===void 0||(X=Z.docs)===null||X===void 0?void 0:X.source},description:{story:"Compact list for small spaces.",...(re=u.parameters)===null||re===void 0||(ee=re.docs)===null||ee===void 0?void 0:ee.description}}};const _e=["Default","TopProductsByRevenue","TopCities","ConversionRates","MinimalList","ClickableItems","ScrollableList","CompactList"];export{d as ClickableItems,u as CompactList,i as ConversionRates,s as Default,l as MinimalList,c as ScrollableList,n as TopCities,o as TopProductsByRevenue,_e as __namedExportsOrder,ye as default};
