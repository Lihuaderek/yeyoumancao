async function searchHFSpaces() {
  const url = 'https://huggingface.co/api/spaces?search=IDM-VTON&limit=10';
  const res = await fetch(url);
  const data = await res.json();
  console.log('Found IDM-VTON spaces:');
  data.forEach(s => console.log(s.id, s.likes));
  
  const url2 = 'https://huggingface.co/api/spaces?search=try-on&limit=10';
  const res2 = await fetch(url2);
  const data2 = await res2.json();
  console.log('Found try-on spaces:');
  data2.forEach(s => console.log(s.id, s.likes));
}
searchHFSpaces();
