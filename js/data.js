export const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

export const ACTIONS = [
  {id:"nep", icon:"🛒", title:"Expand the New Economic Policy", detail:"Encourage small trade and local markets.", cost:12, result:"Local trade is picking up. Shopkeepers and small producers are cautiously returning.", apply:s=>{s.industry+=3;s.trust+=5;s.money+=2;s.stability+=2;}},
  {id:"farms", icon:"🌾", title:"Support agricultural recovery", detail:"Provide tools and seed to farming communities.", cost:10, result:"Farm output improves as tools and seed reach rural communities.", apply:s=>{s.food+=8;s.trust+=3;s.farms=Math.min(5,s.farms+1);}},
  {id:"factory", icon:"⚙️", title:"Repair industrial facilities", detail:"Restore workshops and rail-linked factories.", cost:14, result:"A repaired factory floor brings more workers back into production.", apply:s=>{s.industry+=7;s.factories=Math.min(4,s.factories+1);}},
  {id:"relief", icon:"🥣", title:"Organize food relief", detail:"Prioritize supplies for towns facing shortages.", cost:8, result:"Food relief reaches several districts. Public confidence rises.", apply:s=>{s.food+=12;s.trust+=4;s.stability+=2;}},
  {id:"schools", icon:"📚", title:"Fund schools and literacy", detail:"Invest in education and local civic services.", cost:11, result:"New literacy classes and civic services open. The benefits will take time.", apply:s=>{s.trust+=6;s.stability+=3;s.civic=Math.min(4,s.civic+1);}},
  {id:"rail", icon:"🚂", title:"Restore rail connections", detail:"Improve the movement of goods between regions.", cost:16, result:"Rail connections improve. Food and industrial goods move more reliably.", apply:s=>{s.food+=4;s.industry+=4;s.stability+=4;}}
];

export const REPORTS = [
  "Rail schedules are becoming more reliable, though some rural routes remain difficult.",
  "Local councils report cautious optimism. They want practical improvements more than slogans.",
  "Winter stores are being counted. Better transport could prevent shortages next season.",
  "Workshop managers report that spare parts remain scarce, but output is slowly recovering.",
  "Teachers and local administrators ask for books, heating and dependable funding.",
  "Farmers are watching market rules closely before deciding how much surplus to bring to town."
];

export const EVENTS = [
  {when:s=>s.year===1921 && s.month===2, title:"The New Economic Policy", description:"The economy needs room to recover. Your advisers propose allowing limited private trade and small-scale enterprise while the state retains control of major industries.", choices:[
    {title:"Introduce limited market freedoms", detail:"A pragmatic compromise; public trust and industry may improve.", result:"The policy is introduced. Local markets begin to stir.", apply:s=>{s.trust+=5;s.industry+=5;s.money+=4;s.stability+=2;}},
    {title:"Keep strict central controls", detail:"A cautious course that preserves the existing system.", result:"Central controls remain. Some administrators welcome clarity, but trade stays subdued.", apply:s=>{s.stability+=3;s.industry-=2;s.trust-=2;}}
  ]},
  {when:s=>s.year===1921 && s.month===5, title:"A difficult harvest forecast", description:"Reports from agricultural districts warn that harvests may be weak. Officials ask how to prioritize limited resources.", choices:[
    {title:"Prioritize seed and farm tools", detail:"Spend resources to support next season's production.", result:"Farm communities receive practical support for the coming season.", apply:s=>{s.money-=5;s.food+=5;s.trust+=4;s.farms=Math.min(5,s.farms+1);}},
    {title:"Move existing food to cities", detail:"Relieve immediate urban pressure, with rural costs.", result:"Urban food access improves, while rural confidence dips.", apply:s=>{s.food+=10;s.trust-=3;s.stability+=1;}}
  ]},
  {when:s=>s.year===1921 && s.month===8, title:"Rebuilding public services", description:"Local administrators request funding for schools, clinics and basic municipal services. The treasury is limited.", choices:[
    {title:"Fund local services", detail:"Improve public trust and long-term stability.", result:"Local services receive a modest funding boost.", apply:s=>{s.money-=8;s.trust+=6;s.stability+=4;s.civic=Math.min(4,s.civic+1);}},
    {title:"Delay the investment", detail:"Keep funds available for immediate economic needs.", result:"The treasury is preserved, but residents are disappointed.", apply:s=>{s.money+=3;s.trust-=3;}}
  ]}
];
