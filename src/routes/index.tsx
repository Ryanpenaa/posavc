import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
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
const CHECKOUT_URL = "";
const TRACKING = ["utm_source","utm_medium","utm_campaign","utm_content","utm_term","utm_id","fbclid","gclid","ttclid","src","sck"];
const previews = [
  { title: "Expressar necessidades", description: "Recursos visuais para ajudar a indicar necessidades e preferências.", labels: ["Água","Comida","Banheiro","Descanso"], icons:["💧","🍽️","🚻","🛏️"] },
  { title: "Fazer escolhas", description: "Ofereça alternativas para tornar as decisões do dia a dia mais acessíveis.", labels: ["Café","Suco"], icons:["☕","🧃"] },
  { title: "Participar de atividades", description: "Atividades estruturadas que podem complementar a estimulação da linguagem.", labels: ["Casa","Feliz","Ler","Comer"], icons:["🏠","🙂","📖","🍎"] },
];
const pages = [
  { title:"Pranchas de comunicação", labels:["Sim","Não","Quero","Ajuda"], icons:["✅","❌","👋","🤝"] },
  { title:"Necessidades básicas", labels:["Água","Comida","Banheiro","Descanso"], icons:["💧","🍽️","🚻","🛏️"] },
  { title:"Emoções e sentimentos", labels:["Feliz","Triste","Com dor","Calmo"], icons:["🙂","😢","😣","😌"] },
  { title:"Atividades de nomeação", labels:["Livro","Chave","Copo","Telefone"], icons:["📖","🔑","🥛","📱"] },
  { title:"Rotinas do cotidiano", labels:["Acordar","Comer","Passear","Dormir"], icons:["🌞","🍽️","🚶","🌙"] },
  { title:"Orientações para familiares", labels:["Dar tempo","Escolher","Observar","Acolher"], icons:["⏳","🗣️","👀","💚"] },
];
const faq = [
  ["O produto é físico ou digital?","O material é 100% digital, disponibilizado em PDF. Nenhum produto físico será enviado."],
  ["Posso imprimir quantas vezes precisar?","Sim, você pode imprimir o material para uso pessoal ou profissional conforme os termos de licença. A redistribuição e a revenda dos arquivos não são permitidas."],
  ["Familiares conseguem utilizar o material?","Sim. O kit inclui recursos visuais e orientações acessíveis. Para escolher atividades adequadas às necessidades da pessoa, recomenda-se acompanhamento de um profissional de saúde habilitado."],
  ["Serve para pessoas que não conseguem falar?","Algumas pranchas podem apoiar formas alternativas de comunicação, conforme as capacidades e necessidades individuais. A adequação deve ser avaliada por um fonoaudiólogo."],
  ["Como recebo meu acesso?","Após a confirmação do pagamento, as instruções de acesso são enviadas ao e-mail cadastrado."],
  ["Preciso informar meu CPF?","O CPF pode ser solicitado pela plataforma de pagamento para identificação da compra e cumprimento de obrigações fiscais e de segurança."],
  ["O kit substitui a fonoaudiologia?","Não. É um recurso complementar de apoio à comunicação e não substitui avaliação ou tratamento individualizado."],
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
function Landing(){
  const [notice,setNotice]=useState(false);
  const [slide,setSlide]=useState(0);
  const [example,setExample]=useState(0);
  const slideRef=useRef<HTMLDivElement>(null);
  const exampleRef=useRef<HTMLDivElement>(null);
  const offerRef=useRef<HTMLElement>(null);
  function checkout(){
    if (CHECKOUT_URL) {
      try {
        const url=new URL(CHECKOUT_URL);
        if(url.protocol==="https:"){
          const params=new URLSearchParams(window.location.search);
          TRACKING.forEach(k=>{ const v=params.get(k); if(v && v.length<501 && !url.searchParams.has(k)) url.searchParams.set(k,v); });
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
      <div className="hero-text"><span className="hero-label">COMUNICAÇÃO PÓS-AVC • FAMÍLIA E PROFISSIONAIS</span><h1>Mais <em>comunicação</em> e <em>autonomia</em> nas pequenas situações do dia a dia.</h1><p>Pranchas ilustradas e atividades práticas para apoiar a comunicação após o AVC, facilitar escolhas e ajudar familiares e profissionais na rotina.</p>
      <div className="hero-mobile"><Mockup/></div>{buyButton("QUERO MEU KIT COMPLETO")}<div className="checks"><span><Check/> Material digital em PDF</span><span><Check/> Pronto para imprimir</span><span><Check/> Pagamento único</span></div><small className="medical">Material complementar. Não substitui acompanhamento fonoaudiológico individualizado.</small></div>
      <div className="hero-desktop"><Mockup/></div>
    </section>
    <section className="section container"><Heading tag="PARA O DIA A DIA" title="Uma imagem pode facilitar uma conversa." subtitle="Veja como recursos simples podem apoiar a comunicação em diferentes momentos do cotidiano."/>
      <div className="example-track" ref={exampleRef} onScroll={()=>scrolled(exampleRef,setExample)}>{previews.map((p,i)=><article className="example-card" key={p.title}><div className="example-image"><Board labels={p.labels} icons={p.icons}/></div><div className="card-text"><span className="eyebrow">0{i+1}</span><h3>{p.title}</h3><p>{p.description}</p></div></article>)}</div>
      <div className="dots">{previews.map((p,i)=><button aria-label={"Ver exemplo "+(i+1)} aria-current={example===i?"true":undefined} key={p.title} className={example===i?"on":""} onClick={()=>go(exampleRef,i,setExample)}/>)}</div>
    </section>
    <section className="section kit"><div className="container"><Heading tag="CONHEÇA O KIT" title="Conheça os materiais que você vai receber." subtitle="Recursos organizados e preparados para uso digital ou impressão. As imagens são prévias demonstrativas até a chegada dos arquivos finais."/>
      <div className="viewer"><div className="viewer-top"><span>PRÉVIAS DEMONSTRATIVAS</span><span>{slide+1} / {pages.length}</span></div><div className="page-track" ref={slideRef} onScroll={()=>scrolled(slideRef,setSlide)}>{pages.map(p=><div className="page-slide" key={p.title}><Board labels={p.labels} icons={p.icons}/><h3>{p.title}</h3></div>)}</div><div className="viewer-bottom"><button aria-label="Anterior" onClick={()=>go(slideRef,Math.max(0,slide-1),setSlide)}><ChevronLeft/></button><div className="progress"><span style={{width:((slide+1)/pages.length*100)+"%"}}/></div><button aria-label="Próximo" onClick={()=>go(slideRef,Math.min(pages.length-1,slide+1),setSlide)}><ChevronRight/></button></div></div>
      <div className="checks centered"><span><Check/> Arquivos digitais</span><span><Check/> Formato A4</span><span><Check/> Uso em casa ou consultório</span></div>
    </div></section>
    <section className="section container"><Heading tag="PENSADO PARA VOCÊ" title="Um recurso para quem cuida e para quem acompanha."/><div className="audiences">
      <article className="audience"><div className="audience-visual"><HeartHandshake size={56}/><span>FAMÍLIAS E CUIDADORES</span></div><div className="audience-copy"><span className="eyebrow">PARA FAMÍLIAS E CUIDADORES</span><h3>Mais possibilidades de comunicação em casa.</h3><p>Utilize pranchas e atividades simples para oferecer escolhas, identificar necessidades e favorecer momentos de interação no cotidiano.</p><ul><li>Recursos visuais fáceis de compreender</li><li>Atividades para a rotina</li><li>Orientações para familiares</li></ul></div></article>
      <article className="audience"><div className="audience-visual professional"><MessageCircle size={56}/><span>FONOAUDIÓLOGOS</span></div><div className="audience-copy"><span className="eyebrow">PARA FONOAUDIÓLOGOS</span><h3>Materiais prontos para apoiar suas sessões.</h3><p>Tenha recursos organizados para adaptar às necessidades de seus pacientes e complementar o acompanhamento profissional.</p><ul><li>Pranchas de comunicação alternativa</li><li>Atividades estruturadas</li><li>Recursos para orientação familiar</li></ul></div></article>
    </div><p className="placeholder-note">As imagens de pessoas serão adicionadas quando forem fornecidas ou aprovadas.</p></section>
    <section className="section offer" id="oferta" ref={offerRef}><div className="container"><Heading tag="ACESSO DIGITAL" title="Tenha o Kit Comunicação Pós-AVC em suas mãos."/><div className="offer-box"><div className="offer-banner"><FileText size={18}/> KIT DIGITAL COMPLETO</div><div className="offer-inner"><div className="offer-image"><Mockup/></div><div className="offer-info"><p className="inclusion-caption">Conteúdos previstos — confirmar nos PDFs finais:</p><ul>{["Pranchas de comunicação funcional","Cards de necessidades e emoções","Atividades práticas de linguagem","Recursos para o cotidiano","Orientações de utilização","Arquivos em PDF para impressão"].map(x=><li key={x}><Check size={18}/>{x}</li>)}</ul><div className="pricing"><span>Pagamento único</span><strong><small>R$</small> 17,90</strong><p>Sem mensalidades.</p></div>{buyButton("QUERO ACESSAR O KIT AGORA")}{notice&&<p className="notice" role="status">Checkout ainda não configurado. Nenhuma cobrança foi iniciada.</p>}<div className="security"><LockKeyhole size={14}/> Compra segura • Acesso após confirmação • 100% digital</div></div></div></div></div></section>
    <section className="section container"><div className="faq-layout"><div className="guarantee"><ShieldCheck size={40}/><h2>Sua compra com tranquilidade.</h2><p>Você conta com os direitos previstos para compras realizadas pela internet, incluindo o direito de arrependimento no prazo de 7 dias, conforme a legislação aplicável, e pode solicitar suporte pelos canais informados na compra.</p><small>Recurso complementar; não substitui avaliação ou tratamento individualizado.</small></div><div className="faq"><h2>Dúvidas frequentes</h2>{faq.map(([q,a])=><details key={q}><summary>{q}<span aria-hidden="true">+</span></summary><p>{a}</p></details>)}</div></div></section>
    <section className="final-cta"><div className="container"><MessageCircle size={35}/><h2>Pequenas escolhas também fazem parte da comunicação.</h2><p>Conheça recursos visuais e atividades que podem apoiar a participação nas conversas e situações do cotidiano.</p>{buyButton("QUERO MEU KIT COMPLETO")}<small>PDF digital • Material para impressão • Pagamento único</small></div></section>
    <footer><div className="container"><strong>Kit Comunicação Pós-AVC</strong><p>Material complementar de apoio à comunicação. Não substitui acompanhamento profissional.</p><small>© {new Date().getFullYear()} • Todos os direitos reservados.</small></div></footer>
  </main>;
}
