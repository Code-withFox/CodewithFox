document.addEventListener("DOMContentLoaded",()=>{
  const header=document.querySelector(".site-header");
  const menu=document.querySelector(".menu-toggle");
  const links=document.querySelector(".nav-links");
  if(menu&&links){menu.addEventListener("click",()=>{const open=links.classList.toggle("open");menu.setAttribute("aria-expanded",open)})}
  const onScroll=()=>{if(header) header.classList.toggle("scrolled",scrollY>12)}; onScroll(); addEventListener("scroll",onScroll,{passive:true});
  const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add("show");observer.unobserve(e.target)}}),{threshold:.12});
  document.querySelectorAll(".reveal").forEach(el=>observer.observe(el));
  document.querySelectorAll(".nav-links a").forEach(a=>a.addEventListener("click",()=>links?.classList.remove("open")));
  const year=document.getElementById("year"); if(year) year.textContent=new Date().getFullYear();
  const search=document.getElementById("studySearch");
  if(search){const cards=[...document.querySelectorAll(".study-card")];search.addEventListener("input",()=>{const q=search.value.toLowerCase().trim();cards.forEach(c=>{c.style.display=(!q||((c.dataset.search||"")+" "+c.innerText).toLowerCase().includes(q))?"block":"none"})})}
});
  const sections=[...document.querySelectorAll("main section[id]")];
  const navAnchors=[...document.querySelectorAll(".nav-links a[href^='#']")];
  const syncActive=()=>{let current="";sections.forEach(s=>{if(scrollY>=s.offsetTop-140)current=s.id});navAnchors.forEach(a=>a.classList.toggle("active",a.getAttribute("href")==="#"+current))};
  addEventListener("scroll",syncActive,{passive:true}); syncActive();
