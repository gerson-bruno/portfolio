import { useEffect, useRef, useState } from 'react';
import { BurnTransition } from './components/BurnTransition/BurnTransition';

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const isLightRef = useRef(false);

  useEffect(() => {
    let rafPending = false;

    const applyTheme = () => {
      rafPending = false;
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      
      const shouldBeLight = window.scrollY > totalScroll * 0.39;
      if (shouldBeLight === isLightRef.current) return;
      isLightRef.current = shouldBeLight;

      const container = containerRef.current;
      const header    = headerRef.current;
      if (container) {
        container.classList.toggle('theme-light', shouldBeLight);
        container.classList.toggle('theme-dark',  !shouldBeLight);
      }
      if (header) {
        header.classList.toggle('header-light', shouldBeLight);
        header.classList.toggle('header-dark',  !shouldBeLight);
      }
    };

    const handleScroll = () => {
      if (!rafPending) {
        rafPending = true;
        requestAnimationFrame(applyTheme);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    applyTheme();

    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          entry.target.classList.toggle('active', entry.isIntersecting);
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -50px 0px' },
    );
    revealElements.forEach(el => revealObserver.observe(el));

    return () => {
      revealObserver.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const toggleMenu = () => setMenuOpen(o => !o);
  const closeMenu  = () => setMenuOpen(false);
  const currentYear = new Date().getFullYear();

  return (
    <>
      <div className="noise-overlay" />
<BurnTransition
  color="#f2f2f2"
  scrollStart={0.35}
  scrollEnd={0.62}
  noiseScale={0.12}
  noiseIntensity={0.85}
  edgeSoftness={0.82}
  baseAnimationSpeed={0.04}
  bloomIntensity={0}
/>

      <div
        ref={containerRef}
        className="container theme-dark"
        style={{ position: 'relative', zIndex: 3 }}
      >
        <header ref={headerRef as React.RefObject<HTMLElement>} className="header-dark">
          <div className="logo">
            &lt;Gerson<span className="logo-bold"> Bruno</span> /&gt;
          </div>

          <button className="mobile-menu-btn" aria-label="Toggle menu" onClick={toggleMenu}>
            <i className={`fas ${menuOpen ? 'fa-times' : 'fa-bars'}`} />
          </button>

          <nav className={menuOpen ? 'show' : ''}>
            <ul className="nav-links">
              <li><a href="#home"     className="active" onClick={closeMenu}>Início</a></li>
              <li><a href="#about"    onClick={closeMenu}>Sobre</a></li>
              <li><a href="#skills"   onClick={closeMenu}>Habilidades</a></li>
              <li><a href="#projects" onClick={closeMenu}>Projetos</a></li>
              <li><a href="#contact"  onClick={closeMenu}>Contato</a></li>
            </ul>
          </nav>
        </header>

        <main>
          <section id="home" className="hero">
            <div className="hero-left reveal">
              <div className="hero-intro">
                <h1>
                  Olá, eu sou<br /><span className="highlight">Gerson Bruno.</span>
                </h1>
                <div className="decorative-arrow">
                  <svg width="220" height="150" viewBox="0 0 220 150" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M 210 100 C 160 -20, 80 200, 25 50" strokeWidth="2" strokeDasharray="6 8" fill="none" className="arrow-path" />
                    <path d="M 20 60 L 25 50 L 32 55" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="arrow-path" />
                  </svg>
                </div>
              </div>
              <div className="social-links">
                <a href="https://github.com/gerson-bruno"                aria-label="GitHub"    target="_blank" rel="noreferrer"><i className="fab fa-github" /></a>
                <a href="https://www.linkedin.com/in/gerson-bruno-baptista/" aria-label="LinkedIn"  target="_blank" rel="noreferrer"><i className="fab fa-linkedin-in" /></a>
                <a href="mailto:gersonbrunobaptista@gmail.com"           aria-label="E-mail"               ><i className="fas fa-envelope" /></a>
                <a href="https://wa.link/00ywzj"                         aria-label="WhatsApp"  target="_blank" rel="noreferrer"><i className="fab fa-whatsapp" /></a>
              </div>
            </div>

            <div className="hero-center reveal delay-1">
              <div className="image-wrapper">
                <div className="image-circle-frame" />
                <img src="/img/portrait.png" alt="Gerson Bruno Portrait" className="portrait-img" />
              </div>
            </div>

            <div className="hero-right reveal delay-2">
              <div className="quote-block">
                <p>Criando interfaces modernas que aproximam pessoas e ideias.</p>
              </div>
              <div className="cv-download-block">
                <a href="/docs/Gerson_Bruno_Baptista_Desenvolvedor_Frontend.pdf" download className="btn btn-primary btn-download">
                  Download CV <i className="fas fa-download" />
                </a>
              </div>
              <div className="signature">
                Front-end <br /><span className="signature-sub">Developer.</span>
              </div>
            </div>
          </section>

          <section id="about" className="landing-section reveal">
            <h2 className="section-title">Sobre</h2>
            <div className="about-content">
              <div className="about-image">
                <img src="/img/portrait-about.png" alt="Retrato Gerson Bruno" />
              </div>
              <article className="about-text">
                <p>Desenvolvedor Front-End com um olhar atento à experiência do usuário e à resolução de problemas reais.</p>
                <p>Graduado em Fisioterapia, com 10 anos de atuação na área da saúde, hoje aplico esse background analítico na área de desenvolvimento. Atualmente cursando Análise e Desenvolvimento de Sistemas pela UNINTER e Residente em TIC-12 (Trilha Full Stack) pela Universidade Federal do Ceará (UFC).</p>
                <p>Acredito que a tecnologia é uma ferramenta poderosa para simplificar processos e aproximar pessoas. Meu objetivo é construir aplicações onde a complexidade do código se transforma em uma interface simples, elegante e eficiente para quem a utiliza.</p>
              </article>
            </div>
          </section>

          <section id="skills" className="landing-section reveal">
            <h2 className="section-title">Habilidades</h2>
            <article className="section-content about-text">
              <p>Experiência prática com o ecossistema moderno de JavaScript, incluindo React e Vue 3, com gerenciamento de estado global via Context API e Pinia, e tipagem estática com TypeScript.</p>
              <p>Valorizo código limpo, versionamento semântico com Git e sistemas fáceis de manter e escalar — hábitos que trouxe da área da saúde, onde organização e precisão não são opcionais.</p>
              <div className="skills-icons">
                <i className="fab fa-html5 skill-icon html-icon" title="HTML5" />
                <i className="fab fa-css3-alt skill-icon css-icon" title="CSS3" />
                <i className="fab fa-js skill-icon js-icon" title="JavaScript" />
                <div className="ts-icon skill-icon" title="TypeScript">TS</div>
                <i className="fab fa-react skill-icon react-icon" title="React" />
                <i className="fab fa-vuejs skill-icon vue-icon" title="Vue.js" />
                <i className="fab fa-node-js skill-icon node-icon" title="Node.js" />
                <i className="fab fa-git-alt skill-icon git-icon" title="Git" />
              </div>
            </article>
          </section>

          <section id="projects" className="landing-section reveal">
            <h2 className="section-title">Projetos</h2>
            <div className="projects-grid">
              <div className="project-card">
                <img src="/img/work1.jpg" alt="ReabilitaSys" className="project-img" loading="lazy" />
                <div className="project-info">
                  <p className="project-desc project-desc-sm">ReabilitaSys - Gestão para fisioterapia:</p>
                  <p className="project-desc">Sistema web completo para gestão de clínicas de fisioterapia. Permite controle financeiro, agendamento de pacientes, prontuários, evoluções, alta e gerenciamento de pacientes ativos e inativos.</p>
                  <div className="tech-tags">
                    <span className="tech-tag">HTML</span><span className="tech-tag">CSS</span><span className="tech-tag">React</span><span className="tech-tag">TypeScript</span><span className="tech-tag">Vite</span>
                  </div>
                  <div className="project-links">
                    <a href="https://gerson-bruno.github.io/ReabilitaSys/"               className="project-link" target="_blank" rel="noopener noreferrer">Ver projeto <i className="fas fa-external-link-alt" /></a>
                    <a href="https://github.com/gerson-bruno/ReabilitaSys"               className="project-link" target="_blank" rel="noopener noreferrer">Ver código <i className="fab fa-github" /></a>
                  </div>
                </div>
              </div>

              <div className="project-card">
                <img src="/img/work2.jpg" alt="Todolist" className="project-img" loading="lazy" />
                <div className="project-info">
                  <p className="project-desc project-desc-sm">VestibuTrain:</p>
                  <p className="project-desc">Ferramenta clínica para reabilitação visual e vestibular com 7 modalidades de exercícios. Desenvolvida a partir da prática como fisioterapeuta, reúne em um só lugar o que antes exigia improvisos na sessão — com animações fluidas a 60fps e suporte a tela cheia.</p>
                  <div className="tech-tags">
                    <span className="tech-tag">HTML</span><span className="tech-tag">CSS</span><span className="tech-tag">JavaScript</span><span className="tech-tag">requestAnimationFrame</span><span className="tech-tag">Fullscreen API</span>
                  </div>
                  <div className="project-links">
                    <a href="https://gerson-bruno.github.io/vestibutrain/"               className="project-link" target="_blank" rel="noopener noreferrer">Ver projeto <i className="fas fa-external-link-alt" /></a>
                    <a href="https://github.com/gerson-bruno/vestibutrain"               className="project-link" target="_blank" rel="noopener noreferrer">Ver código <i className="fab fa-github" /></a>
                  </div>
                </div>
              </div>

              <div className="project-card">
                <img src="/img/work3.jpg" alt="GersonBot" className="project-img" loading="lazy" />
                <div className="project-info">
                  <p className="project-desc project-desc-sm">Chatbot:</p>
                  <p className="project-desc">Chatbot inteligente integrado à API Gemini do Google para processamento de linguagem natural. Oferece uma interface interativa capaz de fornecer respostas contextualizadas, assistência em tempo real e automação de tarefas simples.</p>
                  <div className="tech-tags">
                    <span className="tech-tag">HTML</span><span className="tech-tag">CSS</span><span className="tech-tag">JavaScript</span><span className="tech-tag">Node.js</span><span className="tech-tag">API de IA</span>
                  </div>
                  <div className="project-links">
                    <a href="https://gersonbot.onrender.com/"                            className="project-link" target="_blank" rel="noopener noreferrer">Ver projeto <i className="fas fa-external-link-alt" /></a>
                    <a href="https://github.com/gerson-bruno/gersonbot"                  className="project-link" target="_blank" rel="noopener noreferrer">Ver código <i className="fab fa-github" /></a>
                  </div>
                </div>
              </div>

              <div className="project-card">
                <img src="/img/work4.jpg" alt="Urban Blend" className="project-img" loading="lazy" />
                <div className="project-info">
                  <p className="project-desc project-desc-sm">Urban Blend:</p>
                  <p className="project-desc">E-commerce de nicho urbano desenvolvido no Hackathon da Residência em TIC-12 (UFC). Apresenta um fluxo de compra fluido com carrinho reativo, gerenciamento de estado global e interface minimalista focada na experiência do usuário.</p>
                  <div className="tech-tags">
                    <span className="tech-tag">Vue 3 + Vite</span><span className="tech-tag">Tailwind CSS</span><span className="tech-tag">TypeScript</span><span className="tech-tag">Pinia</span><span className="tech-tag">Vue Router</span>
                  </div>
                  <div className="project-links">
                    <a href="https://gerson-bruno.github.io/urban-blend/"                className="project-link" target="_blank" rel="noopener noreferrer">Ver projeto <i className="fas fa-external-link-alt" /></a>
                    <a href="https://github.com/gerson-bruno/urban-blend"                className="project-link" target="_blank" rel="noopener noreferrer">Ver código <i className="fab fa-github" /></a>
                  </div>
                </div>
              </div>

              <div className="project-card">
                <img src="/img/work5.jpg" alt="Gerador de QR Code" className="project-img" loading="lazy" />
                <div className="project-info">
                  <p className="project-desc project-desc-sm">Lume Clima:</p>
                  <p className="project-desc">O Lume é uma aplicação web minimalista e funcional desenvolvida para fornecer informações meteorológicas precisas de cidades em todo o mundo. Utilizando a API do WeatherAPI, o projeto foca em uma experiência de usuário direta, rápida e com um design moderno.</p>
                  <div className="tech-tags">
                    <span className="tech-tag">HTML</span><span className="tech-tag">CSS</span><span className="tech-tag">JavaScript</span><span className="tech-tag">Vite</span><span className="tech-tag">API REST</span>
                  </div>
                  <div className="project-links">
                    <a href="https://lume-clima.vercel.app/"                              className="project-link" target="_blank" rel="noopener noreferrer">Ver projeto <i className="fas fa-external-link-alt" /></a>
                    <a href="https://github.com/gerson-bruno/lume-clima"                  className="project-link" target="_blank" rel="noopener noreferrer">Ver código <i className="fab fa-github" /></a>
                  </div>
                </div>
              </div>

              <div className="project-card">
                <img src="/img/work6.jpg" alt="Landing Page: Doe Sangue, salve vidas." className="project-img" loading="lazy" />
                <div className="project-info">
                  <p className="project-desc project-desc-sm">Landing Page: Doe Sangue. Salve Vidas.</p>
                  <p className="project-desc">Interface informativa com lógica em JavaScript para consulta de compatibilidade sanguínea. Permite a verificação dinâmica de doadores e receptores através de um sistema de filtragem instantânea baseado no tipo sanguíneo selecionado.</p>
                  <div className="tech-tags">
                    <span className="tech-tag">HTML</span><span className="tech-tag">CSS</span><span className="tech-tag">JavaScript</span>
                  </div>
                  <div className="project-links">
                    <a href="https://gerson-bruno.github.io/estudos/javascript/estudos-autorais/doe-sangue-salve-vidas/" className="project-link" target="_blank" rel="noopener noreferrer">Ver projeto <i className="fas fa-external-link-alt" /></a>
                    <a href="https://github.com/gerson-bruno/estudos/tree/main/javascript/estudos-autorais/doe-sangue-salve-vidas" className="project-link" target="_blank" rel="noopener noreferrer">Ver código <i className="fab fa-github" /></a>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section id="contact" className="landing-section reveal">
            <h2 className="section-title">Contato</h2>
            <div className="section-content">
              <div className="contact-links-list">
                <a href="https://wa.link/00ywzj"                              target="_blank" className="contact-link" rel="noopener noreferrer"><i className="fab fa-whatsapp" />+55 16 99235-4138</a>
                <a href="mailto:gersonbrunobaptista@gmail.com"                            className="contact-link" rel="noopener noreferrer"><i className="fas fa-envelope" />gersonbrunobaptista@gmail.com</a>
                <a href="https://www.linkedin.com/in/gerson-bruno-baptista/"  target="_blank" className="contact-link" rel="noopener noreferrer"><i className="fab fa-linkedin-in" />LinkedIn</a>
                <a href="https://github.com/gerson-bruno"                     target="_blank" className="contact-link" rel="noopener noreferrer"><i className="fab fa-github" />GitHub</a>
              </div>
            </div>
          </section>
        </main>

        <footer className="footer reveal">
          <div className="footer-content">
            <div className="logo-footer"><span className="logo-bold">Gerson </span>Bruno.</div>
            <p>&copy; {currentYear} - Tem uma ideia em mente? Adoraria ouvir sobre ela.</p>
            <div className="social-links footer-socials">
              <a href="https://github.com/gerson-bruno"                aria-label="GitHub"    target="_blank" rel="noopener noreferrer"><i className="fab fa-github" /></a>
              <a href="https://www.linkedin.com/in/gerson-bruno-baptista/" aria-label="LinkedIn"  target="_blank" rel="noopener noreferrer"><i className="fab fa-linkedin-in" /></a>
              <a href="mailto:gersonbrunobaptista@gmail.com"           aria-label="E-mail"    rel="noopener noreferrer"                  ><i className="fas fa-envelope" /></a>
              <a href="https://wa.link/00ywzj"                         aria-label="WhatsApp"  target="_blank" rel="noopener noreferrer"><i className="fab fa-whatsapp" /></a>
            </div>
          </div>
          <p>Desenvolvido com React e TypeScript.</p>
        </footer>
      </div>
    </>
  );
}

export default App;