import { useEffect, useRef } from "react";
import Matter from "matter-js";
import "./MatterComponent.css";
import B from "../../img/B.svg";
import bee from "../../img/matterjs_bee_bee.svg";
import D from "../../img/D.svg";
import E from "../../img/E.svg";
import flower from "../../img/flower.svg";
import star from "../../img/star.svg";
import U from "../../img/U.svg";
import Y from "../../img/Y.svg";
import cloud from "../../img/cloud.svg";
import grid from "../../img/grid_temp2-18.svg";

const MatterComponent = () => {
  const sceneRef = useRef(null);
  const engineRef = useRef(null);
  const renderRef = useRef(null);
  const wallsRef = useRef([]);
  const scrollDeltaY = useRef(0);
  const isScrolling = useRef(false);
  const lastScrollTime = useRef(Date.now());
  const scrollBehavior = useRef("smooth");

  useEffect(() => {
    const { Engine, Render, Runner, Bodies, Mouse, MouseConstraint, World } =
      Matter;

    const engine = Engine.create();
    const runner = Runner.create();
    const { world } = engine;

    const render = Render.create({
      element: sceneRef.current,
      engine: engine,
      options: {
        width: sceneRef.current ? sceneRef.current.clientWidth : 0,
        height: 800, // 고정 높이 설정
        wireframes: false,
        background: `url(${grid})`,
      },
    });

    engineRef.current = engine;
    renderRef.current = render;

    const wallThickness = 1;
    const mainSectionHeight = 800; // 고정 높이

    const createWalls = width => {
      return [
        Bodies.rectangle(width / 2, wallThickness / 2, width, wallThickness, {
          isStatic: true,
        }), // 상단 벽
        Bodies.rectangle(
          width / 2,
          mainSectionHeight - wallThickness / 2,
          width,
          wallThickness,
          { isStatic: true }
        ), // 하단 벽
        Bodies.rectangle(
          wallThickness / 2,
          mainSectionHeight / 2,
          wallThickness,
          mainSectionHeight,
          { isStatic: true }
        ), // 좌측 벽
        Bodies.rectangle(
          width - wallThickness / 2,
          mainSectionHeight / 2,
          wallThickness,
          mainSectionHeight,
          { isStatic: true }
        ), // 우측 벽
      ];
    };

    const handleResize = () => {
      if (!sceneRef.current) return;

      const { width } = sceneRef.current.getBoundingClientRect();

      render.canvas.width = width;
      render.canvas.height = mainSectionHeight;

      render.bounds.max.x = width;
      render.bounds.max.y = mainSectionHeight;
      render.options.width = width;
      render.options.height = mainSectionHeight;
      Render.setPixelRatio(render, window.devicePixelRatio);

      Matter.Bounds.update(render.bounds, [
        { x: 0, y: 0 },
        { x: width, y: mainSectionHeight },
      ]);

      // 기존 벽 제거
      wallsRef.current.forEach(wall => {
        World.remove(world, wall);
      });

      // 새 벽 생성
      const newWalls = createWalls(width);
      World.add(world, newWalls);
      wallsRef.current = newWalls;

      // 박스 위치 업데이트
      Matter.Composite.allBodies(world).forEach(body => {
        if (body.label === "box") {
          Matter.Body.setPosition(body, {
            x: (body.position.x / render.bounds.max.x) * width,
            y: body.position.y,
          });
        }
      });
    };

    // 초기 벽 생성
    const width = sceneRef.current.clientWidth;
    const initialWalls = createWalls(width);
    World.add(world, initialWalls);
    wallsRef.current = initialWalls;

    const images = [
      { src: B, density: 0.001, x: 100, y: 200 },
      { src: U, density: 0.001, x: 200, y: 200 },
      { src: D, density: 0.001, x: 300, y: 200 },
      { src: D, density: 0.001, x: 400, y: 200 },
      { src: Y, density: 0.001, x: 500, y: 200 },
      { src: bee, density: 0.0001, x: 600, y: 500 },
      { src: B, density: 0.001, x: 700, y: 500 },
      { src: E, density: 0.001, x: 800, y: 500 },
      { src: E, density: 0.001, x: 900, y: 500 },
      { src: star, density: 0.001, x: 1000, y: 700 },
      { src: flower, density: 0.001, x: 1100, y: 700 },
      { src: cloud, density: 0.001, x: 1100, y: 200 },
    ];

    const boxes = images.map((img, index) => {
      const scale = img.src === cloud ? 1.0 : img.src === star ? 1.4 : 1.49;
      return Bodies.rectangle(img.x, img.y, 200, 200, {
        label: "box",
        render: {
          sprite: {
            texture: img.src,
            xScale: scale,
            yScale: scale,
          },
        },
        density: img.density,
      });
    });
    World.add(world, boxes);

    const mouse = Mouse.create(render.canvas);
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.2,
        render: {
          visible: false,
        },
      },
    });

    World.add(world, mouseConstraint);

    render.mouse = mouse;

    Runner.run(runner, engine);
    Render.run(render);

    window.addEventListener("resize", handleResize);
    handleResize(); // 페이지 로드 시 한 번 호출하여 벽을 설정

    return () => {
      Render.stop(render);
      World.clear(world);
      Engine.clear(engine);
      render.canvas.remove();
      render.textures = {};
      window.removeEventListener("resize", handleResize);
    };
  }, [sceneRef]);

  useEffect(() => {
    const handleWheel = event => {
      if (sceneRef.current && sceneRef.current.contains(event.target)) {
        event.preventDefault();
        const now = Date.now();

        if (now - lastScrollTime.current < 100) {
          scrollBehavior.current = "auto";
        } else {
          scrollBehavior.current = "smooth";
        }

        scrollDeltaY.current += event.deltaY;
        lastScrollTime.current = now;

        if (!isScrolling.current) {
          isScrolling.current = true;
          requestAnimationFrame(performScroll);
        }
      }
    };

    const performScroll = () => {
      window.scrollBy({
        top: scrollDeltaY.current,
        left: 0,
        behavior: scrollBehavior.current,
      });
      scrollDeltaY.current = 0;
      isScrolling.current = false;
    };

    window.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      window.removeEventListener("wheel", handleWheel, { passive: false });
    };
  }, []);

  return <div ref={sceneRef} className="matter-scene"></div>;
};

export default MatterComponent;
