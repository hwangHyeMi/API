import React, { Component } from 'react';
import CanvasJSReact from '@canvasjs/react-charts';
import * as Bts from 'react-bootstrap';
import * as Icon from 'react-bootstrap-icons';
//var CanvasJSReact = require('@canvasjs/react-charts');
var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

const HOME_PATH = `${process.env.REACT_APP_HOME_PATH}`;

// 통신 데이터 샘플
// https://canvasjs.com/react-charts/json-data-api-ajax-chart/
class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = { dataPoints1: [], dataPoints2: [], isLoaded1: false, colorMode: localStorage.getItem('data-bs-theme'), dataPoints3: [], isLoaded2: false };
  }

  render() {
    const options = {
      theme: this.state.colorMode + '2', //'light2', // "light1", "dark1", "dark2"
      animationEnabled: true,
      exportEnabled: true,
      title: {
        text: 'Login History',
      },
      axisX: {
        interval: 1,
        suffix: ' hr',
      },
      axisY: {
        title: 'Count (the)',
        suffix: ' the',
      },
      toolTip: {
        shared: true,
      },
      legend: {
        dockInsidePlotArea: true,
        horizontalAlign: 'right',
      },
      // credit 비노출 [이것을 빈 문자열로 설정하면 신용 링크가 비활성화됩니다(상업적 라이선스 필요). 사용자 지정 브랜딩에도 사용할 수 있습니다.]
      // https://canvasjs.com/docs/charts/chart-options/
      creditText: '',
      creditHref: '',
      data: [
        {
          type: 'spline',
          xValueFormatString: '##hr',
          yValueFormatString: '#,##0 the',
          name: 'Success Count',
          showInLegend: true,
          dataPoints: this.state.dataPoints1,
        },
        {
          type: 'spline',
          xValueFormatString: '##hr',
          yValueFormatString: '#,##0 the',
          name: 'Fail Count',
          showInLegend: true,
          dataPoints: this.state.dataPoints2,
        },
      ],
    };
    const options2 = {
      theme: this.state.colorMode + '2', //'light2', // "light1", "dark1", "dark2"
      exportEnabled: true,
      animationEnabled: true,
      title: {
        text: 'Website Traffic Sources',
      },
      data: [
        {
          type: 'pie',
          startAngle: 75,
          toolTipContent: '<b>{label}</b>: {y}%',
          showInLegend: 'true',
          legendText: '{label}',
          indexLabelFontSize: 16,
          indexLabel: '{label} - {y}%',
          //dataPoints: this.state.dataPoints3,
          dataPoints: [
            { y: 18, label: 'Direct' },
            { y: 49, label: 'Organic Search' },
            { y: 9, label: 'Paid Search' },
            { y: 5, label: 'Referral' },
            { y: 19, label: 'Social' },
          ],
        },
      ],
    };
    return (
      <>
        <h1 className="mt-4">Dashboard [링크 정상 작동 중]</h1>
        <ol className="breadcrumb mb-4">
          <li className="breadcrumb-item active">Dashboard</li>
        </ol>
        <div className="row">
          <div className="col-xl-3 col-md-6">
            <div className="card bg-primary text-white mb-4">
              <div className="card-body">Paginate Board</div>
              <div className="card-footer d-flex align-items-center justify-content-between">
                <a className="small text-white stretched-link" href={HOME_PATH + '/8/hm/DevSearchList'}>
                  View Details
                </a>
                <div className="small text-white">
                  <i className="fas fa-angle-right"></i>
                </div>
              </div>
            </div>
          </div>
          <div className="col-xl-3 col-md-6">
            <div className="card bg-warning text-white mb-4">
              <div className="card-body">Dev Assembl</div>
              <div className="card-footer d-flex align-items-center justify-content-between">
                <a className="small text-white stretched-link" href={HOME_PATH + '/8/sj/DevAssembl'}>
                  View Details
                </a>
                <div className="small text-white">
                  <i className="fas fa-angle-right"></i>
                </div>
              </div>
            </div>
          </div>
          <div className="col-xl-3 col-md-6">
            <div className="card bg-success text-white mb-4">
              <div className="card-body">TodoList</div>
              <div className="card-footer d-flex align-items-center justify-content-between">
                <a className="small text-white stretched-link" href={HOME_PATH + '/8/dev/TodoList'}>
                  View Details
                </a>
                <div className="small text-white">
                  <i className="fas fa-angle-right"></i>
                </div>
              </div>
            </div>
          </div>
          <div className="col-xl-3 col-md-6">
            <div className="card bg-danger text-white mb-4">
              <div className="card-body">무한 스크롤(Outer Data)</div>
              <div className="card-footer d-flex align-items-center justify-content-between">
                <a className="small text-white stretched-link" href={HOME_PATH + '/8/sj/DevListScroll'}>
                  View Details
                </a>
                <div className="small text-white">
                  <i className="fas fa-angle-right"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-xl-6">
            <div className="card mb-4">
              <div className="card-header">
                <i className="fas fa-chart-area me-1"></i>
                Chart with Multiple Axes
              </div>
              <div className="card-body">
                <div>
                  {this.state.isLoaded1 && <CanvasJSChart options={options} onRef={(ref) => (this.chart = ref)} />}
                  {/*You can get reference to the chart instance as shown above using onRef. This allows you to access all chart properties and methods*/}
                </div>
              </div>
            </div>
          </div>
          <div className="col-xl-6">
            <div className="card mb-4">
              <div className="card-header">
                <Icon.PieChart></Icon.PieChart>
                Pie Chart Example
              </div>
              <div className="card-body">
                <div>
                  {this.state.isLoaded2 && <CanvasJSChart options={options2} onRef={(ref) => (this.chart = ref)} />}
                  {/*You can get reference to the chart instance as shown above using onRef. This allows you to access all chart properties and methods*/}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-xl-6">
            <div className="card mb-4">
              <div className="card-header">
                <Bts.Spinner animation="border" size="sm" />
                Spinners Example
              </div>
              <div className="card-body">
                <div>
                  <Bts.Spinner animation="border" variant="primary" />
                  <Bts.Spinner animation="border" variant="secondary" />
                  <Bts.Spinner animation="border" variant="success" />
                  <Bts.Spinner animation="border" variant="danger" />
                  <Bts.Spinner animation="border" variant="warning" />
                  <Bts.Spinner animation="border" variant="info" />
                  <Bts.Spinner animation="border" variant="light" />
                  <Bts.Spinner animation="border" variant="dark" />
                  <Bts.Spinner animation="grow" variant="primary" />
                  <Bts.Spinner animation="grow" variant="secondary" />
                  <Bts.Spinner animation="grow" variant="success" />
                  <Bts.Spinner animation="grow" variant="danger" />
                  <Bts.Spinner animation="grow" variant="warning" />
                  <Bts.Spinner animation="grow" variant="info" />
                  <Bts.Spinner animation="grow" variant="light" />
                  <Bts.Spinner animation="grow" variant="dark" />
                </div>
                <div>
                  <Bts.Spinner animation="border" size="sm" />
                  <Bts.Spinner animation="border" />
                  <Bts.Spinner animation="grow" size="sm" />
                  <Bts.Spinner animation="grow" />
                </div>
                <div>
                  <Bts.Button variant="primary" disabled>
                    <Bts.Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                    <span className="visually-hidden">Loading...</span>
                  </Bts.Button>
                  <Bts.Button variant="primary" disabled>
                    <Bts.Spinner as="span" animation="grow" size="sm" role="status" aria-hidden="true" />
                    Loading...
                  </Bts.Button>
                </div>
              </div>
            </div>
          </div>
          <div className="col-xl-6">
            <div className="card mb-4">
              <div className="card-header">
                <Icon.Dropbox></Icon.Dropbox>
                Dropdowns Example
              </div>
              <div className="card-body">
                <div>
                  {['Primary', 'Secondary', 'Success', 'Info', 'Warning', 'Danger'].map((variant) => (
                    <Bts.DropdownButton as={Bts.ButtonGroup} key={variant} id={`dropdown-variants-${variant}`} variant={variant.toLowerCase()} title={variant}>
                      <Bts.Dropdown.Item eventKey="1">Action</Bts.Dropdown.Item>
                      <Bts.Dropdown.Item eventKey="2">Another action</Bts.Dropdown.Item>
                      <Bts.Dropdown.Item eventKey="3" active>
                        Active Item
                      </Bts.Dropdown.Item>
                      <Bts.Dropdown.Divider />
                      <Bts.Dropdown.Item eventKey="4">Separated link</Bts.Dropdown.Item>
                    </Bts.DropdownButton>
                  ))}
                </div>
                <div>
                  {['Primary', 'Secondary', 'Success', 'Info', 'Warning', 'Danger'].map((variant) => (
                    <Bts.SplitButton key={variant} id={`dropdown-split-variants-${variant}`} variant={variant.toLowerCase()} title={variant}>
                      <Bts.Dropdown.Item eventKey="1">Action</Bts.Dropdown.Item>
                      <Bts.Dropdown.Item eventKey="2">Another action</Bts.Dropdown.Item>
                      <Bts.Dropdown.Item eventKey="3" active>
                        Active Item
                      </Bts.Dropdown.Item>
                      <Bts.Dropdown.Divider />
                      <Bts.Dropdown.Item eventKey="4">Separated link</Bts.Dropdown.Item>
                    </Bts.SplitButton>
                  ))}
                </div>
                <div>
                  {[Bts.DropdownButton, Bts.SplitButton].map((DropdownType, idx) => (
                    <DropdownType as={Bts.ButtonGroup} key={idx} id={`dropdown-button-drop-${idx}`} size="lg" title="Drop large">
                      <Bts.Dropdown.Item eventKey="1">Action</Bts.Dropdown.Item>
                      <Bts.Dropdown.Item eventKey="2">Another action</Bts.Dropdown.Item>
                      <Bts.Dropdown.Item eventKey="3">Something else here</Bts.Dropdown.Item>
                      <Bts.Dropdown.Divider />
                      <Bts.Dropdown.Item eventKey="4">Separated link</Bts.Dropdown.Item>
                    </DropdownType>
                  ))}

                  {[Bts.DropdownButton, Bts.SplitButton].map((DropdownType, idx) => (
                    <DropdownType as={Bts.ButtonGroup} key={idx} id={`dropdown-button-drop-${idx}`} size="sm" variant="secondary" title="Drop small">
                      <Bts.Dropdown.Item eventKey="1">Action</Bts.Dropdown.Item>
                      <Bts.Dropdown.Item eventKey="2">Another action</Bts.Dropdown.Item>
                      <Bts.Dropdown.Item eventKey="3">Something else here</Bts.Dropdown.Item>
                      <Bts.Dropdown.Divider />
                      <Bts.Dropdown.Item eventKey="4">Separated link</Bts.Dropdown.Item>
                    </DropdownType>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="card mb-4">
          <div className="card-header">
            <i className="fas fa-table me-1"></i>
            DataTable Example
          </div>
          <div className="card-body">
            <Bts.Table striped bordered hover>
              <thead>
                <tr>
                  <th>#</th>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Username</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1</td>
                  <td>Mark</td>
                  <td>Otto</td>
                  <td>@mdo</td>
                </tr>
                <tr>
                  <td>2</td>
                  <td>Jacob</td>
                  <td>Thornton</td>
                  <td>@fat</td>
                </tr>
                <tr>
                  <td>3</td>
                  <td colSpan={2}>Larry the Bird</td>
                  <td>@twitter</td>
                </tr>
              </tbody>
            </Bts.Table>
          </div>
        </div>
      </>
    );
  }
  componentDidMount() {
    const DASHBOARD_URL = `${process.env.REACT_APP_API_URL + process.env.REACT_APP_DASHBOARD_URL}`;
    fetch(DASHBOARD_URL + '/getChart1')
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log(data);
        /*
        var dps = [];

        for (var i = 0; i < data.length; i++) {
          dps.push({
            x: new Date(data[i].x),
            y: data[i].y,
          });
        }
        */
        this.setState({
          isLoaded1: true,
          dataPoints1: data.points1,
          dataPoints2: data.points2,
          isLoaded2: true,
          dataPoints3: data.points3,
        });
      });
  }
  //componentDidUpdate() {}
}
export default Dashboard;
