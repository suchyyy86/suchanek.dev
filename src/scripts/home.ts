import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const root = document.querySelector<HTMLElement>('.story');
if (root) initializeStory(root);

function initializeStory(story: HTMLElement) {
  const stage = story.querySelector<HTMLElement>('.story-stage');
  const dot = story.querySelector<HTMLElement>('.travel-dot');
  const startAnchor = story.querySelector<HTMLElement>('[data-dot-start]');
  const workAnchor = story.querySelector<HTMLElement>('[data-dot-work]');
  const autoAnchor = story.querySelector<HTMLElement>('[data-dot-auto]');
  const underline = story.querySelector<SVGPathElement>('.work-underline-ink');
  const loopSvg = story.querySelector<SVGSVGElement>('.auto-loop');
  const loopRing = story.querySelector<SVGPathElement>('.auto-loop-ring');
  const pill = story.querySelector<HTMLElement>('.contact-pill');
  const scenes = Array.from(story.querySelectorAll<HTMLElement>('.scene'));
  if (
    !stage || !dot || !startAnchor || !workAnchor || !autoAnchor || !pill || !underline ||
    !loopSvg || !loopRing || scenes.length !== 4
  ) return;

  const elements = { stage, dot, startAnchor, workAnchor, autoAnchor, pill, underline, loopSvg, loopRing };
  const lines = scenes.map((scene) => Array.from(scene.querySelectorAll<HTMLElement>('.line-inner')));
  const notes = [story.querySelector('.name-note'), story.querySelector('.work-note'), story.querySelector('.auto-note')];
  const cue = story.querySelector('.scroll-cue');
  const meter = story.querySelector('.cue-track > span');
  const scrollLabels = Array.from(story.querySelectorAll<HTMLElement>('[data-scroll-label]'));
  const nameChars = Array.from(story.querySelectorAll<HTMLElement>('.name-char'));
  const planeStrokes = Array.from(story.querySelectorAll<SVGPathElement>('.contact-plane path'));
  const autoExamples = Array.from(story.querySelectorAll<HTMLElement>('.auto-examples li'));
  const footer = document.querySelector<HTMLElement>('.footer');
  const media = gsap.matchMedia();

  // The original three scenes were choreographed on a 0–1 scale. The automation scene
  // adds 0.4 between “AI-first.” and “Napiš mi.”, so every time below uses that longer
  // scale and `at()` maps it back to scroll progress.
  const TOTAL = 1.4;
  const at = (value: number) => value / TOTAL;

  media.add('(prefers-reduced-motion: no-preference) and (min-height: 520px)', () => {
    story.classList.add('is-enhanced');
    const state = { progress: 0 };
    let points = [{ x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 }];
    let loop = { x: 0, y: 0, a: 0, b: 0 };
    let loopLength = 0;
    let pillWidth = 0;
    let pillHeight = 0;
    let dotSize = 0;
    let activeScene = -1;
    let intro: gsap.core.Timeline | undefined;
    let colors = { accent: '' };

    const clamp = gsap.utils.clamp(0, 1);
    const between = (value: number, start: number, end: number) => clamp((value - start) / (end - start));
    const ease = gsap.parseEase('power2.inOut');
    const loopEase = gsap.parseEase('sine.inOut');
    const mix = gsap.utils.interpolate;

    function measure() {
      // Let the footer enter over the last part of the sticky stage. Its height
      // no longer extends the document and releases the contact scene upward.
      if (footer) gsap.set(footer, { marginTop: -footer.offsetHeight });
      // offsetTop/Left keep anchors stable while their text is animated.
      function center(element: HTMLElement) {
        let x = element.offsetWidth / 2;
        let y = element.offsetHeight / 2;
        let parent: HTMLElement | null = element;
        while (parent && parent !== elements.stage) {
          x += parent.offsetLeft;
          y += parent.offsetTop;
          parent = parent.offsetParent as HTMLElement | null;
        }
        return { x, y };
      }
      points = [
        center(elements.startAnchor),
        center(elements.workAnchor),
        center(elements.autoAnchor),
        center(elements.pill),
      ];
      const tokens = getComputedStyle(document.documentElement);
      const accent = tokens.getPropertyValue('--accent').trim();
      colors = {
        accent,
      };
      pillWidth = elements.pill.offsetWidth;
      pillHeight = elements.pill.offsetHeight;
      points[3].x -= (pillWidth - pillHeight) / 2;
      dotSize = elements.startAnchor.offsetWidth;

      // A continuous figure-eight starts and ends at the full stop. Fit the whole
      // stroke inside the content width, including narrow screens and larger text.
      const em = elements.autoAnchor.offsetWidth / 0.085;
      const width = Math.max(12, Math.min(em * 1.65, elements.stage.offsetWidth - points[2].x - 8));
      loop = { x: points[2].x + width / 2, y: points[2].y, a: width / 2, b: width * 0.2 };
      const height = loop.b * 2 + 8;
      elements.loopSvg.setAttribute('width', String(width + 8));
      elements.loopSvg.setAttribute('height', String(height));
      elements.loopSvg.setAttribute('viewBox', `0 0 ${width + 8} ${height}`);
      const path = Array.from({ length: 161 }, (_, index) => {
        const theta = index / 160 * Math.PI * 2;
        return `${index === 0 ? 'M' : 'L'} ${4 + loop.a * (1 - Math.cos(theta))} ${height / 2 - loop.b * Math.sin(2 * theta)}`;
      }).join(' ');
      elements.loopRing.setAttribute('d', path);
      loopLength = elements.loopRing.getTotalLength();
      gsap.set(elements.loopSvg, { x: points[2].x - 4, y: loop.y - height / 2 });
      render();
    }

    function setScene(index: number, visibility: number, entrance: number, exit: number) {
      gsap.set(scenes[index], { autoAlpha: visibility });
      lines[index].forEach((line, lineIndex) => {
        const reveal = ease(clamp(entrance * 1.25 - lineIndex * 0.18));
        gsap.set(line, { yPercent: (1 - reveal) * 108 - exit * 28, rotate: (1 - reveal) * 2 });
      });
      if (notes[index]) gsap.set(notes[index], { opacity: ease(entrance), y: (1 - entrance) * 16 - exit * 12 });
    }

    function render() {
      const p = state.progress;
      // Finish the entrance if someone scrolls immediately, keeping the story responsive.
      if (p > at(0.025) && intro) {
        intro.progress(1).kill();
        intro = undefined;
      }
      const introExit = ease(between(p, at(0.16), at(0.29)));
      const workEnter = between(p, at(0.28), at(0.42));
      const workExit = ease(between(p, at(0.57), at(0.69)));
      const autoEnter = between(p, at(0.7), at(0.84));
      const autoExit = ease(between(p, at(0.99), at(1.11)));
      const contactEnter = between(p, at(1.1), at(1.23));
      setScene(0, 1 - introExit, 1, introExit);
      setScene(1, ease(workEnter) * (1 - workExit), workEnter, workExit);
      setScene(2, ease(autoEnter) * (1 - autoExit), autoEnter, autoExit);
      setScene(3, ease(contactEnter), contactEnter, 0);
      autoExamples.forEach((example, index) => {
        const reveal = ease(between(p, at(0.82 + index * 0.025), at(0.89 + index * 0.025)));
        gsap.set(example, { opacity: reveal, y: (1 - reveal) * 8 });
      });
      gsap.set(elements.pill, { opacity: ease(between(p, at(1.31), at(1.375))), y: 0 });
      gsap.set(meter, { scaleY: p });

      // Scrub the flip in both directions; no queued transitions on fast scrolling.
      const labelPhase = [
        [0.25, 0.31],
        [0.67, 0.73],
        [1.07, 1.13],
      ].reduce((phase, [start, end]) => phase + ease(between(p, at(start), at(end))), 0);
      scrollLabels.forEach((label, index) => {
        const offset = clamp(Math.abs(index - labelPhase));
        const direction = Math.sign(index - labelPhase);
        gsap.set(label, {
          yPercent: direction * offset * 100,
          rotationX: -direction * offset * 65,
          opacity: 1 - offset,
        });
      });

      // The dot rests after “aplikace” while a separate pen stroke is drawn.
      const inkProgress = gsap.parseEase('power2.out')(between(p, at(0.43), at(0.55)));
      // Draw a scaling mask: normalized dashes on a non-scaling stroke can repeat
      // after the responsive SVG transform and reveal disconnected fragments.
      elements.underline.style.strokeDasharray = '1 1';
      elements.underline.style.strokeDashoffset = String(1 - inkProgress);
      elements.underline.style.opacity = inkProgress > 0 ? '1' : '0';

      // One calm, continuous cycle: the dot traces automation, then carries on
      // toward contact. Geometry and dash reveal share the same path distance.
      const loopRun = between(p, at(0.84), at(1.0));
      const ringDrawn = loopEase(loopRun);
      const ringErase = ease(between(p, at(1.0), at(1.1)));
      elements.loopRing.style.strokeDasharray = '1 1';
      elements.loopRing.style.strokeDashoffset = String(1 - ringDrawn);
      elements.loopRing.style.opacity = ringDrawn > 0 ? String(1 - ringErase) : '0';

      // Trace the plane first, then add three short motion strokes.
      const planeProgress = between(p, at(1.235), at(1.375));
      planeStrokes.forEach((stroke, index) => {
        const drawn = index === 0
          ? between(planeProgress, 0, 0.8)
          : between(planeProgress, 0.7 + (index - 1) * 0.08, 0.84 + (index - 1) * 0.08);
        stroke.style.strokeDasharray = '1 1';
        stroke.style.strokeDashoffset = String(1 - drawn);
        stroke.style.opacity = drawn > 0 ? '1' : '0';
      });

      const currentScene = p < at(0.28) ? 0 : p < at(0.7) ? 1 : p < at(1.1) ? 2 : 3;
      if (currentScene !== activeScene) {
        scenes.forEach((scene, index) => {
          if (index > 0) scene.setAttribute('aria-hidden', String(index !== currentScene));
          scene.inert = index !== currentScene;
        });
        activeScene = currentScene;
      }
      elements.pill.inert = p < at(1.375);

      // The same dot hops from the name to “aplikace”, then to “rutinu”, loops there,
      // and finally flies to the contact surface it turns into.
      const lateral = Math.min(elements.stage.offsetWidth * 0.17, 155);
      const lift = Math.min(elements.stage.offsetHeight * 0.15, 110);
      const flights: [number, number][] = [[0.15, 0.4], [0.58, 0.81], [1.0, 1.23]];
      let x: number;
      let y: number;
      let rotation = 0;
      let landing = 0;
      if (p >= at(0.84) && p < at(1.0)) {
        const tip = elements.loopRing.getPointAtLength(loopLength * ringDrawn);
        x = points[2].x - 4 + tip.x;
        y = loop.y - (loop.b + 4) + tip.y;
      } else {
        const segment = p < at(0.58) ? 0 : p < at(1.0) ? 1 : 2;
        const [start, end] = flights[segment];
        const travel = between(p, at(start), at(end));
        const t = ease(travel);
        const from = points[segment];
        const to = points[segment + 1];
        const arc = Math.sin(Math.PI * travel);
        x = mix(from.x, to.x, t) + arc * lateral;
        y = mix(from.y, to.y, t) - arc * lift;
        rotation = arc * (segment === 0 ? 12 : -12);
        landing = Math.sin(between(travel, 0.8, 1) * Math.PI);
      }
      const spread = ease(between(p, at(1.255), at(1.34)));
      const grow = ease(between(p, at(1.21), at(1.27)));
      landing *= 1 - spread;
      const height = mix(dotSize, pillHeight, grow);
      const width = mix(height, pillWidth, spread);
      gsap.set(elements.dot, {
        x: x + (width - height) / 2 - width / 2,
        y: y - height / 2,
        width,
        height,
        borderRadius: mix(height / 2, 8, spread),
        backgroundColor: mix(colors.accent, 'rgba(0, 0, 0, 0)', spread),
        borderColor: mix('rgba(0, 0, 0, 0)', colors.accent, spread),
        scaleX: 1 + landing * 0.2,
        scaleY: 1 - landing * 0.16,
        rotation: rotation * (1 - spread),
      });
    }

    measure();
    const animation = gsap.to(state, { progress: 1, duration: 1, ease: 'none', paused: true, onUpdate: render });
    const trigger = ScrollTrigger.create({
      trigger: story,
      start: 'top top',
      // Keep the completed contact button pinned for the final 35svh.
      end: () => `bottom bottom+=${elements.stage.offsetHeight * 0.35}`,
      animation,
      scrub: 0.65,
      onRefresh: measure,
    });

    const footerTrigger = footer ? ScrollTrigger.create({
      trigger: footer,
      start: 'top bottom',
      end: 'bottom bottom',
      onUpdate: (self) => gsap.set(cue, { opacity: 1 - self.progress, y: -8 * self.progress }),
      onRefresh: (self) => gsap.set(cue, { opacity: 1 - self.progress, y: -8 * self.progress }),
    }) : undefined;

    // One restrained entrance, independent of subsequent scroll scrubbing.
    if (window.scrollY < story.offsetTop + 10) {
      intro = gsap.timeline()
        .from(nameChars, {
          yPercent: 115,
          rotation: 3,
          duration: 1.15,
          stagger: 0.045,
          ease: 'power3.out',
        })
        .from(notes[0], { opacity: 0, y: 12, duration: 0.8, ease: 'power2.out' }, 0.55)
        .from(elements.dot, { opacity: 0, duration: 0.5, ease: 'power2.out' }, 1.4);
    }

    const observer = new ResizeObserver(() => trigger.refresh());
    observer.observe(elements.pill);
    if (footer) observer.observe(footer);

    return () => {
      observer.disconnect();
      footerTrigger?.kill();
      if (footer) gsap.set(footer, { clearProps: 'marginTop' });
      story.classList.remove('is-enhanced');
      intro?.kill();
      gsap.set(
        [scenes, lines.flat(), nameChars, scrollLabels, planeStrokes, autoExamples, notes.filter(Boolean), elements.dot, elements.pill,
          elements.underline, elements.loopSvg, elements.loopRing, cue, meter],
        { clearProps: 'all' },
      );
      scenes.forEach((scene) => {
        scene.inert = false;
        scene.removeAttribute('aria-hidden');
      });
      elements.pill.inert = false;
    };
  });

  document.fonts.ready.then(() => ScrollTrigger.refresh());
  window.addEventListener('pageshow', () => ScrollTrigger.refresh());
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => ScrollTrigger.refresh());
}
