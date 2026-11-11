import "../posavc.css";
import { trackInitiateCheckout } from "../lib/meta-pixel";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, Check, ChevronLeft, ChevronRight, FileText, HeartHandshake, LockKeyhole, MessageCircle, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/")({
  component: Landing,
  head: () => ({ meta: [
    { title: "Kit Comunicação Pós-AVC | Pranchas e Atividades em PDF" },
    { name: "description", content: "Recursos visuais e atividades para apoiar a comunicação cotidiana após o AVC. Material complementar em PDF." },
    { property: "og:title", content: "Kit Comunicação Pós-AVC" },
    { property: "og:description", content: "Pranchas visuais e atividades de comunicação para famílias, cuidadores e profissionais." },
    { property: "og:type", content: "website" },
  ] }),
});

// Insira o URL oficial do checkout somente após confirmação.
const CHECKOUT_URL = "https://pay.cakto.com.br/3eg2nvx_1309085";
const TRACKING = ["utm_source","utm_medium","utm_campaign","utm_content","utm_term","utm_id","fbclid","gclid","ttclid","src","sck"];
const previews = [
  { title: "Expressar necessidades", description: "Água, comida ou descanso? Imagens simples ajudam a mostrar o que a pessoa precisa no dia a dia.", labels: ["Água","Comida","Banheiro","Descanso"], icons:["💧","🍽️","🚻","🛏️"] },
  { title: "Fazer escolhas", description: "Café ou suco? Pequenas escolhas ajudam a manter a participação e a autonomia na rotina.", labels: ["Café","Suco"], icons:["☕","🧃"] },
  { title: "Compartilhar sentimentos", description: "Feliz, triste ou cansado? As imagens oferecem outra maneira de expressar sentimentos.", labels: ["Casa","Feliz","Ler","Comer"], icons:["🏠","🙂","📖","🍎"] },
];
const pages = [
  { title:"Apostila de Linguagem e Nomeação", description:"Atividades ilustradas para trabalhar identificação de objetos, palavras e ações.", labels:["Sim","Não","Quero","Ajuda"], icons:["✅","❌","👋","🤝"] },
  { title:"Apostila de Memória e Associação", description:"Exercícios visuais de reconhecimento, associação e sequências cotidianas.", labels:["Água","Comida","Banheiro","Descanso"], icons:["💧","🍽️","🚻","🛏️"] },
  { title:"Cards de Identificação Rápida", description:"Cartões individuais com imagens grandes de alimentos, objetos e necessidades.", labels:["Feliz","Triste","Com dor","Calmo"], icons:["🙂","😢","😣","😌"] },
  { title:"Pranchas de Comunicação Funcional", description:"Recursos visuais para apoiar escolhas, respostas e necessidades do dia a dia.", labels:["Livro","Chave","Copo","Telefone"], icons:["📖","🔑","🥛","📱"] },
  { title:"Cards de Emoções e Rotina", description:"Imagens para comunicar sentimentos, preferências e atividades cotidianas.", labels:["Acordar","Comer","Passear","Dormir"], icons:["🌞","🍽️","🚶","🌙"] },
  { title:"Guia Prático para Familiares e Cuidadores", description:"Orientações simples para utilizar os materiais de forma respeitosa e adaptada.", labels:["Dar tempo","Escolher","Observar","Acolher"], icons:["⏳","🗣️","👀","💚"] },
];
const faq = [
  ["O produto é físico ou digital?","O material é 100% digital, disponibilizado em PDF."],
  ["Posso imprimir quantas vezes precisar?","Sim, você pode imprimir o material para uso pessoal ou profissional."],
  ["Familiares conseguem utilizar o material?","Sim. O kit inclui recursos visuais e orientações acessíveis."],
  ["Serve para pessoas que não conseguem falar?","Algumas pranchas podem apoiar formas alternativas de comunicação, conforme as capacidades e necessidades individuais. A adequação deve ser avaliada por um fonoaudiólogo."],
  ["Como recebo meu acesso?","Após a confirmação do pagamento, as instruções de acesso são enviadas ao e-mail cadastrado."],
  ["Preciso informar meu CPF?","O CPF pode ser solicitado pela plataforma de pagamento para identificação da compra e cumprimento de obrigações fiscais e de segurança."],
  ["O kit substitui a fonoaudiologia?","Não. É um recurso complementar de apoio à comunicação e não substitui avaliação ou tratamento individualizado."],
  ["O que exatamente recebo no kit?","Você recebe arquivos digitais em PDF com apostilas de atividades, cartões ilustrados, pranchas de comunicação e orientações de utilização. Os materiais podem ser impressos."],
];
function Board({ labels, icons }: { labels:string[], icons:string[] }) {
  return <div className="board"><div className="board-top">COMUNICAÇÃO VISUAL <span>DEMONSTRAÇÃO</span></div><div className="board-grid">{labels.map((x,i)=><div className="board-cell" key={x}><span>{icons[i]}</span><b>{x}</b></div>)}</div><small>Prévia ilustrativa • não é um arquivo final</small></div>;
}
function Mockup() {
  return <div className="mockup" aria-label="Mockup demonstrativo do kit, aguardando as páginas reais"><div className="mockup-back"><Board labels={pages[1].labels} icons={pages[1].icons}/></div><div className="mockup-front"><div className="cover-kicker">MATERIAL DE APOIO À COMUNICAÇÃO</div><MessageCircle size={36}/><strong>KIT<br/>COMUNICAÇÃO<br/><span>PÓS-AVC</span></strong><p>Pranchas visuais e atividades para o cotidiano</p><div className="cover-bottom">MATERIAL DIGITAL • FORMATO A4</div></div><span className="mockup-tag">MOCKUP DEMONSTRATIVO</span></div>;
}
function Heading({ tag,title,subtitle }: {tag:string,title:string,subtitle?:string}) {
  return <div className="heading"><span className="eyebrow">{tag}</span><h2>{title}</h2>{subtitle && <p>{subtitle}</p>}</div>;
}

function LoopGallery({ start, title, items }: { start:number; title:string; items:typeof pages }) {
  const ref=useRef<HTMLDivElement>(null);
  const [active,setActive]=useState(0);
  const paused=useRef(false);
  const visible=useRef(false);
  const count=items.length;
  const copies=[...items,...items,...items];
  function stepSize(){
    const el=ref.current;
    if(!el || !el.children.length)return 0;
    const first=el.children[0] as HTMLElement;
    return first.getBoundingClientRect().width + parseFloat(getComputedStyle(el).gap || "0");
  }
  function jump(index:number, smooth=true){
    const el=ref.current;const width=stepSize();
    if(!el || !width)return;
    el.scrollTo({left:width*(count+index),behavior:smooth?"smooth":"instant"});
    setActive(((index%count)+count)%count);
  }
  useEffect(()=>{
    const el=ref.current;if(!el)return;
    const reset=()=>{const w=stepSize();if(w)el.scrollLeft=w*count;};
    const observer=new IntersectionObserver(entries=>{visible.current=entries[0]?.isIntersecting??false;},{threshold:0.15});
    observer.observe(el);
    const frame=requestAnimationFrame(reset);
    // Recenter only after movement completes, so the end-to-start transition stays seamless.
    const normalize=()=>{
      const width=stepSize();if(!width)return;
      const pos=Math.round(el.scrollLeft/width);
      if(pos<count || pos>=count*2){
        const target=count+((pos%count)+count)%count;
        el.style.scrollSnapType="none";
        el.scrollTo({left:target*width,behavior:"instant"});
        requestAnimationFrame(()=>{el.style.scrollSnapType="";});
      }
    };
    el.addEventListener("scrollend",normalize);
    const timer=setInterval(()=>{
      if(!paused.current && visible.current && !document.hidden && !window.matchMedia("(prefers-reduced-motion: reduce)").matches){
        const width=stepSize();if(!width)return;
        const index=Math.round(el.scrollLeft/width)-count;
        jump(index+1);
      }
    },2400);
    window.addEventListener("resize",reset);
    return ()=>{observer.disconnect();cancelAnimationFrame(frame);clearInterval(timer);el.removeEventListener("scrollend",normalize);window.removeEventListener("resize",reset);};
  },[]);
  function update(){
    const el=ref.current,w=stepSize();if(!el||!w)return;
    const pos=Math.round(el.scrollLeft/w);
    setActive(((pos%count)+count)%count);

  }
  return <div className="viewer infinite-viewer" aria-label={title} onMouseEnter={()=>paused.current=true} onMouseLeave={()=>paused.current=false} onFocus={()=>paused.current=true} onBlur={()=>paused.current=false} onTouchStart={()=>paused.current=true} onTouchEnd={()=>{paused.current=false}}>
    <div className="viewer-top"><span></span><span>{active+1} / {count}</span></div>
    <div className="page-track infinite-track" ref={ref} onScroll={update}>
      {copies.map((item,index)=><div className={"page-slide " + (index%count===active ? "is-centered" : "")} key={index} aria-hidden={Math.floor(index/count)!==1 && index!==count+active ? "true":undefined}>
        <img src={`/e${start+(index%count)}.png`} alt={`Prévia ${start+(index%count)}: ${item.title}`} loading="lazy" decoding="async" width="900" height="1200" />
        <h3>{item.title}</h3><p>{item.description}</p>
      </div>)}
    </div>
    <div className="viewer-bottom">
      <button type="button" aria-label="Imagem anterior" onClick={()=>jump(active-1)}><ChevronLeft/></button>
      <div className="progress"><span style={{width:((active+1)/count*100)+"%"}}/></div>
      <button type="button" aria-label="Próxima imagem" onClick={()=>jump(active+1)}><ChevronRight/></button>
    </div>
  </div>;
}

function Landing(){
  const [notice,setNotice]=useState(false);
  const [example,setExample]=useState(0);
  const exampleRef=useRef<HTMLDivElement>(null);
  const offerRef=useRef<HTMLElement>(null);
  function checkout(){
    if (CHECKOUT_URL) {
      try {
        const url=new URL(CHECKOUT_URL);
        if(url.protocol==="https:"){
          const params=new URLSearchParams(window.location.search);
          TRACKING.forEach(k=>{ const v=params.get(k); if(v && v.length<501 && !url.searchParams.has(k)) url.searchParams.set(k,v); });
          trackInitiateCheckout();
          window.location.assign(url.toString()); return;
        }
      } catch { /* checkout not configured */ }
    }
    setNotice(true); offerRef.current?.scrollIntoView({behavior:"smooth",block:"center"});
  }
  function go(ref:React.RefObject<HTMLDivElement|null>,index:number,set:(x:number)=>void){
    set(index); (ref.current?.children[index] as HTMLElement | undefined)?.scrollIntoView({behavior:"smooth",block:"nearest",inline:"center"});
  }
  function scrolled(ref:React.RefObject<HTMLDivElement|null>,set:(x:number)=>void){
    const el=ref.current;if(!el || !el.children.length)return;
    const child=el.children[0] as HTMLElement;
    set(Math.min(el.children.length-1,Math.max(0,Math.round(el.scrollLeft/(child.offsetWidth+16)))));
  }
  const buyButton=(text:string)=><button className="buy-button" onClick={checkout}>{text}<ArrowRight size={20}/></button>;
  return <main className="posavc">
    <div className="topbar">MATERIAL DIGITAL <span>•</span> ACESSO APÓS A COMPRA <span>•</span> PRONTO PARA IMPRIMIR</div>
    <section className="hero container">
      <div className="hero-text"><span className="hero-label">COMUNICAÇÃO PÓS-AVC • FAMÍLIA E PROFISSIONAIS</span><h1>Apostilas, cards e pranchas para apoiar a comunicação após o AVC.</h1><div className="hero-mk"><img src="/mk.png" alt="Mockup do Kit Comunicação Pós-AVC" fetchPriority="high" decoding="async" width="900" height="900" /></div><p>Um kit digital com atividades ilustradas, cartões de identificação rápida e pranchas visuais para apoiar a comunicação em casa ou complementar atendimentos fonoaudiológicos.</p><div className="checks"><span><Check/> Apostilas com atividades</span><span><Check/> Cards de identificação</span><span><Check/> Pranchas para imprimir</span></div>
      {buyButton("QUERO MEU KIT COMPLETO")}</div>
    </section>
    <section className="section container"><Heading tag="PARA O DIA A DIA" title="Uma imagem pode facilitar uma conversa." subtitle="Veja como recursos simples podem apoiar a comunicação em diferentes momentos do cotidiano."/>
      <div className="example-track" ref={exampleRef} onScroll={()=>scrolled(exampleRef,setExample)}>{previews.map((p,i)=><article className="example-card" key={p.title}><div className="example-image"><img src={"/img%20"+(i+1)+".png"} alt={"Exemplo visual do kit: "+p.title} loading="lazy" decoding="async" width="900" height="900" /></div><div className="card-text"><span className="eyebrow">0{i+1}</span><h3>{p.title}</h3><p>{p.description}</p></div></article>)}</div>
      <div className="dots">{previews.map((p,i)=><button aria-label={"Ver exemplo "+(i+1)} aria-current={example===i?"true":undefined} key={p.title} className={example===i?"on":""} onClick={()=>go(exampleRef,i,setExample)}/>)}</div>
    </section>
    <section className="section kit"><div className="container"><Heading tag="CONHEÇA O KIT" title="Conheça tudo o que vem no seu kit." subtitle="Apostilas com exercícios, cards de identificação rápida e pranchas ilustradas para utilizar em casa ou no acompanhamento profissional. Um Pouco do nosso Material"/>
      <LoopGallery start={1} title="Primeira galeria de materiais" items={pages.slice(0,5)} />
      <div className="gallery-second"><LoopGallery start={6} title="Segunda galeria de materiais" items={[
        { title:"Outros exemplos do kit • 06", description:"Prévia ilustrativa do material.", labels:[], icons:[] },
        { title:"Outros exemplos do kit • 07", description:"Prévia ilustrativa do material.", labels:[], icons:[] },
        { title:"Outros exemplos do kit • 08", description:"Prévia ilustrativa do material.", labels:[], icons:[] },
        { title:"Outros exemplos do kit • 09", description:"Prévia ilustrativa do material.", labels:[], icons:[] },
        { title:"Outros exemplos do kit • 10", description:"Prévia ilustrativa do material.", labels:[], icons:[] },
      ]} /></div>
      <div className="checks centered"><span><Check/> Arquivos digitais</span><span><Check/> Formato A4</span><span><Check/> Uso em casa ou consultório</span></div>
    </div></section>
    <section className="section container"><Heading tag="PENSADO PARA VOCÊ" title="Um recurso para quem cuida e para quem acompanha."/><div className="audiences">
      <article className="audience"><div className="audience-visual"><img src="/FAMILIA.png" alt="Familiar e pessoa idosa utilizando recursos de comunicação" loading="lazy" decoding="async" /></div><div className="audience-copy"><span className="eyebrow">PARA FAMÍLIAS E CUIDADORES</span><h3>Mais possibilidades de comunicação em casa.</h3><p>Tenha apostilas, cards e pranchas ilustradas para apoiar escolhas, expressar necessidades e criar oportunidades de comunicação no cotidiano.</p><ul><li>Cards de identificação rápida</li><li>Atividades ilustradas para a rotina</li><li>Orientações para familiares</li></ul></div></article>
      <article className="audience"><div className="audience-visual professional"><img src="/FONO.png" alt="Fonoaudióloga utilizando recursos visuais em atendimento" loading="lazy" decoding="async" /></div><div className="audience-copy"><span className="eyebrow">PARA FONOAUDIÓLOGOS</span><h3>Materiais prontos para apoiar suas sessões.</h3><p>Acesse recursos organizados para adaptar aos objetivos de seus atendimentos e orientar atividades complementares em casa.</p><ul><li>Apostilas de atividades</li><li>Pranchas de comunicação alternativa</li><li>Cards imprimíveis e orientações familiares</li></ul></div></article>
    </div></section>
    <section className="section offer" id="oferta" ref={offerRef}><div className="container"><Heading tag="ACESSO DIGITAL" title="Um kit completo de recursos visuais por apenas R$ 15,90." subtitle="Materiais digitais organizados para imprimir, consultar e utilizar conforme as necessidades de cada pessoa."/><div className="offer-box"><div className="offer-banner"><FileText size={18}/> KIT DIGITAL COMPLETO</div><div className="offer-inner"><div className="offer-info"><p className="inclusion-caption">Conteúdos previstos — confirmar nos PDFs finais:</p><ul>{["Apostila de Linguagem e Nomeação","Apostila de Memória e Associação","Cards de Identificação Rápida","Pranchas de Comunicação Funcional","Cards de Emoções e Rotina","Guia Prático para Família e Cuidadores"].map(x=><li key={x}><Check size={18}/>{x}</li>)}</ul><div className="pricing"><span>Pagamento único</span><strong><small>R$</small> 15,90</strong><span className="fees-included">TAXAS JÁ INCLUÍDAS</span><p>Sem mensalidades.</p></div>{buyButton("QUERO ACESSAR O KIT AGORA")}{notice&&<p className="notice" role="status">Checkout ainda não configurado. Nenhuma cobrança foi iniciada.</p>}<div className="security"><LockKeyhole size={14}/> Compra segura • Acesso após confirmação • 100% digital</div></div></div></div></div></section>
    <section className="section container"><div className="faq-layout"><div className="guarantee"><ShieldCheck size={40}/><h2>Sua compra com tranquilidade.</h2><p>Você conta com os direitos previstos para compras realizadas pela internet, incluindo o direito de arrependimento no prazo de 7 dias, conforme a legislação aplicável, e pode solicitar suporte pelos canais informados na compra.</p></div><div className="faq"><h2>Dúvidas frequentes</h2>{faq.map(([q,a])=><details key={q}><summary>{q}<span aria-hidden="true">+</span></summary><p>{a}</p></details>)}</div></div></section>
    <section className="final-cta"><div className="container"><MessageCircle size={35}/><h2>Mais recursos para apoiar a comunicação no dia a dia.</h2><p>Tenha apostilas, cards e pranchas reunidos em um único kit digital, com materiais para a rotina familiar e o acompanhamento profissional.</p>{buyButton("QUERO MEU KIT COMPLETO")}<small>PDF digital • Material para impressão • Pagamento único</small></div></section>
    <footer><div className="container"><strong>Kit Comunicação Pós-AVC</strong><p>Material complementar de apoio à comunicação. Não substitui acompanhamento profissional.</p><small>© {new Date().getFullYear()} • Todos os direitos reservados.</small></div></footer>
  </main>;
}
