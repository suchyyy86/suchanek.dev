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
  const underline = story.querySelector<SVGPathElement>('.work-underline-ink');
  const pill = story.querySelector<HTMLElement>('.contact-pill');
  const scenes = Array.from(story.querySelectorAll<HTMLElement>('.scene'));
  if (!stage || !dot || !startAnchor || !workAnchor || !pill || !underline || scenes.length !== 3) return;

  const elements = { stage, dot, startAnchor, workAnchor, pill, underline };
  const lines = scenes.map((scene) => Array.from(scene.querySelectorAll<HTMLElement>('.line-inner')));
  const notes = [story.querySelector('.name-note'), story.querySelector('.work-note')];
  const cue = story.querySelector('.scroll-cue');
  const meter = story.querySelector('.cue-track > span');
  const scrollLabels = Array.from(story.querySelectorAll<HTMLElement>('[data-scroll-label]'));
  const nameChars = Array.from(story.querySelectorAll<HTMLElement>('.name-char'));
  const media = gsap.matchMedia();

  media.add('(prefers-reduced-motion: no-preference) and (min-height: 520px)', () => {
    story.classList.add('is-enhanced');
    const state = { progress: 0 };
    let points = [{ x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 }];
    let pillWidth = 0;
    let pillHeight = 0;
    let dotSize = 0;
    let activeScene = -1;
    let intro: gsap.core.Timeline | undefined;
    let colors = { accent: '', surface: '', line: '' };

    const clamp = gsap.utils.clamp(0, 1);
    const between = (value: number, start: number, end: number) => clamp((value - start) / (end - start));
    const ease = gsap.parseEase('power2.inOut');
    const mix = gsap.utils.interpolate;

    function measure() {
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
      points = [center(elements.startAnchor), center(elements.workAnchor), center(elements.pill)];
      const tokens = getComputedStyle(document.documentElement);
      const accent = tokens.getPropertyValue('--accent').trim();
      colors = {
        accent,
        surface: mix(tokens.getPropertyValue('--surface').trim(), accent, 0.03),
        line: mix(tokens.getPropertyValue('--line').trim(), accent, 0.12),
      };
      pillWidth = elements.pill.offsetWidth;
      pillHeight = elements.pill.offsetHeight;
      points[2].x -= (pillWidth - pillHeight) / 2;
      dotSize = elements.startAnchor.offsetWidth;
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
      if (p > 0.025 && intro) {
        intro.progress(1).kill();
        intro = undefined;
      }
      const introExit = ease(between(p, 0.16, 0.29));
      const workEnter = between(p, 0.28, 0.42);
      const workExit = ease(between(p, 0.57, 0.69));
      const contactEnter = between(p, 0.7, 0.83);
      setScene(0, 1 - introExit, 1, introExit);
      setScene(1, ease(workEnter) * (1 - workExit), workEnter, workExit);
      setScene(2, ease(contactEnter), contactEnter, 0);
      gsap.set(elements.pill, { opacity: ease(between(p, 0.91, 0.975)), y: 0 });
      gsap.set(meter, { scaleY: p });

      // Scrub the flip in both directions; no queued transitions on fast scrolling.
      const labelPhase = p < 0.5 ? ease(between(p, 0.25, 0.31)) : 1 + ease(between(p, 0.67, 0.73));
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
      const inkProgress = gsap.parseEase('power2.out')(between(p, 0.43, 0.55));
      // Draw a scaling mask: normalized dashes on a non-scaling stroke can repeat
      // after the responsive SVG transform and reveal disconnected fragments.
      elements.underline.style.strokeDasharray = '1 1';
      elements.underline.style.strokeDashoffset = String(1 - inkProgress);
      elements.underline.style.opacity = inkProgress > 0 ? '1' : '0';

      const currentScene = p < 0.28 ? 0 : p < 0.7 ? 1 : 2;
      if (currentScene !== activeScene) {
        scenes.forEach((scene, index) => {
          if (index > 0) scene.setAttribute('aria-hidden', String(index !== currentScene));
          scene.inert = index !== currentScene;
        });
        activeScene = currentScene;
      }
      elements.pill.inert = p < 0.975;

      // The same dot travels along two arcs, settles, then becomes the contact surface.
      const segment = p < 0.58 ? 0 : 1;
      const travel = segment === 0 ? between(p, 0.15, 0.4) : between(p, 0.58, 0.81);
      const t = ease(travel);
      const from = points[segment];
      const to = points[segment + 1];
      const arc = Math.sin(Math.PI * travel);
      const lateral = Math.min(elements.stage.offsetWidth * 0.17, 155);
      const x = mix(from.x, to.x, t) + arc * lateral;
      const y = mix(from.y, to.y, t) - arc * Math.min(elements.stage.offsetHeight * 0.15, 110);
      const spread = ease(between(p, 0.855, 0.94));
      const grow = ease(between(p, 0.81, 0.87));
      const landing = Math.sin(between(travel, 0.8, 1) * Math.PI) * (1 - spread);
      const height = mix(dotSize, pillHeight, grow);
      const width = mix(height, pillWidth, spread);
      gsap.set(elements.dot, {
        x: x + (width - height) / 2 - width / 2,
        y: y - height / 2,
        width,
        height,
        borderRadius: mix(height / 2, 16, spread),
        backgroundColor: mix(colors.accent, colors.surface, spread),
        borderColor: mix('rgba(0, 0, 0, 0)', colors.line, spread),
        scaleX: 1 + landing * 0.2,
        scaleY: 1 - landing * 0.16,
        rotation: arc * (segment === 0 ? 12 : -12) * (1 - spread),
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

    return () => {
      observer.disconnect();
      story.classList.remove('is-enhanced');
      intro?.kill();
      gsap.set([scenes, lines.flat(), nameChars, scrollLabels, notes.filter(Boolean), elements.dot, elements.pill, elements.underline, cue, meter], { clearProps: 'all' });
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
