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
import { Card } from 'antd';
import moment from 'moment';
import { inject, observer } from 'mobx-react';
import BaseContent from 'components/PrometheusChart/component/BaseContent';
import { ChartType } from 'components/PrometheusChart/utils/utils';
import { handleResponses } from 'components/PrometheusChart/utils/dataHandler';
import { getSuitableValue } from 'resources/prometheus/monitoring';
import styles from '../style.less';

const defaultRange = [moment().subtract(1, 'weeks'), moment()];

const createChart = (title, metricKey, yScale = { nice: true }) => ({
  title,
  span: 12,
  createFetchParams: {
    requestType: 'range',
    metricKey,
  },
  handleDataParams: {
    formatDataFn: handleResponses,
  },
  fetchDataParams: {
    currentRange: defaultRange,
    interval: 3600,
  },
  chartProps: {
    height: 240,
    chartType: ChartType.ONELINE,
    scale: {
      y: yScale,
    },
  },
});

export class ResourceTrends extends Component {
  get enableCinder() {
    return this.props.rootStore.checkEndpoint('cinder');
  }

  get enableNeutron() {
    return this.props.rootStore.checkEndpoint('neutron');
  }

  get chartCardList() {
    const list = [
      createChart(t('Instances Trend'), 'monitorOverview.adminInstancesCount'),
      createChart(t('vCPUs Trend'), 'monitorOverview.adminVcpusUsed'),
      createChart(t('Memory Trend'), 'monitorOverview.adminMemoryUsed', {
        nice: true,
        formatter: (value) => getSuitableValue(value, 'memory', 0),
      }),
    ];

    if (this.enableCinder) {
      list.push(
        createChart(t('Volumes Trend'), 'monitorOverview.adminVolumesCount'),
        createChart(
          t('Volume Capacity Trend'),
          'monitorOverview.adminVolumeCapacityUsed',
          {
            nice: true,
            formatter: (value) => `${Number(value || 0).toFixed(2)}GiB`,
          }
        )
      );
    }

    if (this.enableNeutron) {
      list.push(
        createChart(t('Networks Trend'), 'monitorOverview.adminNetworksCount'),
        createChart(t('Ports Trend'), 'monitorOverview.adminPortsCount')
      );
    }

    return list;
  }

  render() {
    return (
      <Card
        className={styles['resource-trends']}
        title={t('Resource Trends (Last 7 Days)')}
        bordered={false}
      >
        <BaseContent
          renderNodeSelect={false}
          renderTimeRangeSelect={false}
          defaultRange={defaultRange}
          chartConfig={{
            topCardList: [],
            chartCardList: this.chartCardList,
          }}
        />
      </Card>
    );
  }
}

export default inject('rootStore')(observer(ResourceTrends));
