// Copyright 2021 99cloud
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import renderRoutes from 'utils/RouterConfig';
import { FileTextOutlined } from '@ant-design/icons';

import logo from 'asset/image/logo.png';
import styles from './index.less';

class AnimatedLoginBackground extends Component {
  constructor(props) {
    super(props);

    this.canvasRef = React.createRef();
    this.points = [];
    this.animationFrame = null;
    this.handleResize = this.handleResize.bind(this);
    this.animate = this.animate.bind(this);
  }

  componentDidMount() {
    this.setupCanvas();
    window.addEventListener('resize', this.handleResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }
  }

  handleResize() {
    this.setupCanvas();
  }

  setupCanvas() {
    const canvas = this.canvasRef.current;
    if (!canvas) {
      return;
    }
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
    const count = Math.max(30, Math.floor((rect.width * rect.height) / 28000));
    this.points = Array.from({ length: count }).map(() => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: 1 + Math.random() * 3,
      vx: -0.4 + Math.random() * 0.8,
      vy: -0.35 + Math.random() * 0.7,
      alpha: 0.25 + Math.random() * 0.55,
    }));
    this.animate();
  }

  animate() {
    const canvas = this.canvasRef.current;
    if (!canvas) {
      return;
    }
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return;
    }

    ctx.fillStyle = '#e5007d';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    this.points.forEach((point) => {
      point.x += point.vx;
      point.y += point.vy;

      if (point.x < -20) {
        point.x = canvas.width + 20;
      }
      if (point.x > canvas.width + 20) {
        point.x = -20;
      }
      if (point.y < -20) {
        point.y = canvas.height + 20;
      }
      if (point.y > canvas.height + 20) {
        point.y = -20;
      }

      ctx.beginPath();
      ctx.fillStyle = `rgba(255, 255, 255, ${point.alpha})`;
      ctx.arc(point.x, point.y, point.r, 0, Math.PI * 2);
      ctx.fill();
    });

    for (let i = 0; i < this.points.length; i += 1) {
      for (let j = i + 1; j < this.points.length; j += 1) {
        const p1 = this.points[i];
        const p2 = this.points[j];
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < 120) {
          const opacity = (1 - distance / 120) * 0.2;
          ctx.beginPath();
          ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
          ctx.lineWidth = 1;
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
      }
    }

    this.animationFrame = requestAnimationFrame(this.animate);
  }

  render() {
    return <canvas className={styles['animated-bg-canvas']} ref={this.canvasRef} />;
  }
}

export class AuthLayout extends Component {
  constructor(props) {
    super(props);

    this.routes = props.route.routes;
  }

  renderRight() {
    return (
      <div className={styles.right}>
        <AnimatedLoginBackground />
        <div className={styles['full-image-front']} />
      </div>
    );
  }

  render() {
    return (
      <div className={styles.container}>
        <div className={styles.left}>
          <div className={styles.lang}>
            <a
              href="https://doc.aucoeurdu.cloud/doc/openstack/"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.docLink}
              title="Documentation"
            >
              <FileTextOutlined />
            </a>
          </div>
          <div className={styles.main}>
            <div className={styles.top}>
              <div className={styles.header}>
                <img alt="logo" className={styles.logo} src={logo} />
              </div>
            </div>
            {renderRoutes(this.routes)}
          </div>
        </div>
        {this.renderRight()}
      </div>
    );
  }
}

export default inject('rootStore')(observer(AuthLayout));
