import { useEffect, useRef } from "react";
import Matter from "matter-js";
import "./MatterComponent.css";
import B from "../../img/B.svg";
import bee from "../../img/bee.svg";
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

    // 엔진과 러너 생성
    const engine = Engine.create();
    const runner = Runner.create();
    const { world } = engine;

    // 렌더러 생성
    const render = Render.create({
      element: sceneRef.current,
      engine: engine,
      options: {
        width: sceneRef.current.clientWidth,
        height: sceneRef.current.clientHeight,
        wireframes: false,
        background: `url(${grid})`,
      },
    });

    // 엔진과 렌더러 레퍼런스 설정
    engineRef.current = engine;
    renderRef.current = render;

    // 벽 두께 설정
    const wallThickness = 100;

    // 벽 생성 함수
    const createWalls = (width, height) => {
      return [
        Bodies.rectangle(width / 2, -wallThickness / 2, width, wallThickness, {
          isStatic: true,
        }),
        Bodies.rectangle(
          width / 2,
          height + wallThickness / 2,
          width,
          wallThickness,
          { isStatic: true }
        ),
        Bodies.rectangle(
          width + wallThickness / 2,
          height / 2,
          wallThickness,
          height,
          { isStatic: true }
        ),
        Bodies.rectangle(
          -wallThickness / 2,
          height / 2,
          wallThickness,
          height,
          { isStatic: true }
        ),
      ];
    };

    // 벽 추가
    const walls = createWalls(render.options.width, render.options.height);
    wallsRef.current = walls;

    // 이미지와 밀도 및 초기 위치 설정
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

    // 이미지 박스 생성
    const boxes = images.map((img, index) =>
      Bodies.rectangle(
        img.x, // x 좌표 설정
        img.y, // y 좌표 설정
        200, // 넓이 증가
        200, // 높이 증가
        {
          render: {
            sprite: {
              texture: img.src,
              xScale: 1.5, // 가로 크기 증가
              yScale: 1.5, // 세로 크기 증가
            },
          },
          density: img.density, // 밀도 설정
        }
      )
    );

    // 월드에 박스와 벽 추가
    World.add(world, [...boxes, ...walls]);

    // 마우스 생성 및 마우스 제약 추가
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

    // 러너와 렌더러 실행
    Runner.run(runner, engine);
    Render.run(render);

    // 창 크기 조정 핸들러
    const handleResize = () => {
      const width = sceneRef.current.clientWidth;
      const height = sceneRef.current.clientHeight;

      render.bounds.max.x = width;
      render.bounds.max.y = height;
      render.options.width = width;
      render.options.height = height;
      Render.setPixelRatio(render, window.devicePixelRatio);
      render.canvas.width = width;
      render.canvas.height = height;
      Matter.Bounds.update(render.bounds, [
        { x: 0, y: 0 },
        { x: width, y: height },
      ]);

      wallsRef.current.forEach(wall => {
        World.remove(world, wall);
      });

      const newWalls = createWalls(width, height);
      World.add(world, newWalls);
      wallsRef.current = newWalls;
    };

    window.addEventListener("resize", handleResize);

    handleResize();

    return () => {
      Render.stop(render);
      World.clear(world);
      Engine.clear(engine);
      render.canvas.remove();
      render.textures = {};
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // window 스크롤을 업데이트하는 마우스 휠 이벤트 추가
  useEffect(() => {
    const handleWheel = event => {
      if (sceneRef.current && sceneRef.current.contains(event.target)) {
        event.preventDefault(); // 기본 스크롤 방지
        const now = Date.now();

        if (now - lastScrollTime.current < 100) {
          // 최근 스크롤 이벤트로부터 200ms 이내에 새 스크롤 이벤트가 발생한 경우
          scrollBehavior.current = "auto";
        } else {
          // 최근 스크롤 이벤트로부터 200ms 이후에 새 스크롤 이벤트가 발생한 경우
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
        behavior: scrollBehavior.current, // 부드러운 스크롤
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
