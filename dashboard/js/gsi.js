export async function fetchState(){try{const r=await fetch('/state',{cache:'no-store'});if(!r.ok)return null;return await r.json();}catch{return null;}}
