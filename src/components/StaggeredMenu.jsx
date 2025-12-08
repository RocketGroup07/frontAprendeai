import React, { useCallback, useLayoutEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { GiHamburgerMenu } from 'react-icons/gi';
import { TbLogout2 } from "react-icons/tb";
import { FaUserCircle } from 'react-icons/fa';
import { useAuth } from '../components/UserAuth.jsx';
import logo from '../../public/images/logoAp.png';
import { useNavigate, useParams } from 'react-router-dom';
import { CiLogout } from "react-icons/ci";
import { api } from '../lib/axios';
import { toast } from 'react-toastify';

export const StaggeredMenu = ({
    position = 'right',
    colors = ['var(--secondary)', 'var(--main)'],
    displayItemNumbering = false,
    className,
    items,
    logoUrl = logo,
    menuButtonColor = '#fff',
    openMenuButtonColor = '#fff',
    changeMenuColorOnOpen = true,
    accentColor = '#2A2A2A',
    onMenuOpen,
    onMenuClose,
    turmaId
}) => {

    // se items NÃO for passado via props → usa este default abaixo:
    const defaultItems = [
        { label: 'Turmas', link: '/turmas' },
        { label: 'Histórico', link: `/historico/${turmaId}` },
        { label: 'Chamada', link: `/professor/${turmaId}` },
        { label: 'Relatório', action: `relatorio` },
    ];

    items = items && items.length ? items : defaultItems;

    const handleGenerateReportLocal = async (turmaId) => {
        try {
            const response = await api.get(`/api/chamada/relatorio/${turmaId}`, {
                responseType: 'blob'
            });
            const disposition = response.headers?.['content-disposition'] || response.headers?.['Content-Disposition'];
            let filename = 'relatorio.pdf';
            if (disposition) {
                const m = disposition.match(/filename\*?=(?:UTF-8'')?["']?([^;"']+)["']?/i);
                if (m && m[1]) filename = decodeURIComponent(m[1].replace(/["']/g, ''));
            }
            const blob = new Blob([response.data], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
            toast.success("Download iniciado");
        } catch (err) {
            console.error("Erro ao gerar relatório:", err);
            toast.error("Erro ao gerar relatório");
        }
    };


    const { isProfessor, isAluno, usuario, logout } = useAuth();

    const [open, setOpen] = useState(false);
    const openRef = useRef(false);

    const panelRef = useRef(null);
    const preLayersRef = useRef(null);
    const preLayerElsRef = useRef([]);

    const textInnerRef = useRef(null);
    const textWrapRef = useRef(null);

    const openTlRef = useRef(null);
    const closeTweenRef = useRef(null);
    const spinTweenRef = useRef(null);
    const textCycleAnimRef = useRef(null);
    const colorTweenRef = useRef(null);

    const toggleBtnRef = useRef(null);
    const busyRef = useRef(false);

    const itemEntranceTweenRef = useRef(null);

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            const panel = panelRef.current;
            const preContainer = preLayersRef.current;

            if (panel != null) {




                const textInner = textInnerRef.current;

                let preLayers = [];
                if (preContainer) {
                    preLayers = Array.from(preContainer.querySelectorAll('.sm-prelayer'));
                }
                preLayerElsRef.current = preLayers;

                const offscreen = position === 'left' ? -100 : 100;
                gsap.set([panel, ...preLayers], { xPercent: offscreen });


                gsap.set(textInner, { yPercent: 0 });

                if (toggleBtnRef.current) gsap.set(toggleBtnRef.current, { color: menuButtonColor });

            }
        });
        return () => ctx.revert();
    }, [menuButtonColor, position]);

    // Novo useLayoutEffect para resetar posição quando turmaId muda
    useLayoutEffect(() => {
        if (turmaId && !openRef.current) {
            const panel = panelRef.current;
            const preContainer = preLayersRef.current;
            
            if (panel) {
                const offscreen = position === 'left' ? -100 : 100;
                
                let preLayers = [];
                if (preContainer) {
                    preLayers = Array.from(preContainer.querySelectorAll('.sm-prelayer'));
                }
                
                // Força o reset da posição quando turmaId é carregado
                gsap.set([panel, ...preLayers], { xPercent: offscreen });
            }
        }
    }, [turmaId, position]);

    const buildOpenTimeline = useCallback(() => {
        const panel = panelRef.current;
        const layers = preLayerElsRef.current;
        if (!panel) return null;

        openTlRef.current?.kill();
        if (closeTweenRef.current) {
            closeTweenRef.current.kill();
            closeTweenRef.current = null;
        }
        itemEntranceTweenRef.current?.kill();

        const itemEls = Array.from(panel.querySelectorAll('.sm-panel-itemLabel'));
        const numberEls = Array.from(panel.querySelectorAll('.sm-panel-list[data-numbering] .sm-panel-item'));
        const socialTitle = panel.querySelector('.sm-socials-title');
        const socialLinks = Array.from(panel.querySelectorAll('.sm-socials-link'));

        const layerStates = layers.map(el => ({ el, start: Number(gsap.getProperty(el, 'xPercent')) }));
        const panelStart = Number(gsap.getProperty(panel, 'xPercent'));

        if (itemEls.length) gsap.set(itemEls, { yPercent: 140, rotate: 10 });
        if (numberEls.length) gsap.set(numberEls, { ['--sm-num-opacity']: 0 });
        if (socialTitle) gsap.set(socialTitle, { opacity: 0 });
        if (socialLinks.length) gsap.set(socialLinks, { y: 25, opacity: 0 });

        const tl = gsap.timeline({ paused: true });

        layerStates.forEach((ls, i) => {
            tl.fromTo(ls.el, { xPercent: ls.start }, { xPercent: 0, duration: 0.5, ease: 'power4.out' }, i * 0.07);
        });

        const lastTime = layerStates.length ? (layerStates.length - 1) * 0.07 : 0;
        const panelInsertTime = lastTime + (layerStates.length ? 0.08 : 0);
        const panelDuration = 0.65;

        tl.fromTo(
            panel,
            { xPercent: panelStart },
            { xPercent: 0, duration: panelDuration, ease: 'power4.out' },
            panelInsertTime
        );

        if (itemEls.length) {
            const itemsStartRatio = 0.15;
            const itemsStart = panelInsertTime + panelDuration * itemsStartRatio;

            tl.to(
                itemEls,
                { yPercent: 0, rotate: 0, duration: 1, ease: 'power4.out', stagger: { each: 0.1, from: 'start' } },
                itemsStart
            );

            if (numberEls.length) {
                tl.to(
                    numberEls,
                    { duration: 0.6, ease: 'power2.out', ['--sm-num-opacity']: 1, stagger: { each: 0.08, from: 'start' } },
                    itemsStart + 0.1
                );
            }
        }

        if (socialTitle || socialLinks.length) {
            const socialsStart = panelInsertTime + panelDuration * 0.4;

            if (socialTitle) tl.to(socialTitle, { opacity: 1, duration: 0.5, ease: 'power2.out' }, socialsStart);
            if (socialLinks.length) {
                tl.to(
                    socialLinks,
                    {
                        y: 0,
                        opacity: 1,
                        duration: 0.55,
                        ease: 'power3.out',
                        stagger: { each: 0.08, from: 'start' },
                        onComplete: () => gsap.set(socialLinks, { clearProps: 'opacity' })
                    },
                    socialsStart + 0.04
                );
            }
        }

        openTlRef.current = tl;
        return tl;
    }, []);

    const playOpen = useCallback(() => {
        if (busyRef.current) return;
        busyRef.current = true;
        const tl = buildOpenTimeline();
        if (tl) {
            tl.eventCallback('onComplete', () => {
                busyRef.current = false;
            });
            tl.play(0);
        } else {
            busyRef.current = false;
        }
    }, [buildOpenTimeline]);

    const playClose = useCallback(() => {
        openTlRef.current?.kill();
        openTlRef.current = null;
        itemEntranceTweenRef.current?.kill();

        const panel = panelRef.current;
        const layers = preLayerElsRef.current;
        if (!panel) return;

        const all = [...layers, panel];
        closeTweenRef.current?.kill();

        const offscreen = position === 'left' ? -100 : 100;

        closeTweenRef.current = gsap.to(all, {
            xPercent: offscreen,
            duration: 0.32,
            ease: 'power3.in',
            overwrite: 'auto',
            onComplete: () => {
                const itemEls = Array.from(panel.querySelectorAll('.sm-panel-itemLabel'));
                if (itemEls.length) gsap.set(itemEls, { yPercent: 140, rotate: 10 });

                const numberEls = Array.from(panel.querySelectorAll('.sm-panel-list[data-numbering] .sm-panel-item'));
                if (numberEls.length) gsap.set(numberEls, { ['--sm-num-opacity']: 0 });

                const socialTitle = panel.querySelector('.sm-socials-title');
                const socialLinks = Array.from(panel.querySelectorAll('.sm-socials-link'));
                if (socialTitle) gsap.set(socialTitle, { opacity: 0 });
                if (socialLinks.length) gsap.set(socialLinks, { y: 25, opacity: 0 });

                busyRef.current = false;
            }
        });
    }, [position]);

    const animateColor = useCallback(
        opening => {
            const btn = toggleBtnRef.current;
            if (!btn) return;
            colorTweenRef.current?.kill();
            if (changeMenuColorOnOpen) {
                const targetColor = opening ? openMenuButtonColor : menuButtonColor;
                colorTweenRef.current = gsap.to(btn, { color: targetColor, delay: 0.18, duration: 0.3, ease: 'power2.out' });
            } else {
                gsap.set(btn, { color: menuButtonColor });
            }
        },
        [openMenuButtonColor, menuButtonColor, changeMenuColorOnOpen]
    );

    React.useEffect(() => {
        if (toggleBtnRef.current) {
            if (changeMenuColorOnOpen) {
                const targetColor = openRef.current ? openMenuButtonColor : menuButtonColor;
                gsap.set(toggleBtnRef.current, { color: targetColor });
            } else {
                gsap.set(toggleBtnRef.current, { color: menuButtonColor });
            }
        }
    }, [changeMenuColorOnOpen, menuButtonColor, openMenuButtonColor]);

    const animateText = useCallback(opening => {
        const inner = textInnerRef.current;
        if (!inner) return;

        textCycleAnimRef.current?.kill();

        const currentLabel = opening ? 'Menu' : 'Close';
        const targetLabel = opening ? 'Close' : 'Menu';
        const cycles = 3;

        const seq = [currentLabel];
        let last = currentLabel;
        for (let i = 0; i < cycles; i++) {
            last = last === 'Menu' ? 'Close' : 'Menu';
            seq.push(last);
        }
        if (last !== targetLabel) seq.push(targetLabel);
        seq.push(targetLabel);

        const lineCount = seq.length;
        const finalShift = ((lineCount - 1) / lineCount) * 100;

        textCycleAnimRef.current = gsap.to(inner, {
            yPercent: -finalShift,
            duration: 0.5 + lineCount * 0.07,
            ease: 'power4.out'
        });
    }, []);

    const toggleMenu = useCallback(() => {
        const target = !openRef.current;
        openRef.current = target;
        setOpen(target);

        if (target) {
            onMenuOpen?.();
            playOpen();
        } else {
            onMenuClose?.();
            playClose();
        }

        animateColor(target);  // opcional
        animateText(target);   // opcional
    }, [playOpen, playClose, animateColor, animateText, onMenuOpen, onMenuClose]);

    const userName = usuario?.nome || "Usuário";
    const navigate = useNavigate();
    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <div className="sm-scope w-full h-full">
            <div
                className={(className ? className + ' ' : '') + 'staggered-menu-wrapper relative w-full h-full z-40'}
                style={accentColor ? { ['--sm-accent']: accentColor } : undefined}
                data-position={position}
                data-open={open || undefined}
            >
                {isProfessor && turmaId && (<div
                    ref={preLayersRef}
                    className="sm-prelayers fixed top-0 right-0 h-screen pointer-events-none z-[5]"
                    aria-hidden="true"
                >
                    {(() => {
                        const raw = colors && colors.length ? colors.slice(0, 4) : ['#1e1e22', '#35353c'];
                        let arr = [...raw];
                        if (arr.length >= 3) {
                            const mid = Math.floor(arr.length / 2);
                            arr.splice(mid, 1);
                        }
                        return arr.map((c, i) => (
                            <div
                                key={i}
                                className="sm-prelayer absolute top-0 right-0 h-full w-full translate-x-0"
                                style={{ background: c }}
                            />
                        ));
                    })()}
                </div>)}

                <header
                    className="staggered-menu-header absolute top-0 left-0 w-full p-[2em] bg-[#D00909] pointer-events-none z-20"
                    aria-label="Main navigation header"
                >
                    <div className='w-[93%] items-center flex justify-between mx-auto'>
                        <div className="sm-logo flex items-center select-none pointer-events-auto" aria-label="Logo">
                            <img
                                src={logoUrl || '/src/assets/logos/reactbits-gh-white.svg'}
                                alt="Logo"
                                className="sm-logo-img block h-8 w-auto object-contain"
                                draggable={false}
                                width={110}
                                height={24}
                            />
                        </div>
                        <div className='flex gap-x-4'>
                            <p className='text-white text-[25px] font-[400]'>{userName}</p>
                            <div className="text-white">
                                <FaUserCircle size={32} />
                            </div>
                            <button
                                ref={toggleBtnRef}
                                className="sm-toggle relative inline-flex items-center bg-transparent cursor-pointer text-[#e9e9ef] font-medium leading-none overflow-visible pointer-events-auto"
                                aria-label={open ? 'Close menu' : 'Open menu'}
                                aria-expanded={open}
                                aria-controls="staggered-menu-panel"
                                onClick={toggleMenu}
                                type="button"
                            >
                                {/* Logout do aluno */}
                                {isAluno && (
                                    <span
                                        className='cursor-pointer hover:text-[var(--main)] duration-200 ease-in'
                                        onClick={handleLogout}
                                    >
                                        <TbLogout2 size={32} />
                                    </span>
                                )}

                                {/* Professor: se NÃO tiver turmaId → mostra logout */}
                                {isProfessor && !turmaId && (
                                    <span
                                        className='cursor-pointer hover:text-[var(--main)] duration-200 ease-in'
                                        onClick={handleLogout}
                                    >
                                        <TbLogout2 size={32} />
                                    </span>
                                )}

                                {/* Professor: se tiver turmaId → mostra o menu */}
                                {isProfessor && turmaId && (
                                    <GiHamburgerMenu className='' size={32} />
                                )}


                            </button>
                        </div>
                    </div>
                </header>

                {isProfessor && turmaId && (
                    <aside
                        id="staggered-menu-panel"
                        ref={panelRef}
                        className="staggered-menu-panel fixed top-0 right-0 h-screen bg-white flex flex-col p-[6em_2em_2em_2em] overflow-y-auto z-10 backdrop-blur-[12px]"
                        style={{ WebkitBackdropFilter: 'blur(12px)' }}
                        aria-hidden={!open}
                    >
                        <div className="sm-panel-inner flex-1 flex flex-col gap-5">
                            <ul
                                className="sm-panel-list list-none m-0 p-0 flex flex-col gap-2"
                                role="list"
                                data-numbering={displayItemNumbering || undefined}
                            >
                                {items && items.length ? (
                                    items.map((it, idx) => (
                                        <li key={it.label + idx} className="sm-panel-itemWrap ...">
                                            {it.action === 'relatorio' ? (
                                                <button
                                                    type="button"
                                                    className="sm-panel-item ..."
                                                    onClick={e => {
                                                        e.preventDefault();
                                                        // se o pai passou o handler, usa ele; senão usa o handler local
                                                        if (typeof onGenerateReport === 'function') {
                                                            onGenerateReport(turmaId);
                                                        } else {
                                                            handleGenerateReportLocal(turmaId);
                                                        }
                                                    }}
                                                    aria-label={it.ariaLabel || it.label}
                                                    data-index={idx + 1}
                                                >
                                                    <span className="sm-panel-itemLabel">{it.label}</span>
                                                </button>
                                            ) : (
                                                <a className="sm-panel-item ..." href={it.link} aria-label={it.ariaLabel} data-index={idx + 1}>
                                                    <span className="sm-panel-itemLabel">{it.label}</span>
                                                </a>
                                            )}
                                        </li>
                                    ))
                                ) : (
                                    <li className="sm-panel-itemWrap relative overflow-hidden leading-none" aria-hidden="true">
                                        <span className="sm-panel-item relative text-black font-semibold text-[4rem] cursor-pointer leading-none tracking-[-2px] uppercase transition-[background,color] duration-150 ease-linear inline-block no-underline pr-[1.4em]">
                                            <span className="sm-panel-itemLabel inline-block [transform-origin:50%_100%] will-change-transform">
                                                No items
                                            </span>
                                        </span>
                                    </li>
                                )}
                            </ul>
                        </div>
                        <div className='items-center text-center text-white font-semibold'>
                            <button
                                className='border-white border-3 w-full p-2 cursor-pointer rounded-md hover:bg-[var(--secondary)] hover:text-[var(--primary)] duration-200 ease-in uppercase justify-center gap-2 flex'
                                onClick={handleLogout}>

                                <CiLogout size={24} />

                                Logout
                            </button>
                        </div>
                    </aside>
                )}


            </div>

            <style>{`
.sm-scope .staggered-menu-wrapper { position: relative; width: 100%; height: 100%; z-index: 40; }
.sm-scope .staggered-menu-header { position: absolute; top: 0; left: 0; width: 100%; display: flex; align-items: center; justify-content: space-between; padding: 1.9em 2em; background: #D00909; pointer-events: none; z-index: 20; }
.sm-scope .staggered-menu-header > * { pointer-events: auto; }
.sm-scope .sm-logo { display: flex; align-items: center; user-select: none; }
.sm-scope .sm-logo-img { display: block; height: 40px; width: auto; object-fit: contain; }
.sm-scope .sm-toggle { position: relative; display: inline-flex; align-items: center; gap: 0.3rem; background: transparent; border: none; cursor: pointer; color: #e9e9ef; font-weight: 500; line-height: 1; overflow: visible; }
.sm-scope .sm-toggle:focus-visible { outline: 2px solid #ffffffaa; outline-offset: 4px; border-radius: 4px; }
.sm-scope .sm-line:last-of-type { margin-top: 6px; }
.sm-scope .sm-toggle-textWrap { position: relative; margin-right: 0.5em; display: inline-block; height: 1em; overflow: hidden; white-space: nowrap; width: var(--sm-toggle-width, auto); min-width: var(--sm-toggle-width, auto); }
.sm-scope .sm-toggle-textInner { display: flex; flex-direction: column; line-height: 1; }
.sm-scope .sm-toggle-line { display: block; height: 1em; line-height: 1; }
.sm-scope .sm-icon { position: relative; width: 14px; height: 14px; flex: 0 0 14px; display: inline-flex; align-items: center; justify-content: center; will-change: transform; }
.sm-scope .sm-panel-itemWrap { position: relative; overflow: hidden; line-height: 1; }
.sm-scope .sm-icon-line { position: absolute; left: 50%; top: 50%; width: 100%; height: 2px; background: currentColor; border-radius: 2px; transform: translate(-50%, -50%); will-change: transform; }
.sm-scope .sm-line { display: none !important; }
.sm-scope .staggered-menu-panel { poimport StaggeredMenu from '../../../ts-default/Components/StaggeredMenu/StaggeredMenu';
sition: absolute; top: 0; right: 0; width: clamp(260px, 38vw, 320px); height: 100%; background: #D00909; backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); display: flex; flex-direction: column; padding: 6em 2em 2em 2em; overflow-y: auto; z-index: 10; }
.sm-scope [data-position='left'] .staggered-menu-panel { right: auto; left: 0; }
.sm-scope .sm-prelayers { position: absolute; top: 0; right: 0; bottom: 0; width: clamp(260px, 38vw, 320px); pointer-events: none; z-index: 5; }
.sm-scope [data-position='left'] .sm-prelayers { right: auto; left: 0; }
.sm-scope .sm-prelayer { position: absolute; top: 0; right: 0; height: 100%; width: 100%; transform: translateX(0); }
.sm-scope .sm-panel-inner { flex: 1; display: flex; flex-direction: column; gap: 1.25rem; }
.sm-scope .sm-socials { margin-top: auto; padding-top: 2rem; display: flex; flex-direction: column; gap: 0.75rem; }
.sm-scope .sm-socials-title { margin: 0; font-size: 1rem; font-weight: 500; color: var(--sm-accent, #ff0000); }
.sm-scope .sm-socials-list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: row; align-items: center; gap: 1rem; flex-wrap: wrap; }
.sm-scope .sm-socials-list .sm-socials-link { opacity: 1; transition: opacity 0.3s ease; }
.sm-scope .sm-socials-list:hover .sm-socials-link:not(:hover) { opacity: 0.35; }
.sm-scope .sm-socials-list:focus-within .sm-socials-link:not(:focus-visible) { opacity: 0.35; }
.sm-scope .sm-socials-list .sm-socials-link:hover,
.sm-scope .sm-socials-list .sm-socials-link:focus-visible { opacity: 1; }
.sm-scope .sm-socials-link:focus-visible { outline: 2px solid var(--sm-accent, #ff0000); outline-offset: 3px; }
.sm-scope .sm-socials-link { font-size: 1.2rem; font-weight: 500; color: #111; text-decoration: none; position: relative; padding: 2px 0; display: inline-block; transition: color 0.3s ease, opacity 0.3s ease; }
.sm-scope .sm-socials-link:hover { color: var(--sm-accent, #ff0000); }
.sm-scope .sm-panel-title { margin: 0; font-size: 1rem; font-weight: 600; color: #fff; text-transform: uppercase; }
.sm-scope .sm-panel-list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 0.5rem; }
.sm-scope .sm-panel-item { position: relative; color: #fff; font-weight: 400; font-size: 2.5rem; cursor: pointer; line-height: 1; letter-spacing: -2px; text-transform: uppercase; transition: background 0.25s, color 0.25s; display: inline-block; text-decoration: none; padding-right: 1.4em; }
.sm-scope .sm-panel-itemLabel { display: inline-block; will-change: transform; transform-origin: 50% 100%; }
.sm-scope .sm-panel-item:hover { color: var(--sm-accent, #ff0000); }
.sm-scope .sm-panel-list[data-numbering] { counter-reset: smItem; }
.sm-scope .sm-panel-list[data-numbering] .sm-panel-item::after { counter-increment: smItem; content: counter(smItem, decimal-leading-zero); position: absolute; top: 0.1em; right: 3.2em; font-size: 18px; font-weight: 400; color: var(--sm-accent, #ff0000); letter-spacing: 0; pointer-events: none; user-select: none; opacity: var(--sm-num-opacity, 0); }
@media (max-width: 1024px) { .sm-scope .staggered-menu-panel { width: 100%; left: 0; right: 0; } .sm-scope .staggered-menu-wrapper[data-open] .sm-logo-img { filter: invert(100%); } }
@media (max-width: 640px) { .sm-scope .staggered-menu-panel { width: 100%; left: 0; right: 0; } .sm-scope .staggered-menu-wrapper[data-open] .sm-logo-img { filter: invert(100%); } }
      `}</style>
        </div>
    );
};

export default StaggeredMenu;