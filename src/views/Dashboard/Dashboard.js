import React, { Component, lazy, Suspense } from 'react';

import { getStyle, hexToRgba } from '@coreui/coreui/dist/js/coreui-utilities'

const Widget03 = lazy(() => import('../../views/Widgets/Widget03'));

const brandPrimary = getStyle('--primary')
const brandSuccess = getStyle('--success')
const brandInfo = getStyle('--info')
const brandWarning = getStyle('--warning')
const brandDanger = getStyle('--danger')

class Dashboard extends Component {

  loading = () => <div className="animated fadeIn pt-1 text-center">Loading...</div>

  render() {
    return (
      <div className="animated fadeIn">
      </div>
    );
  }
}

export default Dashboard;
