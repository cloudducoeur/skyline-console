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
import { DashboardOutlined, CodeOutlined, BookOutlined } from '@ant-design/icons';
import * as THREE from 'three';
import NET from 'vanta/dist/vanta.net.min';

import logo from 'asset/image/logo.png';
import styles from './index.less';

class VantaCloudsBackground extends Component {
  constructor(props) {
    super(props);
    this.vantaRef = React.createRef();
    this.vantaEffect = null;
  }

  componentDidMount() {
    this.vantaEffect = NET({
      el: this.vantaRef.current,
      THREE,
      mouseControls: true,
      touchControls: true,
      gyroControls: false,
      minHeight: 200,
      minWidth: 200,
      backgroundColor: 0x7ac3ed,
      color: 0xffffff,
      points: 12,
      maxDistance: 20,
      spacing: 18,
    });
  }

  componentWillUnmount() {
    if (this.vantaEffect) {
      this.vantaEffect.destroy();
    }
  }

  render() {
    return <div className={styles['vanta-bg']} ref={this.vantaRef} />;
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
        <VantaCloudsBackground />
        <div className={styles['hero']}>
          <p className={styles['hero-eyebrow']}>Bienvenue sur</p>
          <h1 className={styles['hero-title']}>Au Cœur du Cloud</h1>
          <p className={styles['hero-subtitle']}>
            Votre infrastructure OpenStack, simple et souveraine.
          </p>
        </div>
        <div className={styles['quick-access']}>
          <p className={styles['quick-access-title']}>Accès rapide</p>
          <a
            href="https://observabilite.aucoeurdu.cloud"
            target="_blank"
            rel="noopener noreferrer"
            className={styles['quick-access-btn']}
          >
            <DashboardOutlined /> Observabilité
          </a>
          <a
            href="https://forge.aucoeurdu.cloud"
            target="_blank"
            rel="noopener noreferrer"
            className={styles['quick-access-btn']}
          >
            <CodeOutlined /> Forge
          </a>
          <a
            href="https://doc.aucoeurdu.cloud/doc/openstack/"
            target="_blank"
            rel="noopener noreferrer"
            className={styles['quick-access-btn']}
          >
            <BookOutlined /> Documentation
          </a>
        </div>
      </div>
    );
  }

  render() {
    return (
      <div className={styles.container}>
        <div className={styles.left}>
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
        <div className={styles['footer']}>
          <p className={styles['footer-text']}>© 2026 Cloud du Coeur. Tous droits réservés.</p>
        </div>
      </div>
    );
  }
}

export default inject('rootStore')(observer(AuthLayout));
