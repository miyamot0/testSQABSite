/** @license
 *
 * Copyright (c) Shawn P. Gilroy, Louisiana State University.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { useState, useEffect } from 'react';

import {
  MDBCard,
  MDBCardBody,
  MDBCardTitle,
  MDBCardText,
  MDBRow,
  MDBCol,
  MDBBtn,
} from 'mdb-react-ui-kit';

import { HotColumn, HotTable } from '@handsontable/react';

import { CardBodyTextStyle } from '../../utilities/StyleHelper';

import './Tools.css';
import { WorkerPmaxResult } from './helpers/PmaxHelpers';
import { renderExponentialDemand } from './helpers/DemandHelpers';

export default function AnalyticPmax(): JSX.Element {
  const [hotData, setHotData] = useState<any[][]>();
  const [hotData2, setHotData2] = useState<any[][]>();
  const [runningCalculation, setRunningCalculation] = useState<boolean>(false);

  let worker: Worker | undefined = undefined;

  useEffect(() => {
    setHotData([
      ['', '', '', '', ''],
      ['', '', '', '', ''],
      ['', '', '', '', ''],
      ['', '', '', '', ''],
      ['', '', '', '', ''],
      ['', '', '', '', ''],
      ['', '', '', '', ''],
      ['', '', '', '', ''],
      ['', '', '', '', ''],
      ['', '', '', '', ''],
      ['', '', '', '', ''],
      ['', '', '', '', ''],
      ['', '', '', '', ''],
      ['', '', '', '', ''],
      ['', '', '', '', ''],
    ]);
  }, []);

  /**
   * loadExampleData
   */
  function loadExampleData(): void {
    setHotData([
      ['4.1849', '0.00518467', '5.31159', '', ''],
      ['6.20081', '0.00315093', '5.31159', '', ''],
      ['3.91589', '0.00290809', '5.31159', '', ''],
      ['6.19246', '0.00259647', '5.31159', '', ''],
      ['6.50739', '0.00252394', '5.31159', '', ''],
      ['8.32759', '0.00294164', '5.31159', '', ''],
      ['7.14605', '0.00245646', '5.31159', '', ''],
      ['10.8495', '0.00260554', '5.31159', '', ''],
      ['5.69435', '0.00250289', '5.31159', '', ''],
      ['4.92234', '0.00239768', '5.31159', '', ''],
      ['', '', '', '', ''],
      ['', '', '', '', ''],
      ['', '', '', '', ''],
      ['', '', '', '', ''],
      ['', '', '', '', ''],
    ]);
  }

  /** calculatePmax
   *
   */
  function calculatePmax(): void {
    if (worker !== undefined) {
      return;
    }

    worker = new Worker('./workers/worker_pmax.js');
    worker.onmessage = handleWorkerOutput;
    worker.postMessage({ data: hotData });
  }

  /** handleWorkerOutput
   *
   * @param {WorkerOutput} obj
   */
  function handleWorkerOutput(obj: any): void {
    const data = obj.data as WorkerPmaxResult;

    if (data.done) {
      worker = undefined;
      setHotData(data.sheet);
      setHotData2(data.sheet);

      setRunningCalculation(false);
      return;
    }
  }

  /** generateOutputScore
   *
   * @param {number} qd
   * @param {number} pd
   * @returns {number}
   */
  function generateOutputScore(qd: number, pd: number): string {
    return `${qd.toPrecision(5)} / ${pd.toPrecision(5)}`;
  }

  /** generateSlope
   *
   * @param {number} qd
   * @param {number} pd
   */
  function generateSlope(qd: number, pd: number): string {
    if (qd < 0.001 && pd < 0.001) {
      return '-1';
    } else {
      return (qd / pd).toFixed(8);
    }
  }

  /** generateStringOutput
   *
   * Make output for side panel
   *
   * @param {string[]} row string array from table
   * @param {number} index index
   * @returns {JSX.Element}
   */
  function generateStringOutput(row: string[], index: number): JSX.Element {
    if (row[0].trim().length === 0) {
      return <div key={index}></div>;
    }

    const rowInNumbers = row.map(Number);

    var pDelta = 0.01;

    // Scale prices into log units
    const P1 = Math.log10(rowInNumbers[3]);
    const P2 = Math.log10(rowInNumbers[3]) + pDelta;

    // Get consumption values (already in log units)
    const Q1 = renderExponentialDemand(rowInNumbers[0], rowInNumbers[1], rowInNumbers[2], P1);
    const Q2 = renderExponentialDemand(rowInNumbers[0], rowInNumbers[1], rowInNumbers[2], P2);

    // Calculate deltas
    const QD = (10 ^ Q2) - (10 ^ Q1);
    const PD = (10 ^ P2) - (10 ^ P1);

    const pmaxNew = parseFloat(row[3]);
    const pmaxOld = parseFloat(row[4]);
    const kValue = parseFloat(row[2]);

    const noteString =
      kValue >= Math.E / Math.log(10)
        ? 'Note: Determined through exact solution using Lambert W function.'
        : 'Note: Solved directly referencing empirical slope.';

    return (
      <div key={index}>
        <h5>{`Row #${index + 1}`}</h5>
        <p className="toolTextOutputStyle">
          Analytical{' '}
          <i>
            P<sub>MAX</sub>
          </i>{' '}
          = {pmaxNew} <br />
          Approxmiate{' '}
          <i>
            P<sub>MAX</sub>
          </i>{' '}
          = {pmaxOld} <br />
          &Delta;Q/&Delta;P (Log/Log) +/- %1 Unit Price = {generateOutputScore(QD, PD)} ={' '}
          {generateSlope(QD, PD)}
          <br />
          {noteString}{' '}
        </p>
      </div>
    );
  }

  return (
    <>
      <MDBRow center className="row-eq-height">
        <MDBCol sm="8">
          <MDBCard>
            <MDBCardBody>
              <MDBCardTitle>
                Analytical P<sub>MAX</sub> Calculator
              </MDBCardTitle>
              <MDBCardText style={CardBodyTextStyle} className="toolsDescription">
                The Analytical P<sub>MAX</sub> Calculator is a web-based tool for determining the
                point of unit elasticity, or more literally, peak work. This calculator streamlines
                the determination of an exact (Analytic) unit elasticity (i.e., slope = -1) using a
                simple, copy-paste interface. This is a more accurate method of calculating P
                <sub>MAX</sub>, one free from the error of approximations. Both the Approximate and
                Exact (Analytic) P<sub>MAX</sub> measures are provided here, though the approximated
                value is presented here purely for historical purposes.
                <br />
                <br />
                <b>Based on the following works:</b>
                <br />
                Gilroy, S.P., Kaplan, B.A., Reed, D.D., Hantula, D.A., &#38; Hursh, S. R. (2019). An
                Exact Solution for Unit Elasticity in the Exponential Model of Demand.{' '}
                <i>Journal of Experimental and Clinical Psychopharmacology, 27(6)</i>, 588-597. doi:{' '}
                <a href="https://psycnet.apa.org/doi/10.1037/pha0000268">10.1037/pha0000268</a>.
                <br />
                <br />
                Gilroy, S. P., Kaplan, B. A., &#38; Reed, D. D. (2020). Interpretation (s) of
                elasticity in operant demand.{' '}
                <i>Journal of the Experimental Analysis of Behavior, 114(1)</i>, 106-115. doi:{' '}
                <a href="https://doi.org/10.1002/jeab.610">10.1002/jeab.610</a>.
              </MDBCardText>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </MDBRow>

      <MDBRow center>
        <MDBCol sm="8">
          <hr className="additional-margin" />
        </MDBCol>
      </MDBRow>

      <MDBRow center className="row-eq-height">
        <MDBCol sm="4">
          <MDBCard>
            <MDBCardBody>
              <MDBCardTitle>
                P<sub>MAX</sub> Calculator
              </MDBCardTitle>
              <MDBCardText style={CardBodyTextStyle} className="toolsDescription">
                This calculator evaluates models of operant demand (see{' '}
                <a href="https://psycnet.apa.org/doi/10.1037/0033-295X.115.1.186">
                  Hursh &#38; Silberberg, 2008
                </a>
                ) to determine a point where one log-unit increase in price corresponds to a one
                log-unit decrease in consumption, i.e., P<sub>MAX</sub>. This has be done using
                numerical approximations or through more computationally-exhaustive iterative
                methods, using the first order derivative, but newer exact solution (Analytic)
                methods now exist.
                <br />
                <br />
                To calculate exact solution P<sub>MAX</sub>, you may paste the fitted Q0, alpha, and
                K parameters from the model of demand into the spreadsheet component (in their
                respective columns). Once entered, simply press the "Calculate" button to calculate
                the Analytical P<sub>MAX</sub>. Additionally, the Approxiate P<sub>MAX</sub> will
                also be outputted in the spreadsheet component, in its respective column, though
                users are recommended to refer to the exact approach whenever possible.
                <br />
                <br />
                Optionally, you may preview this method using a sample data by pressing the "Load
                Sample Data" button and then pressing "Calculate". This will let you view the
                differences between the Approximate and Analytical P<sub>MAX</sub>.
              </MDBCardText>

              <MDBBtn
                noRipple
                style={{
                  width: '100%',
                  marginBottom: '25px',
                }}
                tag="a"
                href="#!"
                className="button-fit-card"
                disabled={runningCalculation}
                onClick={() => loadExampleData()}
              >
                Load Example Data
              </MDBBtn>

              <HotTable
                data={hotData}
                colHeaders={true}
                rowHeaders={true}
                height="auto"
                stretchH="all"
                style={{ marginTop: '25px', marginBottom: '25px' }}
                columnSorting={false}
                columns={[
                  { data: 0, type: 'string' },
                  { data: 1, type: 'string' },
                  { data: 2, type: 'string' },
                  { data: 3, type: 'string' },
                  { data: 4, type: 'string' },
                ]}
                contextMenu={true}
                licenseKey="non-commercial-and-evaluation"
              >
                <HotColumn title="Q0" />
                <HotColumn title="Alpha" />
                <HotColumn title="K" />
                <HotColumn title="Analytical" />
                <HotColumn title="Approximate" />
              </HotTable>

              <MDBBtn
                noRipple
                style={{
                  width: '100%',
                  marginTop: '25px',
                }}
                tag="a"
                href="#!"
                className="button-fit-card"
                disabled={runningCalculation}
                onClick={() => {
                  setRunningCalculation(true);
                  calculatePmax();
                }}
              >
                Calculate
              </MDBBtn>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
        <MDBCol md="4">
          <MDBCard className="outputPanel">
            <MDBCardBody>
              <MDBCardTitle>
                P<sub>MAX</sub> Output Logs
              </MDBCardTitle>
              <MDBCardText style={CardBodyTextStyle}></MDBCardText>
              {hotData2?.map((row, index) => generateStringOutput(row, index))}
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </MDBRow>
    </>
  );
}
