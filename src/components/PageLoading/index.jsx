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

import React from 'react';
import logo from 'asset/image/logo.png';

const PageLoading = (props) => {
  const { className } = props;
  return (
    <>
      <style>
        {`
          @keyframes sl-logo-loader {
            0% {
              transform: scale(0.92) rotate(0deg);
              opacity: 0.7;
            }
            50% {
              transform: scale(1) rotate(4deg);
              opacity: 1;
            }
            100% {
              transform: scale(0.92) rotate(0deg);
              opacity: 0.7;
            }
          }
        `}
      </style>
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#ffffff',
        }}
        className={className}
      >
        <img
          src={logo}
          alt="Chargement"
          style={{
            width: '140px',
            maxWidth: '40vw',
            animation: 'sl-logo-loader 1.8s ease-in-out infinite',
            transformOrigin: 'center center',
            filter: 'drop-shadow(0 10px 24px rgba(0, 0, 0, 0.18))',
          }}
        />
      </div>
    </>
  );
};

export default PageLoading;
