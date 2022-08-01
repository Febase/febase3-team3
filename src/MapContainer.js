import React, {useLayoutEffect, useRef} from 'react';
import * as am5 from '@amcharts/amcharts5';
import * as am5map from '@amcharts/amcharts5/map';
import {TimelineMax} from 'gsap/all';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import am5geodata_worldLow from '@amcharts/amcharts5-geodata/worldLow';

const body   = document.body;
const canvas = document.createElement("canvas");
const ctx    = canvas.getContext("2d");
const angle  = Math.PI * 2;
let width, height;

export default function MapContainer() {
  //---------------------------------------------------------------------------------------------------------------
  const mapRef = useRef(null);

  const handleZoomBtn = (inOut = false) => {
    mapRef.current &&
      (inOut ? mapRef.current.zoomIn() : mapRef.current.zoomOut());
  };

  const zoomInBtn = () => handleZoomBtn(true);
  const zoomOutBtn = () => handleZoomBtn(false);
  const clickToDetailPage = (event) => {
    if (event.target === canvas) return;

    body.appendChild(canvas);

    width  = canvas.width  = body.scrollWidth;
    height = canvas.height = window.innerHeight;

    const x = event.pageX;
    const y = event.pageY;
    const radius = maxDistance(x, y);

    const ripple = {
      alpha: 0,
      radius: 0,
      x: x,
      y: y
    };

    const tl = new TimelineMax({ onUpdate: drawRipple.bind(ripple), onComplete: removeCanvas })
    .to(ripple, 0.4, { alpha: 1, radius: radius })
    .to(ripple, 0.3, { alpha: 0 }, 0.6).call(() => {
      window.location.href = '/detail/1'
    });

    // setTimeout(() => {
    //   window.location.href = '/detail/1'
    // }, 700)
  }

  function removeCanvas() {
    body.removeChild(canvas);
  }

  function drawRipple() {
    ctx.clearRect(0, 0, width, height);
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, angle, false);
    ctx.fillStyle = "rgba(0,0,255," + this.alpha + ")";
    ctx.fill();
  }

  function maxDistance(x, y) {
    var point = { x: x, y: y };
    var da = distanceSq(point, { x: 0, y: 0 });
    var db = distanceSq(point, { x: width, y: 0 });
    var dc = distanceSq(point, { x: width, y: height });
    var dd = distanceSq(point, { x: 0, y: height });
    return Math.sqrt(Math.max(da, db, dc, dd));
  }

  function distanceSq(p1, p2) {
    return Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2);
  }
  //---------------------------------------------------------------------------------------------------------------
  useLayoutEffect(() => {
    let root = am5.Root.new('chartdiv');
    root.setThemes([am5themes_Animated.new(root)]);

    const mapChart = am5map.MapChart.new(root, {
      panX: 'rotateX',
      panY: 'translateY',
      projection: am5map.geoMercator(),
      homeGeoPoint: { latitude: 2, longitude: 2 },
    });
    let chart = root.container.children.push(mapChart);
    //---------------------------------------------------------------------------------------------------------------
    mapRef.current = mapChart;
    //---------------------------------------------------------------------------------------------------------------
    let cont = chart.children.push(
      am5.Container.new(root, {
        layout: root.horizontalLayout,
        x: 20,
        y: 40,
      }),
    );

    // Add labels and controls
    cont.children.push(
      am5.Label.new(root, {
        centerY: am5.p50,
        text: 'Map',
      }),
    );

    let switchButton = cont.children.push(
      am5.Button.new(root, {
        themeTags: ['switch'],
        centerY: am5.p50,
        // icon: am5.Circle.new(root, {
        // themeTags: ["icon"],
        // }),
      }),
    );

    switchButton.on('active', function () {
      if (!switchButton.get('active')) {
        chart.set('projection', am5map.geoMercator());
        chart.set('panY', 'translateY');
        chart.set('rotationY', 0);
        backgroundSeries.mapPolygons.template.set('fillOpacity', 0);
      } else {
        chart.set('projection', am5map.geoOrthographic());
        chart.set('panY', 'rotateY');

        backgroundSeries.mapPolygons.template.set('fillOpacity', 0.1);
      }
    });

    cont.children.push(
      am5.Label.new(root, {
        centerY: am5.p50,
        text: 'Globe',
      }),
    );

    let backgroundSeries = chart.series.push(
      am5map.MapPolygonSeries.new(root, {}),
    );
    backgroundSeries.mapPolygons.template.setAll({
      fill: root.interfaceColors.get('alternativeBackground'),
      fillOpacity: 0,
      strokeOpacity: 0,
    });

    backgroundSeries.data.push({
      geometry: am5map.getGeoRectangle(90, 180, -90, -180),
    });

    let polygonSeries = chart.series.push(
      am5map.MapPolygonSeries.new(root, {
        geoJSON: am5geodata_worldLow,
      }),
    );

    let lineSeries = chart.series.push(am5map.MapLineSeries.new(root, {}));
    lineSeries.mapLines.template.setAll({
      stroke: root.interfaceColors.get('alternativeBackground'),
      strokeOpacity: 0.3,
    });

    // marker
    let pointSeries = chart.series.push(am5map.MapPointSeries.new(root, {}));

    pointSeries.bullets.push(function () {
      let svgIcon = am5.Graphics.new(root, {
        stroke: am5.color('#fff'),
        fill: am5.color('#f00'),
        showTooltipOn: 'hover',
        scale: 0.2,
        centerX: am5.percent(100),
        centerY: am5.percent(100),
        svgPath:
          'M60.7,45.4C54.1,38.8,45.3,35.2,36,35.2c-9.3,0-18.1,3.6-24.7,10.3C4.6,52,1,60.8,1,70.2c0,6.3,1.5,11.6,4.6,16.7C8.4,91.3,12.1,95,16,98.9c7.3,7.2,15.5,15.4,19,30.5c0.1,0.5,0.5,0.8,1,0.8s0.9-0.3,1-0.8c3.5-15.1,11.7-23.3,19-30.5c3.9-3.9,7.6-7.6,10.4-12.1c3.1-5.1,4.6-10.3,4.6-16.7C71,60.8,67.4,52,60.7,45.4z M36,97.4c-15,0-27.3-12.2-27.3-27.3S21,42.9,36,42.9c15,0,27.3,12.2,27.3,27.3C63.3,85.2,51,97.4,36,97.4z',
      });

      // hover시 svg 이미지 삽입
      // let hoverState = svgIcon.states.create("hover", {
      //   fill: am5.color(0x297373),
      //   stroke: am5.color(0x297373),
      //   scale: 1.3,
      // });
      // console.log("hoverState: ", hoverState);

      //---------------------------------------------------------------------------------------------------------------

      svgIcon.events.on('pointerdown', function (e) {
        // svgIcon({ scale: 2 });
        // svgIcon.set({
        //   stroke: am5.color("#fff"),
        // });
        mapRef.current && mapRef.current.zoomToPoint(e.point, 4, true, 1000);
        // https://www.amcharts.com/docs/v5/reference/mapchart/#zoomToPoint_method
      });

      svgIcon.events.on('pointerup', function (e) {
        /* https://www.amcharts.com/docs/v5/reference/iradarcursorevents/ */
        // svgIcon({ scale: 2 });
        // svgIcon.set({
        //   stroke: am5.color("#fff"),
        // });
        mapRef.current && mapRef.current.zoomToPoint(e.point, 2, false, 1000);
      });

      svgIcon.events.on('click', function (e) {
        console.log('svgIcon click event', e);
        // svgIcon({ scale: 2 });
        // svgIcon.set({
        //   stroke: am5.color("#fff"),
        // });
      });
      //---------------------------------------------------------------------------------------------------------------

      let circle = am5.Circle.new(root, {
        radius: 7,
        tooltipText: 'Drag me!',
        cursorOverStyle: 'pointer',
        tooltipY: 0,
        fill: am5.color('#000'),
        stroke: root.interfaceColors.get('background'),
        strokeWidth: 2,
        draggable: true,
      });

      circle.events.on('dragged', function (event) {
        let dataItem = event.target.dataItem;
        let projection = chart.get('projection');
        let geoPoint = chart.invert({ x: circle.x(), y: circle.y() });

        dataItem.setAll({
          longitude: geoPoint.longitude,
          latitude: geoPoint.latitude,
        });
      });

      return am5.Bullet.new(root, {
        sprite: svgIcon,
      });
    });
    //----------------------------------------------------------------------------------

    let paris = addCity({ latitude: 48.8567, longitude: 2.351 }, 'Paris');
    let toronto = addCity(
      { latitude: 43.8163, longitude: -79.4287 },
      'Toronto',
    );
    let la = addCity({ latitude: 34.3, longitude: -118.15 }, 'Los Angeles');
    let havana = addCity({ latitude: 23, longitude: -82 }, 'Havana');

    let lineDataItem = lineSeries.pushDataItem({
      pointsToConnect: [paris, toronto, la, havana],
    });

    let planeSeries = chart.series.push(am5map.MapPointSeries.new(root, {}));

    let plane = am5.Graphics.new(root, {
      svgPath:
        'm2,106h28l24,30h72l-44,-133h35l80,132h98c21,0 21,34 0,34l-98,0 -80,134h-35l43,-133h-71l-24,30h-28l15,-47',
      scale: 0.06,
      centerY: am5.p50,
      centerX: am5.p50,
      fill: am5.color(0x000000),
    });

    planeSeries.bullets.push(function () {
      let container = am5.Container.new(root, {});
      container.children.push(plane);
      return am5.Bullet.new(root, { sprite: container });
    });

    let planeDataItem = planeSeries.pushDataItem({
      lineDataItem: lineDataItem,
      positionOnLine: 0,
      autoRotate: true,
    });

    planeDataItem.animate({
      key: 'positionOnLine',
      to: 1,
      duration: 10000,
      loops: Infinity,
      easing: am5.ease.yoyo(am5.ease.linear),
    });

    planeDataItem.on('positionOnLine', function (value) {
      if (value >= 0.99) {
        plane.set('rotation', 180);
      } else if (value <= 0.01) {
        plane.set('rotation', 0);
      }
    });

    function addCity(coords, title) {
      return pointSeries.pushDataItem({
        latitude: coords.latitude,
        longitude: coords.longitude,
      });
    }

    // Make stuff animate on load
    chart.appear(1000, 100);

    return () => {
      root.dispose();
    };
  }, []);

  return (
    <>
      <div id="chartdiv" style={{ width: '100%', height: '500px' }}></div>
      {/* //--------------------------------------------------------------------------------------------------------------- */}
      <div>
        <button onClick={zoomInBtn}>zoom in</button>
        <button onClick={zoomOutBtn}>zoom out</button>
      </div>
      <div className="page-change">
        <button onClick={clickToDetailPage}>GSAP</button>
      </div>
      {/* //--------------------------------------------------------------------------------------------------------------- */}
    </>
  );
}
