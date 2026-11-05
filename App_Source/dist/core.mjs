export const CATEGORIES = {
  income:['Salary','Freelance','Benefits','Other income'],
  needs:['Housing','Groceries','Transport','Health','Debt payments'],
  wants:['Dining out','Entertainment','Shopping','Hobbies','Travel']
};
export const ALL_CATEGORIES=Object.values(CATEGORIES).flat();
export function pennies(value){
 const s=String(value).trim();
 if(!/^(?:0|[1-9]\d{0,7})(?:\.\d{1,2})?$/.test(s))throw Error('Enter a positive amount with no more than two decimal places.');
 const [a,b='']=s.split('.');const n=Number(a)*100+Number(b.padEnd(2,'0'));
 if(n<=0)throw Error('Amount must be greater than zero.');return n;
}
export function validDate(s){if(!/^\d{4}-\d{2}-\d{2}$/.test(s))return false;const d=new Date(s+'T00:00:00Z');return Number.isFinite(+d)&&d.toISOString().slice(0,10)===s;}
export function validateTransaction(t){
 if(!t||typeof t.id!=='string'||!t.id||t.id.length>100)throw Error('Invalid transaction identifier.');
 if(!['income','needs','wants'].includes(t.type)||!CATEGORIES[t.type].includes(t.category))throw Error('Choose a valid type and category.');
 if(!Number.isSafeInteger(t.amount)||t.amount<=0||t.amount>9999999999)throw Error('Invalid amount.');
 if(!validDate(t.date))throw Error('Choose a valid date.');
 if(typeof t.description!=='string'||t.description.length>120)throw Error('Description must be 120 characters or fewer.');
 return {id:t.id,type:t.type,category:t.category,amount:t.amount,date:t.date,description:t.description.trim()};
}
export function upsert(list,t){const item=validateTransaction(t);const found=list.some(x=>x.id===item.id);return found?list.map(x=>x.id===item.id?item:x):[...list,item];}
export function remove(list,id){return list.filter(x=>x.id!==id);}
export function summarise(list,month){
 const rows=list.filter(x=>x.date.slice(0,7)===month);const sum=type=>rows.filter(x=>x.type===type).reduce((a,t)=>a+t.amount,0);
 const income=sum('income'),needs=sum('needs'),wants=sum('wants');
 return {rows,income,needs,wants,expenses:needs+wants,balance:income-needs-wants,categories:Object.fromEntries([...CATEGORIES.needs,...CATEGORIES.wants].map(c=>[c,rows.filter(t=>t.category===c&&t.type!=='income').reduce((n,t)=>n+t.amount,0)]))};
}
export function validateState(v){
 if(!v||v.version!==1||!Array.isArray(v.transactions)||v.transactions.length>20000||!v.budgets||typeof v.budgets!=='object'||Array.isArray(v.budgets))throw Error('This is not a supported BudgetWise backup.');
 const transactions=v.transactions.map(validateTransaction);if(new Set(transactions.map(t=>t.id)).size!==transactions.length)throw Error('Duplicate transaction identifiers.');
 const budgets={};for(const [m,b] of Object.entries(v.budgets)){
  if(!/^\d{4}-(0[1-9]|1[0-2])$/.test(m)||!b||typeof b!=='object'||Array.isArray(b))throw Error('Invalid budget month.');
  budgets[m]={};for(const [c,n] of Object.entries(b)){if(![...CATEGORIES.needs,...CATEGORIES.wants].includes(c)||!Number.isSafeInteger(n)||n<0||n>9999999999)throw Error('Invalid category budget.');budgets[m][c]=n;}
 }return {version:1,transactions,budgets};
}
export function persist(storage,state){const clean=validateState(state);storage.setItem('budgetwise.v1',JSON.stringify(clean));return clean;}
export function demoState(month){
 const values=[['income','Salary',250000,'Monthly salary'],['needs','Housing',75000,'Rent and utilities'],['needs','Groceries',24000,'Weekly food shops'],['needs','Transport',11000,'Travel pass'],['needs','Health',7500,'Health essentials'],['needs','Debt payments',5000,'Minimum payment'],['wants','Dining out',21000,'Meals and coffee'],['wants','Entertainment',18000,'Subscriptions and events'],['wants','Shopping',9500,'Personal purchases'],['wants','Hobbies',8500,'Weekend activities'],['wants','Travel',7500,'Travel spending']];
 return {version:1,transactions:values.map((x,i)=>({id:'example-'+i,type:x[0],category:x[1],amount:x[2],description:x[3],date:month+'-'+String(Math.min(i+1,28)).padStart(2,'0')})),budgets:{[month]:Object.fromEntries([...CATEGORIES.needs,...CATEGORIES.wants].map((c,i)=>[c,[75000,25000,12500,7500,5000,25000,20000,12500,10000,7500][i]]))}};
}
